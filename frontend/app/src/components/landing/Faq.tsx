import { FAQ_ITEMS } from "@/data/landing";

export function Faq() {
  return (
    <section id="sss" className="mx-auto max-w-[1080px] px-6 py-16">
      <h2 className="mb-8 text-center text-2xl">Sık sorulanlar</h2>
      <div className="mx-auto max-w-[680px]">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q}
            className="mb-2.5 rounded-xl bg-surface px-5 py-4 shadow-brand"
          >
            <summary className="cursor-pointer text-sm font-semibold">{item.q}</summary>
            <p className="mt-2 text-[13.5px] text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
