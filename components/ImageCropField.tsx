"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import NextImage from "next/image";
import Cropper, { type Area, type Point } from "react-easy-crop";

import { StorageService, uploadToPresignedPost } from "@/service";

type AspectOption = {
  label: string;
  aspect: number;
  ratio: "1:1" | "4:3" | "3:4";
  outputWidth: number;
  outputHeight: number;
};

const aspectOptions: AspectOption[] = [
  { label: "Square (1:1)", aspect: 1, ratio: "1:1", outputWidth: 1024, outputHeight: 1024 },
  { label: "Landscape (4:3)", aspect: 4 / 3, ratio: "4:3", outputWidth: 1200, outputHeight: 900 },
  { label: "Portrait (3:4)", aspect: 3 / 4, ratio: "3:4", outputWidth: 900, outputHeight: 1200 },
];

async function createImage(src: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = (e: unknown) => reject(e);
    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

async function cropToBlob(args: {
  imageSrc: string;
  pixelCrop: Area;
  outputWidth: number;
  outputHeight: number;
}): Promise<Blob> {
  const image = await createImage(args.imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(args.outputWidth));
  canvas.height = Math.max(1, Math.round(args.outputHeight));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  ctx.drawImage(
    image,
    args.pixelCrop.x,
    args.pixelCrop.y,
    args.pixelCrop.width,
    args.pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to crop image"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.92
    );
  });
}

export type ImageCropFieldValue = {
  originalFile: File;
  croppedBlob: Blob;
  previewUrl: string;
  uploadedKey: string;
  aspectRatio: "1:1" | "4:3" | "3:4";
  targetWidth: number;
  targetHeight: number;
};

type ImageCropFieldProps = {
  value?: ImageCropFieldValue;
  onChange: (next: ImageCropFieldValue | undefined) => void;
  uploadFolder: string;
  existingImageUrl?: string | null;
};

export function ImageCropField({ value, onChange, uploadFolder, existingImageUrl }: ImageCropFieldProps) {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [aspectLabel, setAspectLabel] = useState<string>(aspectOptions[0]?.label ?? "Square (1:1)");

  const selected = useMemo(() => {
    return aspectOptions.find((a) => a.label === aspectLabel) ?? aspectOptions[0];
  }, [aspectLabel]);

  const lastPreviewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  useEffect(() => {
    return () => {
      if (lastPreviewUrlRef.current) URL.revokeObjectURL(lastPreviewUrlRef.current);
    };
  }, []);

  const onFileSelected = (file: File | null) => {
    if (!file) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      setSourceUrl(null);
      setOriginalFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setUploadError(null);
      onChange(undefined);
      return;
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);

    const nextUrl = URL.createObjectURL(file);
    setSourceUrl(nextUrl);
    setOriginalFile(file);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setUploadError(null);
    onChange(undefined);
  };

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const onApplyCrop = async () => {
    if (!sourceUrl) return;
    if (!originalFile) return;
    if (!croppedAreaPixels) return;
    if (!selected) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const blob = await cropToBlob({
        imageSrc: sourceUrl,
        pixelCrop: croppedAreaPixels,
        outputWidth: selected.outputWidth,
        outputHeight: selected.outputHeight,
      });

      const contentType = "image/jpeg";

      const { url, fields, key } = await StorageService.getAdminUploadUrl({
        folder: uploadFolder,
        contentType,
      });

      const file = new File([blob], "image.jpg", { type: contentType });
      await uploadToPresignedPost({ url, fields, file });

      if (lastPreviewUrlRef.current) URL.revokeObjectURL(lastPreviewUrlRef.current);
      const previewUrl = URL.createObjectURL(blob);
      lastPreviewUrlRef.current = previewUrl;

      onChange({
        originalFile,
        croppedBlob: blob,
        previewUrl,
        uploadedKey: key,
        aspectRatio: selected.ratio,
        targetWidth: selected.outputWidth,
        targetHeight: selected.outputHeight,
      });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-gray-700">Image</label>
        {value?.previewUrl ? (
          <a
            href={value.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Open preview
          </a>
        ) : null}
      </div>

      {!sourceUrl && !value && existingImageUrl ? (
        <div className="flex items-center gap-3">
          <div className="h-30 w-30 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <NextImage
              src={existingImageUrl}
              alt="Current image"
              width={150}
              height={150}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xs text-gray-500">Current image</span>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Change
          </button>
        </div>
      ) : null}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
        className={existingImageUrl && !sourceUrl && !value ? "hidden" : "block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-50"}
      />

      {sourceUrl ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Format</label>
            <select
              value={aspectLabel}
              onChange={(e) => setAspectLabel(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {aspectOptions.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <Cropper
              image={sourceUrl}
              crop={crop}
              zoom={zoom}
              aspect={selected?.aspect ?? 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Zoom</label>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => onFileSelected(null)}
              disabled={isUploading}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void onApplyCrop()}
              disabled={isUploading}
              className="h-10 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800"
            >
              {isUploading ? "Uploading..." : "Crop"}
            </button>
          </div>

          {uploadError ? <div className="text-sm text-red-600">{uploadError}</div> : null}

          {value?.previewUrl ? (
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <NextImage
                  src={value.previewUrl}
                  alt="Cropped preview"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>

              <div className="text-xs text-gray-600">
                {value.targetWidth} x {value.targetHeight}
              </div>

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => onFileSelected(null)}
                className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
