"use client";

import { useMemo } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input, useToast } from "@/components/core";
import { useChangePassword } from "@/hooks/api";

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
};

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export default function SettingsPage() {
  const { toast } = useToast();

  const defaultValues = useMemo<ChangePasswordFormValues>(
    () => ({
      currentPassword: "",
      newPassword: "",
    }),
    []
  );

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
  });

  const changePasswordMutation = useChangePassword({
    onSuccess: () => {
      form.reset({
        currentPassword: "",
        newPassword: "",
      });
      toast("Password changed successfully.", { variant: "success" });
    },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    return changePasswordMutation
      .mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      .catch(() => {
        toast("Failed to change password", { variant: "error" });
      });
  };

  return (
    <div className=" w-full max-w-xl space-y-6">
      <div>
        <div className="text-2xl font-semibold text-zinc-900">Settings</div>
        <div className="mt-1 text-sm text-zinc-500">Manage your account settings</div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="text-base font-semibold text-zinc-900">Change password</div>


        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <div className="mb-1 text-sm font-medium text-zinc-800">Current password</div>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your current password"
              disabled={changePasswordMutation.isPending}
              {...form.register("currentPassword")}
            />
            {form.formState.errors.currentPassword ? (
              <div className="mt-1 text-xs text-red-600">
                {form.formState.errors.currentPassword.message}
              </div>
            ) : null}
          </div>

          <div>
            <div className="mb-1 text-sm font-medium text-zinc-800">New password</div>
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="Enter a new password"
              disabled={changePasswordMutation.isPending}
              {...form.register("newPassword")}
            />
            {form.formState.errors.newPassword ? (
              <div className="mt-1 text-xs text-red-600">
                {form.formState.errors.newPassword.message}
              </div>
            ) : null}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {changePasswordMutation.isPending ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
