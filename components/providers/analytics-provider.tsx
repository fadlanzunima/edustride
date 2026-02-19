"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Analytics Provider Component
 *
 * Integrates Vercel Analytics and Speed Insights for monitoring:
 * - Page views and user interactions
 * - Web vitals and performance metrics
 * - Real user monitoring (RUM)
 *
 * @see https://vercel.com/docs/analytics
 * @see https://vercel.com/docs/speed-insights
 */
export function AnalyticsProvider() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
