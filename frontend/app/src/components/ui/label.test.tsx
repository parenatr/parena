import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Label } from "./label";

describe("Label", () => {
  it("renders the label text and associates via htmlFor", () => {
    render(
      <>
        <Label htmlFor="ad">Ad</Label>
        <input id="ad" />
      </>,
    );
    expect(screen.getByLabelText("Ad")).toBeInTheDocument();
  });

  it("shows a required indicator when required is set", () => {
    render(<Label required>E-posta</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("clicking the label focuses the associated control", async () => {
    render(
      <>
        <Label htmlFor="email">E-posta</Label>
        <input id="email" />
      </>,
    );
    await userEvent.click(screen.getByText("E-posta"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });
});
