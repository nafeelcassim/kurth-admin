"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/core";

import { useToast } from "@/components/core/Toast/ToastProvider";
import { useCreateShape } from "@/hooks/api/useCreateShape";
import type { CreateShapeModel } from "@/models/shape";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageCropField, type ImageCropFieldValue } from "@/components/ImageCropField";

import {
  createShapeSchema,
  type CreateShapeFormValues,
} from "../../_schema";

type AddShapeDialogProps = {
  productId: string;
  trigger: ReactNode;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function AddShapeDialog({ productId, trigger }: AddShapeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<ImageCropFieldValue | undefined>(undefined);
  const { toast } = useToast();
  const createShapeMutation = useCreateShape();

  const defaultValues = useMemo<CreateShapeFormValues>(
    () => ({
      enName: "",
      frName: "",
      deName: "",
      priceMultiplier: 0,
    }),
    []
  );

  const form = useForm<CreateShapeFormValues>({
    resolver: zodResolver(createShapeSchema),
    defaultValues,
  });

  const onSubmit = (values: CreateShapeFormValues) => {
    const imagePayload = croppedImage?.uploadedKey
      ? { imageUrl: croppedImage.uploadedKey, aspectRatio: croppedImage.aspectRatio }
      : {};

    const payload: CreateShapeModel = {
      productId,
      name: slugify(values.enName),
      ...imagePayload,
      translations: [
        { language: "en", name: values.enName.trim() },
        { language: "fr", name: values.frName.trim() },
        { language: "de", name: values.deName.trim() },
      ],
      priceMultiplier: values.priceMultiplier,
    };

    return createShapeMutation
      .mutateAsync(payload)
      .then(() => {
        toast("Shape added successfully", { variant: "success" });
        setIsOpen(false);
        form.reset(defaultValues);
        setCroppedImage(undefined);
      })
      .catch(() => {
        toast("Failed to add shape", { variant: "error" });
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset(defaultValues);
          setCroppedImage(undefined);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Shape</DialogTitle>
          <DialogDescription>
            Add the shape name in EN/FR/DE.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">English (EN)</label>
            <input
              {...form.register("enName")}
              className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.enName?.message ? (
              <div className="text-sm text-red-600">{form.formState.errors.enName.message}</div>
            ) : null}
          </div>

          <ImageCropField
            uploadFolder="shape"
            value={croppedImage}
            onChange={(next) => {
              setCroppedImage(next);
            }}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">French (FR)</label>
            <input
              {...form.register("frName")}
              className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.frName?.message ? (
              <div className="text-sm text-red-600">{form.formState.errors.frName.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">German (DE)</label>
            <input
              {...form.register("deName")}
              className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.deName?.message ? (
              <div className="text-sm text-red-600">{form.formState.errors.deName.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Price multiplier (1,1.3,2..10)
            </label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              {...form.register("priceMultiplier", {
                setValueAs: (v) => {
                  if (v === "" || v === null || typeof v === "undefined") return undefined;
                  const n = Number(v);
                  return Number.isFinite(n) ? n : undefined;
                },
              })}
              className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.priceMultiplier?.message ? (
              <div className="text-sm text-red-600">
                {form.formState.errors.priceMultiplier.message}
              </div>
            ) : null}
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={createShapeMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={createShapeMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createShapeMutation.isPending ? "Adding..." : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
