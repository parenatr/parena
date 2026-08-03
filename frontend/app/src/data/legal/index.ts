import { DISTANCE_SALES } from "./distance-sales";
import { KVKK } from "./kvkk";
import { TERMS } from "./terms";

export * from "./types";

export { TERMS } from "./terms";
export { KVKK } from "./kvkk";
export { DISTANCE_SALES } from "./distance-sales";

export const LEGAL_DOCUMENTS = [
  {
    label: "Kullanım Şartları",
    document: TERMS,
  },
  {
    label: "KVKK Aydınlatma Metni",
    document: KVKK,
  },
  {
    label: "Mesafeli Satış",
    document: DISTANCE_SALES,
  },
] as const;