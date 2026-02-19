import type { Metadata, Viewport } from "next";

/**
 * Default SEO Metadata Configuration
 *
 * This file contains default metadata configuration for the EduStride application.
 * Each page can override these defaults by exporting their own metadata.
 */

// Site configuration
export const siteConfig = {
  name: "EduStride",
  description:
    "Integrated education platform for Indonesian students to build digital portfolios and develop industry-relevant skills.",
  descriptionId:
    "Platform pendidikan terpadu untuk pelajar Indonesia membangun portofolio digital dan mengembangkan skill yang relevan dengan industri.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://edustride.id",
  ogImage: "/og-image.png",
  twitterHandle: "@edustride",
  locale: "id",
  localeAlt: "en",
};

// Default viewport configuration
export const defaultViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Default metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "education",
    "portfolio",
    "skills",
    "indonesia",
    "students",
    "SMA",
    "S1",
    "S2",
    "S3",
    "digital portfolio",
    "career development",
    "learning platform",
    "pendidikan",
    "portofolio",
    "skill",
    "pelajar",
    "karir",
  ],
  authors: [{ name: "EduStride Team" }],
  creator: "EduStride",
  publisher: "EduStride",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: siteConfig.localeAlt,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "/",
    languages: {
      id: "/id",
      en: "/en",
    },
  },
};

// Helper function to generate page-specific metadata
export function generateMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    ...defaultMetadata,
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      url,
      title,
      description,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
    alternates: {
      ...defaultMetadata.alternates,
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : defaultMetadata.robots,
  };
}
