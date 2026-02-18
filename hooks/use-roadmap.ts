import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  CreateRoadmapInput,
  UpdateRoadmapInput,
  UpdateRoadmapItemInput,
  RoadmapQueryInput,
} from "@/lib/validations";
import type { Roadmap, RoadmapItem } from "@prisma/client";

interface RoadmapWithItems extends Roadmap {
  items: RoadmapItem[];
}

interface RoadmapListResponse {
  data: RoadmapWithItems[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query keys
const roadmapKeys = {
  all: ["roadmap"] as const,
  lists: () => [...roadmapKeys.all, "list"] as const,
  list: (filters: RoadmapQueryInput) =>
    [...roadmapKeys.lists(), filters] as const,
  details: () => [...roadmapKeys.all, "detail"] as const,
  detail: (id: string) => [...roadmapKeys.details(), id] as const,
};

// Hooks
export function useRoadmaps(filters: RoadmapQueryInput = {}) {
  return useQuery({
    queryKey: roadmapKeys.list(filters),
    queryFn: () => apiClient.get<RoadmapListResponse>("/roadmap", filters),
  });
}

export function useRoadmap(id: string) {
  return useQuery({
    queryKey: roadmapKeys.detail(id),
    queryFn: () => apiClient.get<RoadmapWithItems>(`/roadmap/${id}`),
    enabled: !!id,
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoadmapInput) =>
      apiClient.post<RoadmapWithItems>("/roadmap", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateRoadmapInput & { id: string }) =>
      apiClient.patch<RoadmapWithItems>(`/roadmap/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ success: boolean }>(`/roadmap/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
    },
  });
}

// Roadmap Item Hooks
export function useCreateRoadmapItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roadmapId,
      ...data
    }: { roadmapId: string } & Record<string, unknown>) =>
      apiClient.post<RoadmapItem>(`/roadmap/${roadmapId}/items`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapKeys.detail(variables.roadmapId),
      });
    },
  });
}

export function useUpdateRoadmapItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoadmapItemInput) =>
      apiClient.patch<RoadmapItem>(`/roadmap/${data.roadmapId}/items`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapKeys.detail(variables.roadmapId),
      });
    },
  });
}

export function useDeleteRoadmapItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roadmapId,
      itemId,
    }: {
      roadmapId: string;
      itemId: string;
    }) =>
      apiClient.delete<{ success: boolean }>(
        `/roadmap/${roadmapId}/items?itemId=${itemId}`
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapKeys.detail(variables.roadmapId),
      });
    },
  });
}

// Stats hook
export function useRoadmapStats() {
  return useQuery({
    queryKey: [...roadmapKeys.all, "stats"],
    queryFn: async () => {
      const response = await apiClient.get<RoadmapListResponse>("/roadmap", {
        limit: 1,
      });
      return {
        total: response.pagination.total,
      };
    },
  });
}
