import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";

import { ThemeProvider, useTheme } from "./theme-provider";

function Consumer() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} data-testid="toggle">
      {theme}
    </button>
  );
}

function mockMatchMedia(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList);
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("localStorage boşsa sistem tercihini (dark) varsayılan alır", () => {
    mockMatchMedia(true);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("toggle")).toHaveTextContent("dark");
  });

  it("localStorage'daki kayıtlı tercih sistem tercihinden önceliklidir", () => {
    window.localStorage.setItem("parena-dashboard-theme", "light");
    mockMatchMedia(true);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("toggle")).toHaveTextContent("light");
  });

  it("toggleTheme temayı değiştirir ve localStorage'a yazar", async () => {
    mockMatchMedia(false);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    const toggle = screen.getByTestId("toggle");
    expect(toggle).toHaveTextContent("light");

    await act(async () => {
      toggle.click();
    });

    expect(toggle).toHaveTextContent("dark");
    expect(window.localStorage.getItem("parena-dashboard-theme")).toBe("dark");
  });

  it("data-theme attribute'unu sardığı elemente set eder", () => {
    mockMatchMedia(false);

    const { container } = render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    expect(container.querySelector('[data-theme="light"]')).not.toBeNull();
  });

  it("hiçbir işlem yapılmadığında sistem tercihini localStorage'a yazmaz", () => {
    mockMatchMedia(true);

    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    expect(window.localStorage.getItem("parena-dashboard-theme")).toBeNull();
  });
});
