import type { ReactNode } from "react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface LegalDialogProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
}

export function LegalDialog({
  trigger,
  title,
  children,
}: LegalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {children}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}