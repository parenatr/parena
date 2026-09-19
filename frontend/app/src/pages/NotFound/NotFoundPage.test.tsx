import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
  it("404 mesajını ve ana sayfaya dönüş linkini gösterir", () => {
    render(<NotFoundPage />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sayfa bulunamadı" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ana sayfaya dön" })).toHaveAttribute("href", "/");
  });
});
