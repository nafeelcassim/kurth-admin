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

import { useUpdateUser } from "@/hooks/api";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateUserSchema,
  type UpdateUserFormValues,
} from "../_schema/updateUser.schema";

type UpdateUserDialogProps = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  trigger: ReactNode;
};

export function UpdateUserDialog({ user, trigger }: UpdateUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateUserMutation = useUpdateUser();

  const defaultValues = useMemo(
    () => ({
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
    }),
    [user.firstName, user.isActive, user.lastName]
  );

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form, isOpen]);

  const onSubmit = (values: UpdateUserFormValues) => {
    return updateUserMutation
      .mutateAsync({ id: user.id, payload: values })
      .then(() => {
        setIsOpen(false);
        form.reset(defaultValues);
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>Update the details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">First name</label>
            <input
              {...form.register("firstName")}
              className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.firstName?.message ? (
              <div className="text-sm text-red-600">
                {form.formState.errors.firstName.message}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Last name</label>
            <input
              {...form.register("lastName")}
              className="w-full text-black rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {form.formState.errors.lastName?.message ? (
              <div className="text-sm text-red-600">
                {form.formState.errors.lastName.message}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <input
              id={`is-active-${user.id}`}
              type="checkbox"
              checked={!!isActive}
              onChange={(e) => form.setValue("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor={`is-active-${user.id}`}
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                disabled={updateUserMutation.isPending}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateUserMutation.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
