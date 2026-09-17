import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";

describe("Button", () => {
  it("children'ı render eder ve tıklamaya tepki verir", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Kaydet</Button>);

    const button = screen.getByRole("button", { name: "Kaydet" });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("loading durumunda tıklamayı engeller ve aria-busy set eder", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Gönder
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Gönder" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disabled prop'u varsayılan HTML davranışıyla çalışır", () => {
    render(<Button disabled>Devre dışı</Button>);
    expect(screen.getByRole("button", { name: "Devre dışı" })).toBeDisabled();
  });
});
