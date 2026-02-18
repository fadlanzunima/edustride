import { z } from "zod";

export const activityTypeSchema = z.enum([
  "PORTFOLIO_CREATED",
  "PORTFOLIO_UPDATED",
  "SKILL_ADDED",
  "SKILL_LEVEL_UP",
  "ROADMAP_CREATED",
  "ROADMAP_COMPLETED",
  "ROADMAP_ITEM_COMPLETED",
  "ACHIEVEMENT_EARNED",
  "PROFILE_UPDATED",
  "CERTIFICATE_EARNED",
  "PROJECT_PUBLISHED",
  "EXPERIENCE_ADDED",
]);

export const createActivitySchema = z.object({
  type: activityTypeSchema,
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  entityType: z
    .enum(["portfolio", "skill", "roadmap", "achievement", "profile"])
    .optional(),
  entityId: z.string().optional(),
  isPublic: z.boolean().default(true),
});

// Schema for API query validation (with defaults)
export const activityQuerySchema = z.object({
  type: activityTypeSchema.optional(),
  entityType: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Type for hook input (all optional)
export type ActivityQueryInput = {
  type?: z.infer<typeof activityTypeSchema>;
  entityType?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
