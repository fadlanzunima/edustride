import type { Viewport } from "next";
import { defaultMetadata, defaultViewport } from "@/lib/metadata";

// Export metadata and viewport for SEO
export const metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
