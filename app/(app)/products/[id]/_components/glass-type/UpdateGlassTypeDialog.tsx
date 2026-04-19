"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

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
import { useGlassType, useUpdateGlassType } from "@/hooks/api";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageCropField, type ImageCropFieldValue } from "@/components/ImageCropField";

import {
  updateGlassTypeSchema,
  type UpdateGlassTypeFormValues,
} from "../../_schema";

type UpdateGlassTypeDialogProps = {
  glassTypeId: string;
  productId: string;
  trigger: ReactNode;
};

export function UpdateGlassTypeDialog({ glassTypeId, productId, trigger }: UpdateGlassTypeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<ImageCropFieldValue | undefined>(undefined);
  const updateGlassTypeMutation = useUpdateGlassType();
  const { toast } = useToast();

  const { data: glassType, isLoading } = useGlassType(glassTypeId, productId, { enabled: isOpen });

  const enExisting = glassType?.translations?.find((t) => t.language === "en")?.name ?? "";
  const frExisting = glassType?.translations?.find((t) => t.language === "fr")?.name ?? "";
  const deExisting = glassType?.translations?.find((t) => t.language === "de")?.name ?? "";

  const defaultValues = useMemo<UpdateGlassTypeFormValues>(
    () => ({
      enName: enExisting || glassType?.name || "",
      frName: frExisting,
      deName: deExisting,
      isActive: glassType?.isActive ?? true,
    }),
    [deExisting, enExisting, frExisting, glassType]
  );

  const form = useForm<UpdateGlassTypeFormValues>({
    resolver: zodResolver(updateGlassTypeSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  useEffect(() => {
    if (isOpen && glassType) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, glassType, isOpen]);

  const onSubmit = async (values: UpdateGlassTypeFormValues) => {
    if (!glassType) return;

    const nextEnName = values.enName.trim();
    const nextFrName = values.frName.trim();
    const nextDeName = values.deName.trim();

    const baseNameChanged = nextEnName !== (enExisting || glassType.name);
    const translationsChanged =
      nextEnName !== (enExisting || "") || nextFrName !== frExisting || nextDeName !== deExisting;
    const isActiveChanged =
      typeof values.isActive === "boolean" && values.isActive !== glassType.isActive;

    const payload = {
      ...(baseNameChanged ? { name: nextEnName } : {}),
      ...(isActiveChanged ? { isActive: values.isActive } : {}),
      ...(translationsChanged
        ? {
            translations: [
              { language: "en" as const, name: nextEnName },
              { language: "fr" as const, name: nextFrName },
              { language: "de" as const, name: nextDeName },
            ],
          }
        : {}),
    };

    if (Object.keys(payload).length === 0) {
      setIsOpen(false);
      return;
    }

    try {
      await updateGlassTypeMutation.mutateAsync({
        id: glassTypeId,
        payload: {
          ...payload,
          productId
        },
        productId,
      });
      toast("Updated successfully", { variant: "success" });
      setIsOpen(false);
      form.reset(defaultValues);
      setCroppedImage(undefined);
    } catch {
      toast("Failed to update glass type", { variant: "error" });
    }
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
          <DialogTitle>Update Glass Type</DialogTitle>
          <DialogDescription>Edit the glass type fields below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isLoading ? <div className="text-sm text-gray-600">Loading...</div> : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">English (EN)</label>
            <input
              {...form.register("enName")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.enName?.message ? (
              <div className="text-sm text-red-600">{form.formState.errors.enName.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">French (FR)</label>
            <input
              {...form.register("frName")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.frName?.message ? (
              <div className="text-sm text-red-600">{form.formState.errors.frName.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">German (DE)</label>
            <input
              {...form.register("deName")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.deName?.message ? (
              <div className="text-sm text-red-600">{form.formState.errors.deName.message}</div>
            ) : null}
          </div>

          <ImageCropField
            uploadFolder="glass-type"
            existingImageUrl={glassType?.imageUrl}
            value={croppedImage}
            onChange={async (next) => {
              setCroppedImage(next);
              if (next?.uploadedKey) {
                try {
                  await updateGlassTypeMutation.mutateAsync({
                    id: glassTypeId,
                    payload: {
                      imageUrl: next.uploadedKey || undefined,
                      aspectRatio: next.aspectRatio,
                      productId,
                    },
                    productId,
                  });
                  toast("Image updated", { variant: "success" });
                } catch {
                  toast("Failed to update image", { variant: "error" });
                }
              }
            }}
          />

          <div className="flex items-center gap-2">
            <input
              id={`glass-type-is-active-${glassTypeId}`}
              type="checkbox"
              checked={!!isActive}
              onChange={(e) => form.setValue("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor={`glass-type-is-active-${glassTypeId}`}
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={updateGlassTypeMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={updateGlassTypeMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15"
            >
              {updateGlassTypeMutation.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
