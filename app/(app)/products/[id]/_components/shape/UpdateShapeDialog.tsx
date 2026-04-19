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
import { useShape, useUpdateShape } from "@/hooks/api";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ImageCropField, type ImageCropFieldValue } from "@/components/ImageCropField";

import {
  updateShapeSchema,
  type UpdateShapeFormValues,
} from "../../_schema";

type UpdateShapeDialogProps = {
  shapeId: string;
  trigger: ReactNode;
};

export function UpdateShapeDialog({ shapeId, trigger }: UpdateShapeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<ImageCropFieldValue | undefined>(undefined);
  const updateShapeMutation = useUpdateShape();
  const { toast } = useToast();

  const { data: shape, isLoading } = useShape(shapeId, { enabled: isOpen });

  const defaultValues = useMemo<UpdateShapeFormValues>(
    () => ({
      name: shape?.name ?? "",
      isActive: shape?.isActive ?? true,
      priceMultiplier: shape?.priceMultiplier ?? 0,
      translations:
        shape?.translations.map((t) => ({
          id: t.id,
          language: t.language,
          name: t.name,
        })) ?? [],
    }),
    [shape]
  );

  const form = useForm<UpdateShapeFormValues>({
    resolver: zodResolver(updateShapeSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  useEffect(() => {
    if (isOpen && shape) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, isOpen, shape]);

  const onSubmit = async (values: UpdateShapeFormValues) => {
    if (!shape) return;

  

    const isActiveChanged =
      typeof values.isActive === "boolean" && values.isActive !== shape.isActive;

    const priceMultiplierChanged =
      typeof values.priceMultiplier === "number" && values.priceMultiplier !== (shape.priceMultiplier ?? 0);

    const changedTranslations = (values.translations ?? [])
      .map((t) => {
        const existing = shape.translations.find((x) => x.language === t.language);
        const nextTName = t.name?.trim();

        const nameTChanged =
          typeof nextTName === "string" && nextTName !== (existing?.name ?? "");

        if (!nameTChanged) return null;

        return {
          language: t.language,
          name: nextTName || undefined,
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);

    const payload = {
      ...(isActiveChanged ? { isActive: values.isActive } : {}),
      ...(priceMultiplierChanged ? { priceMultiplier: values.priceMultiplier } : {}),
      ...(changedTranslations.length ? { translations: changedTranslations } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setIsOpen(false);
      return;
    }

    try {
      await updateShapeMutation.mutateAsync({ id: shapeId, payload });
      toast("Updated successfully", { variant: "success" });
      setIsOpen(false);
      form.reset(defaultValues);
      setCroppedImage(undefined);
    } catch {
      toast("Failed to update shape", { variant: "error" });
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
          <DialogTitle>Update Shape</DialogTitle>
          <DialogDescription>Edit the shape fields below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isLoading ? <div className="text-sm text-gray-600">Loading...</div> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
                        <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Price multiplier (0..10)
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
            <div className="flex items-end">
              <div className="flex items-center gap-2 justify-center">
                <input
                  id={`shape-is-active-${shapeId}`}
                  type="checkbox"
                  checked={!!isActive}
                  onChange={(e) => form.setValue("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor={`shape-is-active-${shapeId}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>


          </div>

          <ImageCropField
            uploadFolder="shape"
            existingImageUrl={shape?.imageUrl}
            value={croppedImage}
            onChange={async (next) => {
              setCroppedImage(next);
              if (next?.uploadedKey) {
                try {
                  await updateShapeMutation.mutateAsync({
                    id: shapeId,
                    payload: {
                      imageUrl: next.uploadedKey || undefined,
                      aspectRatio: next.aspectRatio,
                    },
                  });
                  toast("Image updated", { variant: "success" });
                } catch {
                  toast("Failed to update image", { variant: "error" });
                }
              }
            }}
          />

          <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-900">Translations</div>

            {(defaultValues.translations ?? []).map((t, idx) => {
              const nameError = form.formState.errors.translations?.[idx]?.name?.message;

              return (
                <div
                  key={t.id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="mb-3 text-sm font-semibold text-gray-900">
                    {t.language.toUpperCase()}
                  </div>

                  <input type="hidden" {...form.register(`translations.${idx}.id`)} />
                  <input
                    type="hidden"
                    {...form.register(`translations.${idx}.language`)}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input
                      {...form.register(`translations.${idx}.name`)}
                      className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    {nameError ? (
                      <div className="text-sm text-red-600">{nameError}</div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={updateShapeMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={updateShapeMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15"
            >
              {updateShapeMutation.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
