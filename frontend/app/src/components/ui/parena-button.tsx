import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * PARENA marka butonu (nav CTA'ları ve auth kartı aksiyonları).
 * shadcn/ui sözleşmesine hizalıdır: `asChild` desteği + focus-visible ring.
 */
const parenaButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-sans font-bold cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        brand: "bg-brand text-brand-foreground hover:bg-deep",
        success: "bg-buy text-brand-foreground",
        ghost: "bg-transparent text-brand hover:bg-background",
      },
      size: {
        nav: "rounded-[10px] px-3.5 py-2 text-[12.5px] sm:px-[22px] sm:py-[11px] sm:text-[13.5px]",
        block: "w-full rounded-lg px-3 py-3 text-sm font-semibold",
      },
    },
    defaultVariants: { variant: "brand", size: "nav" },
  },
);

export interface ParenaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof parenaButtonVariants> {
  asChild?: boolean;
}

export const ParenaButton = React.forwardRef<HTMLButtonElement, ParenaButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { type })}
        className={cn(parenaButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
ParenaButton.displayName = "ParenaButton";

export { parenaButtonVariants };
