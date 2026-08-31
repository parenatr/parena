import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { parenaButtonVariants } from "./parena-button-variants";

export interface ParenaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof parenaButtonVariants> {
  asChild?: boolean;
}

export const ParenaButton = React.forwardRef<
  HTMLButtonElement,
  ParenaButtonProps
>(({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      {...(asChild ? {} : { type })}
      className={cn(parenaButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
});

ParenaButton.displayName = "ParenaButton";
