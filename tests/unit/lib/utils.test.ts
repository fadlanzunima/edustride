import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    const result = cn("base-class", "additional-class");
    expect(result).toBe("base-class additional-class");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const result = cn("base", isActive && "active", !isActive && "inactive");
    expect(result).toBe("base active");
  });

  it("handles object syntax", () => {
    const result = cn("base", {
      active: true,
      inactive: false,
    });
    expect(result).toBe("base active");
  });

  it("removes falsy values", () => {
    const result = cn("base", null, undefined, false, "", "valid");
    expect(result).toBe("base valid");
  });

  it("merges tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });
});
