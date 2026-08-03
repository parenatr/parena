import {
  Check,
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
              z-[100]
              flex
              min-w-[360px]
              max-w-md
              items-start
              gap-4
              rounded-2xl
              border
              border-divider
              bg-surface
              px-5
              py-4
              shadow-2xl
              transition-all
              duration-300
              ease-out
            `,
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0",
          )}
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-brand
              text-brand-foreground
            "
          >
            {toast.variant === "success" && (
              <Check className="h-5 w-5" />
            )}

            {toast.variant === "error" && (
              <CircleAlert className="h-5 w-5" />
            )}

            {toast.variant === "info" && (
              <Info className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-deep">
              {toast.variant === "success" && "Başarılı"}
              {toast.variant === "error" && "Bir hata oluştu"}
              {toast.variant === "info" && "Bilgilendirme"}
            </p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
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