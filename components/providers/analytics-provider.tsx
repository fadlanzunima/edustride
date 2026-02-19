"use client";

import * as React from "react";

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
  const [AnalyticsComponent, setAnalyticsComponent] =
    React.useState<React.ComponentType | null>(null);
  const [SpeedInsightsComponent, setSpeedInsightsComponent] =
    React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    // Dynamically import analytics components to avoid build errors if packages are missing
    const loadAnalytics = async () => {
      try {
        const analyticsModule = await import("@vercel/analytics/react");
        setAnalyticsComponent(() => analyticsModule.Analytics);
      } catch {
        // Package not available, silently skip
        console.info("Vercel Analytics not available");
      }

      try {
        const speedInsightsModule = await import("@vercel/speed-insights/next");
        setSpeedInsightsComponent(() => speedInsightsModule.SpeedInsights);
      } catch {
        // Package not available, silently skip
        console.info("Vercel Speed Insights not available");
      }
    };

    loadAnalytics();
  }, []);

  return (
    <>
      {AnalyticsComponent && <AnalyticsComponent />}
      {SpeedInsightsComponent && <SpeedInsightsComponent />}
    </>
  );
}
