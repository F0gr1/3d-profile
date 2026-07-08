import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockMatchMedia(false);
  });

  it("renders public profile content and removes placeholder contacts", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "Ishigami Yuki" })).toBeInTheDocument();
    expect(screen.getByText(/F0gr1 \/ Full-stack Web Developer/i)).toBeInTheDocument();
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /nest-chat/i })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "GitHub profile" })).toHaveAttribute(
      "href",
      "https://github.com/F0gr1",
    );

    expect(screen.queryByText(/your\.email|yourusername|yourprofile|linkedin\.com/i)).not.toBeInTheDocument();
  });

  it("renders a readable fallback when WebGL is unavailable", () => {
    render(<App />);

    expect(screen.getByText("Static fallback active")).toBeInTheDocument();
    expect(screen.getByText(/WebGL is not available in this environment/i)).toBeInTheDocument();
    expect(screen.getByText(/same portfolio content remains available as readable HTML/i)).toBeInTheDocument();
  });

  it("surfaces reduced-motion mode in visible UI", () => {
    mockMatchMedia(true);

    render(<App />);

    expect(screen.getByText("Reduced motion mode: animations paused")).toBeInTheDocument();
  });
});
