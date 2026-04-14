import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export interface LoaderProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  ({ className, size = 24, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        size={size}
        className={cn("animate-spin text-[var(--color-primary)]", className)}
        aria-label="Loading"
        role="status"
        {...props}
      />
    );
  }
);

Loader.displayName = "Loader";
