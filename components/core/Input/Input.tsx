"use client";

import * as React from "react";

import { cn } from "../utils";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  leftIconClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      leftIcon,
      leftIconClassName,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", containerClassName)}>
        {leftIcon ? (
          <div
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
              leftIconClassName
            )}
          >
            {leftIcon}
          </div>
        ) : null}

        <input
          ref={ref}
          type={type}
          className={cn(
            "h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-10" : "",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
