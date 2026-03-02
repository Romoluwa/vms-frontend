"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    "whitespace-nowrap select-none align-middle",
    "font-medium outline-none transition",
    "focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:opacity-60 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white inset-shadow-sm shadow-md bg-linear-to-b from-primary2 to-primary1 hover:from-primary1 hover:to-primary2",
        secondary:
          "bg-secondary inset-shadow-sm inset-shadow-white/50 text-white hover:bg-secondary/90",
        outline:
          "bg-transparent text-dark-grey hover:border-secondary ring-1 ring-border hover:bg-muted",
        ghost: "bg-transparent text-primary1 hover:bg-muted",
        subtle:
          "bg-primaryFade text-primary1 hover:bg-primary hover:text-white",
        destructive:
          "bg-error-bg text-error hover:bg-destructive/90 hover:text-white",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-12 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      iconOnly: {
        true: "p-0",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", iconOnly: true, class: "h-9 w-9" },
      { size: "md", iconOnly: true, class: "h-10 w-10" },
      { size: "lg", iconOnly: true, class: "h-12 w-12" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      radius: "md",
      fullWidth: false,
      iconOnly: false,
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      fullWidth,
      iconOnly,
      leftIcon,
      rightIcon,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    // If only an icon is provided, auto-switch to iconOnly layout
    const computedIconOnly =
      iconOnly ?? (!!(leftIcon || rightIcon) && !children);

    return (
      <button
        ref={ref}
        type="button"
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={clsx(
          buttonVariants({
            variant,
            size,
            radius,
            fullWidth,
            iconOnly: computedIconOnly,
          }),
          className,
          `ease-in-out duration-300 cursor-pointer`,
        )}
        {...props}
      >
        {/* Spinner overlay */}
        {loading && (
          <span
            className="absolute inset-0 grid place-items-center"
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-90"
                d="M4 12a8 8 0 0 1 8-8"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}

        {/* Content */}
        <span
          className={clsx(
            "inline-flex items-center gap-2",
            loading && "opacity-0",
          )}
        >
          {leftIcon ? (
            <span
              className={clsx(computedIconOnly ? "" : "text-[1.05em]")}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          ) : null}

          {children ? <span>{children}</span> : null}

          {rightIcon ? (
            <span
              className={clsx(computedIconOnly ? "" : "text-[1.05em]")}
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          ) : null}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";
