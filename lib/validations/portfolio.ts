import { z } from "zod";

export const portfolioTypeSchema = z.enum([
  "PROJECT",
  "CERTIFICATE",
  "EXPERIENCE",
  "PUBLICATION",
  "AWARD",
]);

export const portfolioStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createPortfolioSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
  type: portfolioTypeSchema,
  status: portfolioStatusSchema.default("DRAFT"),
  thumbnail: z.string().url("Invalid thumbnail URL").optional().nullable(),
  link: z.string().url("Invalid link URL").optional().nullable(),
  githubUrl: z.string().url("Invalid GitHub URL").optional().nullable(),
  demoUrl: z.string().url("Invalid demo URL").optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  isFeatured: z.boolean().default(false),
  tags: z
    .array(z.string().max(50))
    .max(20, "Maximum 20 tags allowed")
    .default([]),
});

export const updatePortfolioSchema = createPortfolioSchema.partial().extend({
  id: z.string(),
});

// Schema for API query validation (with defaults)
export const portfolioQuerySchema = z.object({
  type: portfolioTypeSchema.optional(),
  status: portfolioStatusSchema.optional(),
  isFeatured: z.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type for hook input (all optional)
export type PortfolioQueryInput = {
  type?: z.infer<typeof portfolioTypeSchema>;
  status?: z.infer<typeof portfolioStatusSchema>;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
};

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
