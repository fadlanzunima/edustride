import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  CreatePortfolioInput,
  UpdatePortfolioInput,
  PortfolioQueryInput,
} from "@/lib/validations";
import type { Portfolio } from "@prisma/client";

interface PortfolioListResponse {
  data: Portfolio[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query keys
const portfolioKeys = {
  all: ["portfolio"] as const,
  lists: () => [...portfolioKeys.all, "list"] as const,
  list: (filters: PortfolioQueryInput) =>
    [...portfolioKeys.lists(), filters] as const,
  details: () => [...portfolioKeys.all, "detail"] as const,
  detail: (id: string) => [...portfolioKeys.details(), id] as const,
};

// Hooks
export function usePortfolios(filters: PortfolioQueryInput = {}) {
  return useQuery({
    queryKey: portfolioKeys.list(filters),
    queryFn: () => apiClient.get<PortfolioListResponse>("/portfolio", filters),
  });
}

export function usePortfolio(id: string) {
  return useQuery({
    queryKey: portfolioKeys.detail(id),
    queryFn: () => apiClient.get<Portfolio>(`/portfolio/${id}`),
    enabled: !!id,
  });
}

export function useCreatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePortfolioInput) =>
      apiClient.post<Portfolio>("/portfolio", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
    },
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdatePortfolioInput & { id: string }) =>
      apiClient.patch<Portfolio>(`/portfolio/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: portfolioKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ success: boolean }>(`/portfolio/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
    },
  });
}

// Stats hook
export function usePortfolioStats() {
  return useQuery({
    queryKey: [...portfolioKeys.all, "stats"],
    queryFn: async () => {
      const response = await apiClient.get<PortfolioListResponse>(
        "/portfolio",
        {
          limit: 1,
        }
      );
      return {
        total: response.pagination.total,
      };
    },
  });
}
