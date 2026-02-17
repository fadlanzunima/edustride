import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EduStride - Skill & Digital Portfolio",
  description: "Platform edukasi terpadu untuk membangun portofolio digital dan skill dari SMA hingga S3",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
