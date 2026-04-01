'use client'

import type { MouseEvent } from "react";
import { useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/core";

import { useDeleteUser } from "@/hooks/api";

type DeleteUserAlertDialogProps = {
  userId: string;
};

export function DeleteUserAlertDialog({ userId }: DeleteUserAlertDialogProps) {
  const deleteUserMutation = useDeleteUser();
  const [open, setOpen] = useState(false);

  const onDeleteClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await deleteUserMutation.mutateAsync(userId);
      setOpen(false);
    } catch {
      // keep dialog open on error
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <button
              onClick={onDeleteClick}
              disabled={deleteUserMutation.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Confirm delete"}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
