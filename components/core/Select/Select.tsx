"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { cn } from "../utils";

export type SelectOption<TValue extends string> = {
  value: TValue;
  label: string;
};

export interface SelectProps<TValue extends string> {
  value: TValue;
  onValueChange: (value: TValue) => void;
  options: Array<SelectOption<TValue>>;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export function Select<TValue extends string>({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
  triggerClassName,
  contentClassName,
  disabled,
}: SelectProps<TValue>) {
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            triggerClassName
          )}
        >
          <span className={cn("truncate", !selectedLabel ? "text-gray-400" : "")}>
            {selectedLabel ?? placeholder}
          </span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className={cn(
            "z-50 min-w-48 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg",
            contentClassName
          )}
        >
          {options.map((opt) => (
            <DropdownMenu.Item
              key={opt.value}
              onSelect={(e) => {
                e.preventDefault();
                onValueChange(opt.value);
              }}
              className={cn(
                "flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none",
                opt.value === value
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {opt.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
