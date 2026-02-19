import {
  useQueryState,
  useQueryStates,
  parseAsString,
  parseAsStringEnum,
  parseAsInteger,
} from "nuqs";

// Dashboard view types
export type DashboardView = "overview" | "analytics" | "activities";

// Dashboard time range
export type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

// Portfolio filter types
export type PortfolioSort = "newest" | "oldest" | "name" | "updated";
export type PortfolioStatus = "all" | "published" | "draft" | "archived";
export type PortfolioType =
  | "all"
  | "project"
  | "certificate"
  | "experience"
  | "publication"
  | "award";

// Skills filter types
export type SkillsSort = "name" | "progress" | "category";
export type SkillsCategory =
  | "all"
  | "technical"
  | "soft"
  | "language"
  | "tool"
  | "domain";

// Quiz filter types
export type QuizDifficulty = "all" | "beginner" | "intermediate" | "advanced";
export type QuizStatus = "all" | "completed" | "incomplete";

/**
 * Hook for managing dashboard overview URL state
 */
export function useDashboardOverviewState() {
  return useQueryStates({
    view: parseAsStringEnum<DashboardView>([
      "overview",
      "analytics",
      "activities",
    ]).withDefault("overview"),
    timeRange: parseAsStringEnum<TimeRange>([
      "7d",
      "30d",
      "90d",
      "1y",
      "all",
    ]).withDefault("30d"),
  });
}

/**
 * Hook for managing portfolio list URL state
 */
export function usePortfolioListState() {
  return useQueryStates({
    search: parseAsString.withDefault(""),
    sort: parseAsStringEnum<PortfolioSort>([
      "newest",
      "oldest",
      "name",
      "updated",
    ]).withDefault("newest"),
    status: parseAsStringEnum<PortfolioStatus>([
      "all",
      "published",
      "draft",
      "archived",
    ]).withDefault("all"),
    type: parseAsStringEnum<PortfolioType>([
      "all",
      "project",
      "certificate",
      "experience",
      "publication",
      "award",
    ]).withDefault("all"),
    page: parseAsInteger.withDefault(1),
  });
}

/**
 * Hook for managing skills list URL state
 */
export function useSkillsListState() {
  return useQueryStates({
    search: parseAsString.withDefault(""),
    sort: parseAsStringEnum<SkillsSort>([
      "name",
      "progress",
      "category",
    ]).withDefault("name"),
    category: parseAsStringEnum<SkillsCategory>([
      "all",
      "technical",
      "soft",
      "language",
      "tool",
      "domain",
    ]).withDefault("all"),
    page: parseAsInteger.withDefault(1),
  });
}

/**
 * Hook for managing quiz list URL state
 */
export function useQuizListState() {
  return useQueryStates({
    search: parseAsString.withDefault(""),
    difficulty: parseAsStringEnum<QuizDifficulty>([
      "all",
      "beginner",
      "intermediate",
      "advanced",
    ]).withDefault("all"),
    status: parseAsStringEnum<QuizStatus>([
      "all",
      "completed",
      "incomplete",
    ]).withDefault("all"),
    page: parseAsInteger.withDefault(1),
  });
}

/**
 * Hook for managing activities filter URL state
 */
export function useActivitiesState() {
  return useQueryStates({
    type: parseAsString.withDefault("all"),
    timeRange: parseAsStringEnum<TimeRange>([
      "7d",
      "30d",
      "90d",
      "1y",
      "all",
    ]).withDefault("30d"),
    page: parseAsInteger.withDefault(1),
  });
}

/**
 * Hook for managing analytics dashboard URL state
 */
export function useAnalyticsState() {
  return useQueryStates({
    timeRange: parseAsStringEnum<TimeRange>([
      "7d",
      "30d",
      "90d",
      "1y",
      "all",
    ]).withDefault("30d"),
    metric: parseAsString.withDefault("overview"),
  });
}

/**
 * Hook for managing shareable dashboard state
 * Combines all states for sharing via URL
 */
export function useShareableDashboardState() {
  const [overviewState, setOverviewState] = useDashboardOverviewState();
  const [portfolioState, setPortfolioState] = usePortfolioListState();
  const [skillsState, setSkillsState] = useSkillsListState();

  const generateShareableUrl = () => {
    const params = new URLSearchParams();

    // Add overview state
    if (overviewState.view !== "overview")
      params.set("view", overviewState.view);
    if (overviewState.timeRange !== "30d")
      params.set("timeRange", overviewState.timeRange);

    // Add portfolio state
    if (portfolioState.search)
      params.set("portfolioSearch", portfolioState.search);
    if (portfolioState.sort !== "newest")
      params.set("portfolioSort", portfolioState.sort);
    if (portfolioState.status !== "all")
      params.set("portfolioStatus", portfolioState.status);
    if (portfolioState.type !== "all")
      params.set("portfolioType", portfolioState.type);

    // Add skills state
    if (skillsState.search) params.set("skillsSearch", skillsState.search);
    if (skillsState.sort !== "name") params.set("skillsSort", skillsState.sort);
    if (skillsState.category !== "all")
      params.set("skillsCategory", skillsState.category);

    return `${window.location.origin}/dashboard?${params.toString()}`;
  };

  const applySharedState = (urlParams: URLSearchParams) => {
    // Apply overview state
    const view = urlParams.get("view") as DashboardView | null;
    const timeRange = urlParams.get("timeRange") as TimeRange | null;

    if (view || timeRange) {
      setOverviewState({
        view: view || "overview",
        timeRange: timeRange || "30d",
      });
    }

    // Apply portfolio state
    const portfolioSearch = urlParams.get("portfolioSearch");
    const portfolioSort = urlParams.get(
      "portfolioSort"
    ) as PortfolioSort | null;
    const portfolioStatus = urlParams.get(
      "portfolioStatus"
    ) as PortfolioStatus | null;
    const portfolioType = urlParams.get(
      "portfolioType"
    ) as PortfolioType | null;

    if (portfolioSearch || portfolioSort || portfolioStatus || portfolioType) {
      setPortfolioState({
        search: portfolioSearch || "",
        sort: portfolioSort || "newest",
        status: portfolioStatus || "all",
        type: portfolioType || "all",
        page: 1,
      });
    }

    // Apply skills state
    const skillsSearch = urlParams.get("skillsSearch");
    const skillsSort = urlParams.get("skillsSort") as SkillsSort | null;
    const skillsCategory = urlParams.get(
      "skillsCategory"
    ) as SkillsCategory | null;

    if (skillsSearch || skillsSort || skillsCategory) {
      setSkillsState({
        search: skillsSearch || "",
        sort: skillsSort || "name",
        category: skillsCategory || "all",
        page: 1,
      });
    }
  };

  return {
    overviewState,
    portfolioState,
    skillsState,
    generateShareableUrl,
    applySharedState,
  };
}
