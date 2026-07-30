export type KarneRow = {
  ticker: string;
  broker: string;
  range: string;
  hit: boolean;
};

/** Dünün karnesi — bugünlük statik demo verisi. */
export const YESTERDAY_KARNE: KarneRow[] = [
  { ticker: "ISKPL", broker: "Destek Yatırım", range: "8,00→8,50", hit: true },
  { ticker: "GESAN", broker: "Destek Yatırım", range: "12,40→13,30", hit: true },
  { ticker: "KRDMD", broker: "Tacirler", range: "28,10→29,80", hit: false },
  { ticker: "ODAS", broker: "Gedik", range: "9,80→10,60", hit: true },
];
