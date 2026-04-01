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
import { useCreateGlassType } from "@/hooks/api";
import type { CreateGlassTypeModel } from "@/models/glass-type";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createGlassTypeSchema,
  type CreateGlassTypeFormValues,
} from "../../_schema";

type AddGlassTypeDialogProps = {
  productId: string;
  trigger: ReactNode;
};

export function AddGlassTypeDialog({ productId, trigger }: AddGlassTypeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const createGlassTypeMutation = useCreateGlassType();

  const defaultValues = useMemo<CreateGlassTypeFormValues>(
    () => ({
      enName: "",
      frName: "",
      deName: "",
      imageUrl: "",
      isActive: true,
    }),
    []
  );

  const form = useForm<CreateGlassTypeFormValues>({
    resolver: zodResolver(createGlassTypeSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  const onSubmit = (values: CreateGlassTypeFormValues) => {
    const payload: CreateGlassTypeModel = {
      productId,
      name: values.enName.trim(),
      imageUrl: values.imageUrl?.trim() || undefined,
      isActive: typeof values.isActive === "boolean" ? values.isActive : true,
      translations: [
        { language: "en" as const, name: values.enName.trim() },
        { language: "fr" as const, name: values.frName.trim() },
        { language: "de" as const, name: values.deName.trim() },
      ],
    };

    return createGlassTypeMutation
      .mutateAsync(payload)
      .then(() => {
        toast("Glass type added successfully", { variant: "success" });
        setIsOpen(false);
        form.reset(defaultValues);
      })
      .catch(() => {
        toast("Failed to add glass type", { variant: "error" });
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset(defaultValues);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Glass Type</DialogTitle>
          <DialogDescription>Add a glass type for this product.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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


          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Image URL</label>
            <input
              {...form.register("imageUrl")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.imageUrl?.message ? (
              <div className="text-sm text-red-600">{form.formState.errors.imageUrl.message}</div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="glass-type-is-active"
              type="checkbox"
              checked={!!isActive}
              onChange={(e) => form.setValue("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="glass-type-is-active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={createGlassTypeMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={createGlassTypeMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createGlassTypeMutation.isPending ? "Adding..." : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
