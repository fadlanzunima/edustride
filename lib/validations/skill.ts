import { z } from "zod";

export const skillCategorySchema = z.enum([
  "TECHNICAL",
  "SOFT_SKILL",
  "LANGUAGE",
  "TOOL",
  "DOMAIN_KNOWLEDGE",
]);

export const skillLevelSchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export const createSkillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .max(100, "Skill name is too long"),
  category: skillCategorySchema.default("TECHNICAL"),
  level: skillLevelSchema.default("BEGINNER"),
  progress: z.number().int().min(0).max(100).default(0),
  description: z.string().max(1000, "Description is too long").optional(),
  isPublic: z.boolean().default(true),
});

export const updateSkillSchema = createSkillSchema.partial().extend({
  id: z.string(),
});

export const updateSkillProgressSchema = z.object({
  id: z.string(),
  progress: z.number().int().min(0).max(100),
});

// Schema for API query validation (with defaults)
export const skillQuerySchema = z.object({
  category: skillCategorySchema.optional(),
  level: skillLevelSchema.optional(),
  isPublic: z.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  sortBy: z.enum(["createdAt", "progress", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type for hook input (all optional)
export type SkillQueryInput = {
  category?: z.infer<typeof skillCategorySchema>;
  level?: z.infer<typeof skillLevelSchema>;
  isPublic?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "progress" | "name";
  sortOrder?: "asc" | "desc";
};

export const endorseSkillSchema = z.object({
  skillId: z.string(),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
export type UpdateSkillProgressInput = z.infer<
  typeof updateSkillProgressSchema
>;
