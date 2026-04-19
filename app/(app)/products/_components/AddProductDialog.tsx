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

import { useCreateProduct } from "@/hooks/api";
import { useToast } from "@/components/core/Toast/ToastProvider";

import { ImageCropField, type ImageCropFieldValue } from "@/components/ImageCropField";
import { ProductAspectRatio, type CreateProductModel } from "@/models";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductFormValues,
} from "../_schema/createProduct.schema";

type AddProductDialogProps = {
  trigger: ReactNode;
};

const LANGUAGES = ["en", "fr", "de"] as const;

export function AddProductDialog({ trigger }: AddProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<ImageCropFieldValue | undefined>(undefined);
  const createProductMutation = useCreateProduct();
  const { toast } = useToast();

  const defaultValues = useMemo<CreateProductFormValues>(
    () => ({
      slug: "",
      isActive: true,
      translations: LANGUAGES.map((language) => ({
        language,
        name: "",
        description: "",
      })),
    }),
    []
  );

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });

  const isActive = useWatch({ control: form.control, name: "isActive" });

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, isOpen]);

  const onSubmit = (values: CreateProductFormValues) => {
    const imagePayload = croppedImage?.uploadedKey
      ? {
          imageUrl: croppedImage.uploadedKey,
          aspectRatio: croppedImage.aspectRatio as ProductAspectRatio,
        }
      : {};

    const payload: CreateProductModel = {
      ...values,
      ...imagePayload,
      translations: values.translations.map((t) => ({
        language: t.language,
        name: t.name,
        description: t.description?.trim() ? t.description : undefined,
      })),
    };

    return createProductMutation
      .mutateAsync(payload)
      .then(() => {
        toast("Added successfully", { variant: "success" });
        setIsOpen(false);
        form.reset(defaultValues);
        setCroppedImage(undefined);
      })
      .catch(() => {
        toast("Failed to add product", { variant: "error" });
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

      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Create a product with translations for EN/FR/DE.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex max-h-[70vh] flex-col"
        >
          <div className="flex-1 overflow-y-auto pr-2">
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
                    id="is-active"
                    type="checkbox"
                    checked={!!isActive}
                    onChange={(e) => form.setValue("isActive", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="is-active"
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
                value={croppedImage}
                onChange={(next) => {
                  setCroppedImage(next);
                }}
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="text-sm font-semibold text-gray-900">Translations</div>

              {LANGUAGES.map((language, idx) => {
                const nameError = form.formState.errors.translations?.[idx]?.name
                  ?.message;
                const descError =
                  form.formState.errors.translations?.[idx]?.description?.message;

                return (
                  <div
                    key={language}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="mb-3 text-sm font-semibold text-gray-900">
                      {language.toUpperCase()}
                    </div>

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
                disabled={createProductMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createProductMutation.isPending ? "Creating..." : "Create"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
