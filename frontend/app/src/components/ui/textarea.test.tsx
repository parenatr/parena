import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders and accepts typed input", async () => {
    render(<Textarea aria-label="Not" />);
    const textarea = screen.getByRole("textbox", { name: "Not" });
    await userEvent.type(textarea, "Merhaba");
    expect(textarea).toHaveValue("Merhaba");
  });

  it("marks aria-invalid when invalid is set", () => {
    render(<Textarea aria-label="Açıklama" invalid />);
    expect(screen.getByRole("textbox", { name: "Açıklama" })).toHaveAttribute("aria-invalid", "true");
  });

  it("respects disabled", () => {
    render(<Textarea aria-label="Devre dışı" disabled />);
    expect(screen.getByRole("textbox", { name: "Devre dışı" })).toBeDisabled();
  });
});
