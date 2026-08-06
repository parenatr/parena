import { useEffect, type RefObject } from "react";

/**
 * Anasayfadaki script davranışlarının React karşılığı:
 * scroll-reveal, sayaç animasyonu, kontenjan çubuğu, nav gölgesi ve yapışkan CTA.
 * Tasarımın orijinal davranışıyla birebir aynıdır.
 */
export function useLandingEffects(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observers: IntersectionObserver[] = [];

    // ── Scroll reveal ────────────────────────────────
    // Yazılar yalnızca JS aktifken gizlenir; hook çalışmazsa içerik görünür kalır.
    root.classList.add("reveal-ready");
    const revealed = Array.from(root.querySelectorAll<HTMLElement>(".rv"));
    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      revealed.forEach((el) => io.observe(el));
      observers.push(io);
    } else {
      revealed.forEach((el) => el.classList.add("in"));
    }

    // ── Sayaç animasyonu ─────────────────────────────
    const animateCount = (el: HTMLElement) => {
      const to = parseFloat(el.dataset["to"] ?? "0");
      const pre = el.dataset["pre"] ?? "";
      const post = el.dataset["post"] ?? "";
      const sep = el.dataset["sep"] === "1";
      const render = (v: number) =>
        pre + (sep ? v.toLocaleString("tr-TR") : String(v)) + post;

      if (reduce) {
        el.textContent = render(to);
        return;
      }
      let start: number | null = null;
      const dur = 1400;
      const frame = (ts: number) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = render(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    const counters = Array.from(root.querySelectorAll<HTMLElement>(".count"));
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              animateCount(en.target as HTMLElement);
              cio.unobserve(en.target);
            }
          });
        },
        { threshold: 0.5 },
      );
      counters.forEach((el) => cio.observe(el));
      observers.push(cio);
    } else {
      counters.forEach(animateCount);
    }

    // ── Kontenjan çubuğu ─────────────────────────────
    const quotaFill = root.querySelector<HTMLElement>("#quotaFill");
    if (quotaFill) {
      const width = `${quotaFill.dataset["w"] ?? "0"}%`;
      if ("IntersectionObserver" in window) {
        const qio = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              if (en.isIntersecting) {
                quotaFill.style.width = width;
                qio.unobserve(en.target);
              }
            });
          },
          { threshold: 0.4 },
        );
        qio.observe(quotaFill);
        observers.push(qio);
      } else {
        quotaFill.style.width = width;
      }
    }

    // ── Nav gölgesi + yapışkan CTA ───────────────────
    const nav = root.querySelector<HTMLElement>("#nav");
    const hero = root.querySelector<HTMLElement>(".hero");
    const sticky = root.querySelector<HTMLElement>("#stickyCta");
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      nav?.classList.toggle("stuck", y > 12);
      if (sticky) {
        const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 600;
        const atFooter = window.innerHeight + y > document.body.offsetHeight - 220;
        sticky.classList.toggle("on", y > heroBottom && !atFooter);
      }
      ticking = false;
    };
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", handler);
      observers.forEach((o) => o.disconnect());
    };
  }, [containerRef]);
}
