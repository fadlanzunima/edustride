import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled button", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText("Disabled")).toBeDisabled();
  });

  it("renders different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByText("Default")).toBeInTheDocument();

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByText("Destructive")).toBeInTheDocument();

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByText("Outline")).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText("Ghost")).toBeInTheDocument();
  });

  it("renders different sizes", () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    expect(screen.getByText("Default")).toBeInTheDocument();

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small")).toBeInTheDocument();

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large")).toBeInTheDocument();
  });
});
