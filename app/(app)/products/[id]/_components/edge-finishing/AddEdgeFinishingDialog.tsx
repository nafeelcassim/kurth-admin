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
import { useCreateEdgeFinishing } from "@/hooks/api";
import type { CreateEdgeFinishingModel } from "@/models/edge-finishing";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createEdgeFinishingSchema,
  type CreateEdgeFinishingFormValues,
} from "../../_schema";

type AddEdgeFinishingDialogProps = {
  productId: string;
  trigger: ReactNode;
};

export function AddEdgeFinishingDialog({ productId, trigger }: AddEdgeFinishingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const createEdgeFinishingMutation = useCreateEdgeFinishing();

  const defaultValues = useMemo<CreateEdgeFinishingFormValues>(
    () => ({
      enName: "",
      frName: "",
      deName: "",
      imageUrl: "",
      pricePerLfm: 0,
      minLengthLfm: 0,
      isActive: true,
    }),
    []
  );

  const form = useForm<CreateEdgeFinishingFormValues>({
    resolver: zodResolver(createEdgeFinishingSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  const onSubmit = (values: CreateEdgeFinishingFormValues) => {
    const payload: CreateEdgeFinishingModel = {
      imageUrl: values.imageUrl?.trim() || undefined,
      pricePerLfm: values.pricePerLfm,
      minLengthLfm: values.minLengthLfm,
      isActive: typeof values.isActive === "boolean" ? values.isActive : true,
      translations: [
        { language: "en", name: values.enName.trim() },
        { language: "fr", name: values.frName.trim() },
        { language: "de", name: values.deName.trim() },
      ],
    };

    return createEdgeFinishingMutation
      .mutateAsync({ payload, productId })
      .then(() => {
        toast("Edge finishing added successfully", { variant: "success" });
        setIsOpen(false);
        form.reset(defaultValues);
      })
      .catch(() => {
        toast("Failed to add edge finishing", { variant: "error" });
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
          <DialogTitle>Add Edge Finishing</DialogTitle>
          <DialogDescription>Add an edge finishing option.</DialogDescription>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price per LFM</label>
              <input
                type="number"
                min={0}
                step={0.01}
                inputMode="decimal"
                {...form.register("pricePerLfm", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || typeof v === "undefined") return undefined;
                    const n = Number(v);
                    return Number.isFinite(n) ? n : undefined;
                  },
                })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {form.formState.errors.pricePerLfm?.message ? (
                <div className="text-sm text-red-600">
                  {form.formState.errors.pricePerLfm.message}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Min length (LFM)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                inputMode="decimal"
                {...form.register("minLengthLfm", {
                  setValueAs: (v) => {
                    if (v === "" || v === null || typeof v === "undefined") return undefined;
                    const n = Number(v);
                    return Number.isFinite(n) ? n : undefined;
                  },
                })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {form.formState.errors.minLengthLfm?.message ? (
                <div className="text-sm text-red-600">
                  {form.formState.errors.minLengthLfm.message}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="edge-finishing-is-active"
              type="checkbox"
              checked={!!isActive}
              onChange={(e) => form.setValue("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="edge-finishing-is-active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={createEdgeFinishingMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={createEdgeFinishingMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createEdgeFinishingMutation.isPending ? "Adding..." : "Add"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
