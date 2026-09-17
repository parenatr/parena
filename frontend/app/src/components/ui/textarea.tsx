import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex min-h-24 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-xs " +
    "transition-colors placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-destructive focus-visible:ring-destructive",
        false: "border-divider",
      },
    },
    defaultVariants: { invalid: false },
  },
);

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, "aria-invalid": ariaInvalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(textareaVariants({ invalid }), className)}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
