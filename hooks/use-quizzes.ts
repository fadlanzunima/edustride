import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  CreateQuizInput,
  UpdateQuizInput,
  SubmitQuizInput,
  QuizQueryInput,
} from "@/lib/validations";
import type { Quiz, QuizAttempt } from "@prisma/client";

interface QuizWithDetails extends Quiz {
  skill?: {
    id: string;
    name: string;
    category: string;
  } | null;
  questions?: Array<{
    id: string;
    question: string;
    type: string;
    order: number;
    points: number;
    options: any;
    correctAnswer: string | null;
    explanation: string | null;
  }>;
  _count?: {
    questions: number;
    attempts: number;
  };
}

interface QuizAttemptWithDetails extends QuizAttempt {
  questionAnswers?: Array<{
    id: string;
    answer: string;
    isCorrect: boolean;
    points: number;
  }>;
}

interface QuizListResponse {
  data: QuizWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface QuizAttemptResponse {
  attempt: QuizAttemptWithDetails;
  score: number;
  passed: boolean;
  message: string;
}

// Query keys
const quizKeys = {
  all: ["quizzes"] as const,
  lists: () => [...quizKeys.all, "list"] as const,
  list: (filters: QuizQueryInput) => [...quizKeys.lists(), filters] as const,
  details: () => [...quizKeys.all, "detail"] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  attempts: (quizId: string) => [...quizKeys.detail(quizId), "attempts"] as const,
};

// Hooks
export function useQuizzes(filters: QuizQueryInput = {}) {
  return useQuery({
    queryKey: quizKeys.list(filters),
    queryFn: () => apiClient.get<QuizListResponse>("/quizzes", filters),
  });
}

export function useQuiz(id: string) {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => apiClient.get<QuizWithDetails>(`/quizzes/${id}`),
    enabled: !!id,
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizInput) =>
      apiClient.post<QuizWithDetails>("/quizzes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateQuizInput & { id: string }) =>
      apiClient.put<QuizWithDetails>(`/quizzes/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ success: boolean }>(`/quizzes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

export function useQuizAttempts(quizId: string) {
  return useQuery({
    queryKey: quizKeys.attempts(quizId),
    queryFn: () => apiClient.get<{ data: QuizAttemptWithDetails[] }>(`/quizzes/${quizId}/attempts`),
    enabled: !!quizId,
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, answers }: SubmitQuizInput & { quizId: string }) =>
      apiClient.post<QuizAttemptResponse>(`/quizzes/${quizId}/attempts`, { answers }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.detail(variables.quizId),
      });
      queryClient.invalidateQueries({
        queryKey: quizKeys.attempts(variables.quizId),
      });
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

// Stats hooks
export function useQuizStats() {
  return useQuery({
    queryKey: [...quizKeys.all, "stats"],
    queryFn: async () => {
      const response = await apiClient.get<QuizListResponse>("/quizzes", {
        limit: 1,
      });
      return {
        total: response.pagination.total,
        totalAttempts: response.data.reduce((sum, quiz) => sum + (quiz._count?.attempts || 0), 0),
      };
    },
  });
}

export function useQuizzesByCategory() {
  return useQuery({
    queryKey: [...quizKeys.all, "by-category"],
    queryFn: async () => {
      const response = await apiClient.get<QuizListResponse>("/quizzes", {
        limit: 100,
      });

      const byCategory = response.data.reduce((acc, quiz) => {
        if (!acc[quiz.category]) {
          acc[quiz.category] = [];
        }
        acc[quiz.category].push(quiz);
        return acc;
      }, {} as Record<string, QuizWithDetails[]>);

      return byCategory;
    },
  });
}
