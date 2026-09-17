import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  it("selects an item and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <RadioGroupItem value="aylik" aria-label="Aylık" />
        <RadioGroupItem value="yillik" aria-label="Yıllık" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Yıllık" }));
    expect(onValueChange).toHaveBeenCalledWith("yillik");
  });

  it("only one item is checked at a time", () => {
    render(
      <RadioGroup defaultValue="aylik">
        <RadioGroupItem value="aylik" aria-label="Aylık" />
        <RadioGroupItem value="yillik" aria-label="Yıllık" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Aylık" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Yıllık" })).toHaveAttribute("aria-checked", "false");
  });
});
