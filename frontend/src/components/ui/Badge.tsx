import * as React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "default";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]",
      success: "bg-[var(--color-success-light)] text-[var(--color-success)]",
      warning: "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
      danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)]",
      info: "bg-[var(--color-info-light)] text-[var(--color-info)]",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
