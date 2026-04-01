'use client'

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


type DeleteAlertDialogProps = {
    onConfirm: () => Promise<void>;
    title: string;
    description: string;
    isLoading?: boolean;
    confirmButtonTitle?: string;
    cancelButtonTitle?: string;
};

export function DeleteAlertDialog({ onConfirm, title, description, isLoading = false, confirmButtonTitle = "Confirm delete", cancelButtonTitle = "Cancel" }: DeleteAlertDialogProps) {
  const [open, setOpen] = useState(false);

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
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {cancelButtonTitle}
            </button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <button
              onClick={async (e) => {
                e.preventDefault();
                await onConfirm();
                setOpen(false);
              }}
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Deleting..." : confirmButtonTitle}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
