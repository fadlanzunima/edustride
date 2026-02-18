import { z } from "zod";

export const roadmapItemStatusSchema = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "SKIPPED",
]);

export const roadmapItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(2000, "Description is too long").optional(),
  order: z.number().int().min(0).default(0),
  status: roadmapItemStatusSchema.default("NOT_STARTED"),
  deadline: z.string().datetime().optional().nullable(),
  resources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        type: z.enum(["article", "video", "course", "book", "other"]),
      })
    )
    .optional(),
});

export const createRoadmapSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
  level: z.enum(["SMA", "S1", "S2_S3"]),
  category: z.string().min(1, "Category is required").max(100),
  deadline: z.string().datetime().optional().nullable(),
  items: z
    .array(roadmapItemSchema)
    .max(50, "Maximum 50 items allowed")
    .default([]),
});

export const updateRoadmapSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  level: z.enum(["SMA", "S1", "S2_S3"]).optional(),
  category: z.string().min(1).max(100).optional(),
  deadline: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateRoadmapItemSchema = z.object({
  roadmapId: z.string(),
  itemId: z.string(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: roadmapItemStatusSchema.optional(),
  deadline: z.string().datetime().optional().nullable(),
  resources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        type: z.enum(["article", "video", "course", "book", "other"]),
      })
    )
    .optional(),
});

// Schema for API query validation (with defaults)
export const roadmapQuerySchema = z.object({
  level: z.enum(["SMA", "S1", "S2_S3"]).optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  isTemplate: z.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  sortBy: z.enum(["createdAt", "deadline", "progress"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type for hook input (all optional)
export type RoadmapQueryInput = {
  level?: "SMA" | "S1" | "S2_S3";
  category?: string;
  isActive?: boolean;
  isTemplate?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "deadline" | "progress";
  sortOrder?: "asc" | "desc";
};

export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type UpdateRoadmapInput = z.infer<typeof updateRoadmapSchema>;
export type UpdateRoadmapItemInput = z.infer<typeof updateRoadmapItemSchema>;
