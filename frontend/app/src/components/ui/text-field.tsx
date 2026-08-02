import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
}

/**
 * Keycloak kartlarındaki etiketli form alanı.
 * shadcn/ui `Label` + `Input` üzerine PARENA stilini uygulayan ince sarmalayıcı.
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, className, containerClassName, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("mb-4 text-left", containerClassName)}>
        <Label
          htmlFor={inputId}
          className="mb-1.5 block text-[12.5px] font-semibold text-brand"
        >
          {label}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            "h-auto w-full rounded-lg border border-divider bg-surface px-[13px] py-[11px] font-sans text-sm text-foreground shadow-none outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70",
            "focus-visible:border-brand focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_rgba(19,41,75,.1)]",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
TextField.displayName = "TextField";
