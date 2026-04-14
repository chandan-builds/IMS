import * as React from "react";
import { cn } from "../../utils/cn";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {title && (
        <div className="p-6 border-b border-[var(--color-border)]">
          <h3 className="font-semibold leading-none tracking-tight text-lg">
            {title}
          </h3>
        </div>
      )}
      <div className={cn("p-6", title && "pt-6")}>
        {children}
      </div>
    </div>
  )
);

Card.displayName = "Card";
