import {
  CheckCircle2,
  CircleAlert,
  Info,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastState {
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [visible, setVisible] = useState(false);

  const hideTimer = useRef<number | undefined>(undefined);
  const removeTimer = useRef<number | undefined>(undefined);

  const show = useCallback((variant: ToastVariant, message: string) => {
    window.clearTimeout(hideTimer.current);
    window.clearTimeout(removeTimer.current);

    setToast({ variant, message });

    requestAnimationFrame(() => {
      setVisible(true);
    });

    hideTimer.current = window.setTimeout(() => {
      setVisible(false);

      removeTimer.current = window.setTimeout(() => {
        setToast(null);
      }, 300);
    }, 3000);
  }, []);

  const value = useMemo(
    () => ({
      success: (message: string) => show("success", message),
      error: (message: string) => show("error", message),
      info: (message: string) => show("info", message),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast && (
        <div
          className={cn(
            `
            fixed
            bottom-6
            right-6
            z-100
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-divider
            bg-surface
            px-4
            py-3
            shadow-xl
            transition-all
            duration-300
            ease-out
            min-w-70
            max-w-sm
          `,
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0",
          )}
        >
          <div className="mt-0.5 shrink-0 text-brand">
            {toast.variant === "success" && (
              <CheckCircle2 className="h-5 w-5" />
            )}

            {toast.variant === "error" && (
              <CircleAlert className="h-5 w-5 text-destructive" />
            )}

            {toast.variant === "info" && (
              <Info className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-small leading-5 text-muted-foreground">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}