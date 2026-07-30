import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/** PARENA marka butonu (nav CTA'ları ve auth kartı aksiyonları). */
const parenaButtonVariants = cva(
  "inline-flex items-center justify-center font-sans font-bold cursor-pointer transition-colors disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        brand: "bg-brand text-brand-foreground hover:bg-deep",
        success: "bg-buy text-brand-foreground",
        ghost: "bg-transparent text-brand hover:bg-background",
      },
      size: {
        nav: "rounded-[10px] px-[22px] py-[11px] text-[13.5px]",
        block: "w-full rounded-lg px-3 py-3 text-sm font-semibold",
      },
    },
    defaultVariants: { variant: "brand", size: "nav" },
  },
);

export interface ParenaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof parenaButtonVariants> {}

export const ParenaButton = React.forwardRef<HTMLButtonElement, ParenaButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(parenaButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
ParenaButton.displayName = "ParenaButton";

export { parenaButtonVariants };
