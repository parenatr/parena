import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

beforeAll(() => {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

function Harness() {
  return (
    <Select defaultValue="aylik">
      <SelectTrigger aria-label="Dönem">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aylik">Aylık</SelectItem>
        <SelectItem value="yillik">Yıllık</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("shows the selected value on the trigger", () => {
    render(<Harness />);
    expect(screen.getByRole("combobox", { name: "Dönem" })).toHaveTextContent("Aylık");
  });

  it("opens the listbox and selects a new option", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("combobox", { name: "Dönem" }));
    await userEvent.click(await screen.findByRole("option", { name: "Yıllık" }));
    expect(screen.getByRole("combobox", { name: "Dönem" })).toHaveTextContent("Yıllık");
  });
});
