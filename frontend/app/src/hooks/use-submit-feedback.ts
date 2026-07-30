import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "error" | "success";

/**
 * Tasarımdaki davranış: buton metni geçici olarak hata mesajına dönüşür,
 * başarıda yeşile döner. Backend bağlanana kadar tek yerde toplanır.
 */
export function useSubmitFeedback(defaultLabel: string) {
  const [label, setLabel] = useState(defaultLabel);
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const fail = useCallback(
    (message: string) => {
      if (timer.current) clearTimeout(timer.current);
      setStatus("error");
      setLabel(message);
      timer.current = setTimeout(() => {
        setStatus("idle");
        setLabel(defaultLabel);
      }, 2000);
    },
    [defaultLabel],
  );

  const succeed = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setStatus("success");
    setLabel(message);
  }, []);

  return { label, status, fail, succeed };
}
