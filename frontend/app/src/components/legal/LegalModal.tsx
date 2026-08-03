import type { ReactNode } from "react";

import type { LegalDocument } from "@/data/legal";

import { LegalDialog } from "./LegalDialog";
import { LegalRenderer } from "./LegalRenderer";

interface LegalModalProps {
  label: string;
  document: LegalDocument;
  className?: string;
  trigger?: ReactNode;
}

export function LegalModal({
  label,
  document,
  className,
  trigger,
}: LegalModalProps) {
  return (
    <LegalDialog
      title={document.title}
      trigger={
        trigger ?? (
          <button
            type="button"
            className={
              className ??
              "cursor-pointer text-deep transition-colors hover:underline"
            }
          >
            {label}
          </button>
        )
      }
    >
      <LegalRenderer document={document} />
    </LegalDialog>
  );
}