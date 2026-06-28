import React from "react";
import { render, screen } from "@testing-library/react";
import DrawPage from "./draw-page.component";

describe("DrawPage Component", () => {
  it("renders the DrawPage component with canvas", () => {
    const { container } = render(<DrawPage />);
    const canvas = container.querySelector("canvas");

    expect(canvas).toBeInTheDocument();
  });

  it("renders the toolbar", () => {
    render(<DrawPage />);
    expect(screen.getByRole("button", { name: /select/i })).toBeInTheDocument();
  });
});
