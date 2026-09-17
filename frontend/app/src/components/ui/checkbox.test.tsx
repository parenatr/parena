import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles checked state via click", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Şartları kabul ediyorum" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Şartları kabul ediyorum" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("supports the indeterminate state", () => {
    render(<Checkbox aria-label="Tümünü seç" checked="indeterminate" />);
    expect(screen.getByRole("checkbox", { name: "Tümünü seç" })).toHaveAttribute(
      "data-state",
      "indeterminate",
    );
  });

  it("respects disabled", () => {
    render(<Checkbox aria-label="Devre dışı" disabled />);
    expect(screen.getByRole("checkbox", { name: "Devre dışı" })).toBeDisabled();
  });
});
