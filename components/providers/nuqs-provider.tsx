"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

/**
 * Nuqs Provider Component
 *
 * Wraps the application with NuqsAdapter for URL state management.
 * This enables type-safe URL search params state management across the app.
 *
 * @see https://nuqs.47ng.com/
 */
export function NuqsProvider({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
