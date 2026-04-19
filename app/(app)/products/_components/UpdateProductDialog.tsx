'use client'

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

import { useProduct, useUpdateProduct } from "@/hooks/api";
import { useToast } from "@/components/core/Toast/ToastProvider";

import { ImageCropField, type ImageCropFieldValue } from "@/components/ImageCropField";
import { ProductAspectRatio } from "@/models";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProductSchema,
  type UpdateProductFormValues,
} from "../_schema/updateProduct.schema";

type UpdateProductDialogProps = {
  productId: string;
  trigger: ReactNode;
};

export function UpdateProductDialog({ productId, trigger }: UpdateProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<ImageCropFieldValue | undefined>(undefined);
  const updateProductMutation = useUpdateProduct();
  const { toast } = useToast();

  const { data: product, isLoading } = useProduct(productId, { enabled: isOpen });

  const defaultValues = useMemo<UpdateProductFormValues>(
    () => ({
      slug: product?.slug ?? "",
      isActive: product?.isActive ?? true,
      translations:
        product?.translations.map((t) => ({
          id: t.id,
          language: t.language,
          name: t.name,
          description: t.description ?? "",
        })) ?? [],
    }),
    [product]
  );

  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  useEffect(() => {
    if (isOpen && product) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, isOpen, product]);

  const onSubmit = async (values: UpdateProductFormValues) => {
    if (!product) return;

    const nextSlug = values.slug?.trim();

    const slugChanged =
      typeof nextSlug === "string" && nextSlug.length > 0 && nextSlug !== product.slug;
    const isActiveChanged =
      typeof values.isActive === "boolean" && values.isActive !== product.isActive;

    const changedTranslations = (values.translations ?? [])
      .map((t) => {
        const existing = product.translations.find((x) => x.language === t.language);

        const nextName = t.name?.trim();
        const nextDescription = t.description?.trim();

        const nameChanged =
          typeof nextName === "string" && nextName !== (existing?.name ?? "");
        const descChanged =
          (nextDescription ?? "") !== (existing?.description ?? "");

        if (!nameChanged && !descChanged) return null;

        return {
          language: t.language,
          ...(nameChanged ? { name: nextName || undefined } : {}),
          ...(descChanged
            ? { description: nextDescription ? nextDescription : undefined }
            : {}),
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);

    const payload = {
      ...(slugChanged ? { slug: nextSlug } : {}),
      ...(isActiveChanged ? { isActive: values.isActive } : {}),
      ...(changedTranslations.length ? { translations: changedTranslations } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setIsOpen(false);
      return;
    }

    try {
      await updateProductMutation.mutateAsync({ id: productId, payload });
      toast("Updated successfully", { variant: "success" });
      setIsOpen(false);
      form.reset(defaultValues);
      setCroppedImage(undefined);
    } catch {
      toast("Failed to update product", { variant: "error" });
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

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>Edit the product fields below.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[70vh] flex-col"
        >
          <div className="flex-1 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="text-sm text-gray-600">Loading...</div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input
                  {...form.register("slug")}
                  className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {form.formState.errors.slug?.message ? (
                  <div className="text-sm text-red-600">
                    {form.formState.errors.slug.message}
                  </div>
                ) : null}
              </div>

              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <input
                    id={`is-active-${productId}`}
                    type="checkbox"
                    checked={!!isActive}
                    onChange={(e) => form.setValue("isActive", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor={`is-active-${productId}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <ImageCropField
                uploadFolder="product"
                existingImageUrl={product?.imageUrl}
                value={croppedImage}
                onChange={async (next) => {
                  setCroppedImage(next);
                  if (next?.uploadedKey) {
                    try {
                      await updateProductMutation.mutateAsync({
                        id: productId,
                        payload: {
                          imageUrl: next.uploadedKey || undefined,
                          aspectRatio: next.aspectRatio as ProductAspectRatio,
                        },
                      });
                      toast("Image updated", { variant: "success" });
                    } catch {
                      toast("Failed to update image", { variant: "error" });
                    }
                  }
                }}
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="text-sm font-semibold text-gray-900">Translations</div>

              {(defaultValues.translations ?? []).map((t, idx) => {
                const nameError = form.formState.errors.translations?.[idx]?.name?.message;
                const descError =
                  form.formState.errors.translations?.[idx]?.description?.message;

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

                    <div className="mt-4 space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Description (optional)
                      </label>
                      <textarea
                        {...form.register(`translations.${idx}.description`)}
                        rows={3}
                        className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      {descError ? (
                        <div className="text-sm text-red-600">{descError}</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={updateProductMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={updateProductMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15"
            >
              {updateProductMutation.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
