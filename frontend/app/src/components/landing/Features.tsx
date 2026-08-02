import { FEATURES, type FeatureRow } from "@/data/landing";

const TONE: Record<string, string> = {
  buy: "text-buy",
  sell: "text-sell",
  warn: "text-gold",
  neutral: "text-muted-foreground",
};

function Row({ row }: { row: FeatureRow }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-divider py-[7px] last:border-b-0">
      <b className="font-tabular">{row.left}</b>
      {row.mid ? <span className="text-muted-foreground">{row.mid}</span> : null}
      {row.right ? (
        <b className={TONE[row.tone ?? "neutral"]}>{row.right}</b>
      ) : null}
      {row.value ? (
        <span className={`font-tabular ${row.right ? "" : (TONE[row.tone ?? ""] ?? "")}`}>
          {row.value}
        </span>
      ) : null}
    </div>
  );
}

export function Features() {
  return (
    <section id="ozellikler" className="mx-auto max-w-[1080px] px-6 py-16">
      <h2 className="text-center text-2xl">Dağınık bültenler yerine tek arena</h2>
      <p className="mx-auto mb-13 mt-2 text-center text-[14.5px] text-muted-foreground">
        Her sabah 20+ kurumun PDF'ini açmak yerine, hepsi karşında, kaynaklarıyla.
      </p>

      <div className="mt-12 space-y-16">
        {FEATURES.map((feature) => (
          <div
            key={feature.id}
            className="grid grid-cols-1 items-center gap-13 md:grid-cols-2"
          >
            <div className={feature.reversed ? "md:order-2" : ""}>
              <h3 className="mb-2.5 text-[17px]">{feature.title}</h3>
              <p className="text-[14.5px] text-muted-foreground">{feature.body}</p>
            </div>

            <div
              className={`rounded-2xl bg-surface p-5 text-xs shadow-brand ${
                feature.reversed ? "md:order-1" : ""
              }`}
            >
              {feature.consensus ? (
                <>
                  <b className="font-tabular">{feature.consensus.title}</b>
                  <div className="my-[7px] flex h-[9px] overflow-hidden rounded-[5px]">
                    <div
                      className="bg-buy"
                      style={{ width: `${feature.consensus.buy}%` }}
                    />
                    <div
                      className="bg-muted-foreground"
                      style={{ width: `${feature.consensus.hold}%` }}
                    />
                    <div
                      className="bg-sell"
                      style={{ width: `${feature.consensus.sell}%` }}
                    />
                  </div>
                </>
              ) : null}
              {feature.rows.map((row) => (
                <Row key={row.left} row={row} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
