import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Field } from "./field";

describe("Field", () => {
  it("renders the label linked to the control via htmlFor", () => {
    render(
      <Field htmlFor="ad" label="Ad">
        <input id="ad" />
      </Field>,
    );
    expect(screen.getByLabelText("Ad")).toBeInTheDocument();
  });

  it("shows the hint when there is no error", () => {
    render(
      <Field htmlFor="pass" label="Parola" hint="en az 10 karakter">
        <input id="pass" />
      </Field>,
    );
    expect(screen.getByText("en az 10 karakter")).toBeInTheDocument();
  });

  it("shows the error with role=alert and hides the hint", () => {
    render(
      <Field htmlFor="mail" label="E-posta" hint="ornek@eposta.com" error="Geçerli bir e-posta adresi gir.">
        <input id="mail" />
      </Field>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Geçerli bir e-posta adresi gir.");
    expect(screen.queryByText("ornek@eposta.com")).not.toBeInTheDocument();
  });

  it("shows a required indicator on the label", () => {
    render(
      <Field htmlFor="soyad" label="Soyad" required>
        <input id="soyad" />
      </Field>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
