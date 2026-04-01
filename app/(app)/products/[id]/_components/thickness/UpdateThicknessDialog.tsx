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
import { useThickness, useUpdateThickness } from "@/hooks/api";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateThicknessSchema,
  type UpdateThicknessFormValues,
} from "../../_schema";

type UpdateThicknessDialogProps = {
  thicknessId: string;
  trigger: ReactNode;
};

export function UpdateThicknessDialog({ thicknessId, trigger }: UpdateThicknessDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateThicknessMutation = useUpdateThickness();
  const { toast } = useToast();

  const { data: thickness, isLoading } = useThickness(thicknessId, { enabled: isOpen });

  const defaultValues = useMemo<UpdateThicknessFormValues>(
    () => ({
      value: Number(thickness?.value ?? 0),
      isActive: thickness?.isActive ?? true,
    }),
    [thickness]
  );

  const form = useForm<UpdateThicknessFormValues>({
    resolver: zodResolver(updateThicknessSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  useEffect(() => {
    if (isOpen && thickness) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, isOpen, thickness]);

  const onSubmit = async (values: UpdateThicknessFormValues) => {
    if (!thickness) return;

    const nextValue = values.value;

    const currentValue = Number(thickness.value ?? 0);

    const valueChanged = typeof nextValue === "number" && nextValue !== currentValue;
    const isActiveChanged =
      typeof values.isActive === "boolean" && values.isActive !== thickness.isActive;

    const payload = {
      ...(valueChanged ? { value: String(nextValue) } : {}),
      ...(isActiveChanged ? { isActive: values.isActive } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setIsOpen(false);
      return;
    }

    try {
      await updateThicknessMutation.mutateAsync({ id: thicknessId, payload });
      toast("Updated successfully", { variant: "success" });
      setIsOpen(false);
      form.reset(defaultValues);
    } catch {
      toast("Failed to update thickness", { variant: "error" });
    }
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
          <DialogTitle>Update Thickness</DialogTitle>
          <DialogDescription>Edit the thickness fields below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isLoading ? <div className="text-sm text-gray-600">Loading...</div> : null}

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
                  id={`thickness-is-active-${thicknessId}`}
                  type="checkbox"
                  checked={!!isActive}
                  onChange={(e) => form.setValue("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor={`thickness-is-active-${thicknessId}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={updateThicknessMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={updateThicknessMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15"
            >
              {updateThicknessMutation.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
