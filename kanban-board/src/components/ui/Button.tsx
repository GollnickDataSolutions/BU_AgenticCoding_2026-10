import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800":
              variant === "primary",
            "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100":
              variant === "secondary",
            "text-gray-600 hover:bg-gray-100 active:bg-gray-200":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800":
              variant === "danger",
            // Sizes
            "h-7 px-2 text-xs": size === "sm",
            "h-9 px-3 text-sm": size === "md",
            "h-11 px-5 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
