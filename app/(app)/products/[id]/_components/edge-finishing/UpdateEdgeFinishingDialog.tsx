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
import { useEdgeFinishing, useUpdateEdgeFinishing } from "@/hooks/api";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateEdgeFinishingSchema,
  type UpdateEdgeFinishingFormValues,
} from "../../_schema";

type UpdateEdgeFinishingDialogProps = {
  edgeFinishingId: string;
  productId: string;
  trigger: ReactNode;
};

export function UpdateEdgeFinishingDialog({
  edgeFinishingId,
  productId,
  trigger,
}: UpdateEdgeFinishingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateEdgeFinishingMutation = useUpdateEdgeFinishing();
  const { toast } = useToast();

  const { data: edgeFinishing, isLoading } = useEdgeFinishing(
    edgeFinishingId,
    productId,
    { enabled: isOpen }
  );

  const defaultValues = useMemo<UpdateEdgeFinishingFormValues>(() => {
    const translations = edgeFinishing?.translations ?? [];
    const enName = translations.find((t) => t.language === "en")?.name;
    const frName = translations.find((t) => t.language === "fr")?.name;
    const deName = translations.find((t) => t.language === "de")?.name;

    return {
      enName: enName ?? edgeFinishing?.name ?? "",
      frName: frName ?? "",
      deName: deName ?? "",
      imageUrl: edgeFinishing?.imageUrl ?? "",
      pricePerLfm: Number(edgeFinishing?.pricePerLfm ?? 0),
      minLengthLfm: Number(edgeFinishing?.minLengthLfm ?? 0),
      isActive: edgeFinishing?.isActive ?? true,
    };
  }, [edgeFinishing]);

  const form = useForm<UpdateEdgeFinishingFormValues>({
    resolver: zodResolver(updateEdgeFinishingSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  useEffect(() => {
    if (isOpen && edgeFinishing) {
      form.reset(defaultValues);
    }
  }, [defaultValues, edgeFinishing, form, isOpen]);

  const onSubmit = async (values: UpdateEdgeFinishingFormValues) => {
    if (!edgeFinishing) return;

    const imageUrl = values.imageUrl?.trim() || undefined;
    const currentImageUrl = edgeFinishing.imageUrl || undefined;

    const imageUrlChanged = imageUrl !== currentImageUrl;

    const pricePerLfmChanged =
      typeof values.pricePerLfm === "number" &&
      values.pricePerLfm !== Number(edgeFinishing.pricePerLfm ?? 0);

    const minLengthLfmChanged =
      typeof values.minLengthLfm === "number" &&
      values.minLengthLfm !== Number(edgeFinishing.minLengthLfm ?? 0);

    const isActiveChanged =
      typeof values.isActive === "boolean" && values.isActive !== edgeFinishing.isActive;

    const nextTranslations = [
      { language: "en" as const, name: values.enName.trim() },
      { language: "fr" as const, name: values.frName.trim() },
      { language: "de" as const, name: values.deName.trim() },
    ];

    const currentTranslations = edgeFinishing.translations ?? [];

    const currentEn = currentTranslations.find((t) => t.language === "en")?.name ?? edgeFinishing.name;
    const currentFr = currentTranslations.find((t) => t.language === "fr")?.name ?? "";
    const currentDe = currentTranslations.find((t) => t.language === "de")?.name ?? "";

    const translationsChanged =
      nextTranslations[0].name !== (currentEn ?? "") ||
      nextTranslations[1].name !== (currentFr ?? "") ||
      nextTranslations[2].name !== (currentDe ?? "");

    const payload = {
      ...(imageUrlChanged ? { imageUrl } : {}),
      ...(pricePerLfmChanged ? { pricePerLfm: values.pricePerLfm } : {}),
      ...(minLengthLfmChanged ? { minLengthLfm: values.minLengthLfm } : {}),
      ...(isActiveChanged ? { isActive: values.isActive } : {}),
      ...(translationsChanged ? { translations: nextTranslations } : {}),
    };

    if (Object.keys(payload).length === 0) {
      setIsOpen(false);
      return;
    }

    try {
      await updateEdgeFinishingMutation.mutateAsync({
        id: edgeFinishingId,
        payload,
        productId,
      });
      toast("Updated successfully", { variant: "success" });
      setIsOpen(false);
      form.reset(defaultValues);
    } catch {
      toast("Failed to update edge finishing", { variant: "error" });
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
          <DialogTitle>Update Edge Finishing</DialogTitle>
          <DialogDescription>Edit the edge finishing fields below.</DialogDescription>
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
              id={`edge-finishing-is-active-${edgeFinishingId}`}
              type="checkbox"
              checked={!!isActive}
              onChange={(e) => form.setValue("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor={`edge-finishing-is-active-${edgeFinishingId}`}
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <DialogFooter className="mt-4 border-t border-gray-200 pt-4">
            <DialogClose asChild>
              <button
                type="button"
                disabled={updateEdgeFinishingMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={updateEdgeFinishingMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15"
            >
              {updateEdgeFinishingMutation.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
