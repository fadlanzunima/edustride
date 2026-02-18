import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  CreateSkillInput,
  UpdateSkillInput,
  SkillQueryInput,
} from "@/lib/validations";
import type { Skill } from "@prisma/client";

interface SkillListResponse {
  data: Skill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query keys
const skillKeys = {
  all: ["skills"] as const,
  lists: () => [...skillKeys.all, "list"] as const,
  list: (filters: SkillQueryInput) => [...skillKeys.lists(), filters] as const,
  details: () => [...skillKeys.all, "detail"] as const,
  detail: (id: string) => [...skillKeys.details(), id] as const,
};

// Hooks
export function useSkills(filters: SkillQueryInput = {}) {
  return useQuery({
    queryKey: skillKeys.list(filters),
    queryFn: () => apiClient.get<SkillListResponse>("/skills", filters),
  });
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: skillKeys.detail(id),
    queryFn: () => apiClient.get<Skill>(`/skills/${id}`),
    enabled: !!id,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillInput) =>
      apiClient.post<Skill>("/skills", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateSkillInput & { id: string }) =>
      apiClient.patch<Skill>(`/skills/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: skillKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
    },
  });
}

export function useUpdateSkillProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      apiClient.patch<Skill>(`/skills/${id}`, { progress }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: skillKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ success: boolean }>(`/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.lists() });
    },
  });
}

// Stats hooks
export function useSkillStats() {
  return useQuery({
    queryKey: [...skillKeys.all, "stats"],
    queryFn: async () => {
      const response = await apiClient.get<SkillListResponse>("/skills", {
        limit: 1,
      });
      return {
        total: response.pagination.total,
      };
    },
  });
}

export function useSkillsByCategory() {
  return useQuery({
    queryKey: [...skillKeys.all, "by-category"],
    queryFn: async () => {
      const response = await apiClient.get<SkillListResponse>("/skills", {
        limit: 100,
      });

      const byCategory = response.data.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, Skill[]>);

      return byCategory;
    },
  });
}
