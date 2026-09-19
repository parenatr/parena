import { describe, expect, it } from "vitest";

import { ROUTES } from "./routes";

describe("ROUTES", () => {
  it("her path '/' ile başlar", () => {
    for (const path of Object.values(ROUTES)) {
      expect(path.startsWith("/")).toBe(true);
    }
  });

  it("path değerleri birbirinin aynısı değildir (benzersiz)", () => {
    const paths = Object.values(ROUTES);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("AppRouter'daki 9 gerçek route ile bire bir eşleşir (sifremi-unuttum hariç, o kaldırılıyor)", () => {
    expect(Object.keys(ROUTES).sort()).toEqual(
      [
        "home",
        "login",
        "register",
        "checkout",
        "cerez",
        "gizlilik",
        "kullanimSartlari",
        "kvkk",
        "mesafeliSatis",
      ].sort(),
    );
  });
});
