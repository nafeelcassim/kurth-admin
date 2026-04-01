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
import { useCreateThickness } from "@/hooks/api";
import type { CreateThicknessModel } from "@/models/thickness";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createThicknessSchema,
  type CreateThicknessFormValues,
} from "../../_schema";

type AddThicknessDialogProps = {
  productId: string;
  trigger: ReactNode;
};

export function AddThicknessDialog({ productId, trigger }: AddThicknessDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const createThicknessMutation = useCreateThickness();

  const defaultValues = useMemo<CreateThicknessFormValues>(
    () => ({
      value: 0,
      isActive: true,
    }),
    []
  );

  const form = useForm<CreateThicknessFormValues>({
    resolver: zodResolver(createThicknessSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  const onSubmit = (values: CreateThicknessFormValues) => {
    const payload: CreateThicknessModel = {
      productId,
      value: String(values.value),
      isActive: typeof values.isActive === "boolean" ? values.isActive : true,
    };

    return createThicknessMutation
      .mutateAsync(payload)
      .then(() => {
        toast("Thickness added successfully", { variant: "success" });
        setIsOpen(false);
        form.reset(defaultValues);
      })
      .catch(() => {
        toast("Failed to add thickness", { variant: "error" });
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
          <DialogTitle>Add Thickness</DialogTitle>
          <DialogDescription>Add a thickness value (e.g. 6mm).</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Value</label>
              <input
                type="number"
                min={0}
                max={21}
                step={0.01}
                inputMode="decimal"
                {...form.register("value", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || typeof v === "undefined") return undefined;
                    const n = Number(v);
                    return Number.isFinite(n) ? n : undefined;
                  },
                })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {form.formState.errors.value?.message ? (
                <div className="text-sm text-red-600">{form.formState.errors.value.message}</div>
              ) : null}
            </div>

            <div className="flex items-end">
              <div className="flex items-center gap-2 justify-center">
                <input
                  id="thickness-is-active"
                  type="checkbox"
                  checked={!!isActive}
                  onChange={(e) => form.setValue("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="thickness-is-active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={createThicknessMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={createThicknessMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createThicknessMutation.isPending ? "Adding..." : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
