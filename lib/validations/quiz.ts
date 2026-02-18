import { z } from "zod";

export const quizDifficultySchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export const questionTypeSchema = z.enum([
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "SHORT_ANSWER",
  "ESSAY",
]);

export const createQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  type: questionTypeSchema.default("MULTIPLE_CHOICE"),
  points: z.number().int().positive().default(1),
  options: z
    .array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
});

export const createQuizSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional().nullable(),
  category: z
    .enum([
      "TECHNICAL",
      "SOFT_SKILL",
      "LANGUAGE",
      "TOOL",
      "DOMAIN_KNOWLEDGE",
    ])
    .default("TECHNICAL"),
  difficulty: quizDifficultySchema.default("INTERMEDIATE"),
  timeLimit: z.union([
    z.number().int().positive(),
    z.string().transform((val) => val === "" ? null : parseInt(val)),
    z.null(),
  ]).optional().nullable(),
  passingScore: z.coerce.number().int().min(0).max(100).default(70),
  skillId: z.union([z.string(), z.null()]).optional().nullable(),
  questions: z.array(createQuestionSchema).optional(),
});

export const updateQuizSchema = createQuizSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
});

// Schema for API query validation (with defaults)
export const quizQuerySchema = z.object({
  category: z
    .enum([
      "TECHNICAL",
      "SOFT_SKILL",
      "LANGUAGE",
      "TOOL",
      "DOMAIN_KNOWLEDGE",
    ])
    .optional(),
  difficulty: quizDifficultySchema.optional(),
  skillId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type QuizQueryInput = z.infer<typeof quizQuerySchema>;
