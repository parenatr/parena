import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-xs " +
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

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (visible ? "text" : "password") : type;

    const input = (
      <input
        ref={ref}
        type={resolvedType}
        className={cn(inputVariants({ invalid }), isPassword && "pr-10", className)}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        {...props}
      />
    );

    if (!isPassword) return input;

    return (
      <div className="relative">
        {input}
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Parolayı gizle" : "Parolayı göster"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  },
);
Input.displayName = "Input";
