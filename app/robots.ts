import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

/**
 * Generate robots.txt
 *
 * Controls how search engines crawl and index your site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/_next/", "/private/", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/private/", "/admin/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/private/", "/admin/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
