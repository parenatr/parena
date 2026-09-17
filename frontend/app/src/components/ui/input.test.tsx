import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./input";

describe("Input", () => {
  it("renders and accepts typed input", async () => {
    render(<Input aria-label="Ad" />);
    const input = screen.getByRole("textbox", { name: "Ad" });
    await userEvent.type(input, "Ayşe");
    expect(input).toHaveValue("Ayşe");
  });

  it("marks aria-invalid when invalid is set", () => {
    render(<Input aria-label="E-posta" invalid />);
    expect(screen.getByRole("textbox", { name: "E-posta" })).toHaveAttribute("aria-invalid", "true");
  });

  it("toggles password visibility", async () => {
    render(<Input type="password" aria-label="Parola" />);
    const input = screen.getByLabelText("Parola");
    expect(input).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Parolayı göster" }));
    expect(input).toHaveAttribute("type", "text");
  });

  it("respects disabled", () => {
    render(<Input aria-label="Devre dışı" disabled />);
    expect(screen.getByRole("textbox", { name: "Devre dışı" })).toBeDisabled();
  });
});
