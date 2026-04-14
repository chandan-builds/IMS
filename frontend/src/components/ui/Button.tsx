import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "danger" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", loading = false, icon, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-[var(--color-bg-page)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
      secondary: "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)]",
      danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
      outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]",
      ghost: "hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]",
      link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {!loading && icon && <span className="mr-2" aria-hidden="true">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
