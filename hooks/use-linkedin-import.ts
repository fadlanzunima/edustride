import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types for LinkedIn data
export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  industry: string;
  location: {
    city: string;
    country: string;
  };
}

export interface LinkedInPosition {
  title: string;
  company: string;
  description: string;
  startDate: { month: number; year: number };
  endDate: { month: number; year: number } | null;
  isCurrent: boolean;
}

export interface LinkedInEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: { year: number };
  endDate: { year: number };
}

export interface LinkedInSkill {
  name: string;
  endorsements: number;
}

export interface LinkedInCertification {
  name: string;
  authority: string;
  issueDate: { month: number; year: number };
}

export interface LinkedInData {
  profile: LinkedInProfile;
  positions: LinkedInPosition[];
  education: LinkedInEducation[];
  skills: LinkedInSkill[];
  certifications: LinkedInCertification[];
}

export interface LinkedInImportResponse {
  success: boolean;
  data: LinkedInData;
  source: string;
  message: string;
}

export interface LinkedInSaveResponse {
  success: boolean;
  message: string;
  imported: {
    profile: boolean;
    positions: number;
    education: number;
    skills: number;
    certifications: number;
  };
}

// Fetch LinkedIn profile data
async function fetchLinkedInProfile(): Promise<LinkedInImportResponse> {
  const response = await fetch("/api/linkedin/import");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch LinkedIn profile");
  }

  return response.json();
}

// Save LinkedIn profile data to EduStride
async function saveLinkedInData(
  data: LinkedInData
): Promise<LinkedInSaveResponse> {
  const response = await fetch("/api/linkedin/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save LinkedIn profile data");
  }

  return response.json();
}

// Hook to fetch LinkedIn profile data
export function useLinkedInProfile() {
  return useQuery({
    queryKey: ["linkedin", "profile"],
    queryFn: fetchLinkedInProfile,
    enabled: false, // Don't fetch automatically
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to save LinkedIn data
export function useSaveLinkedInData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveLinkedInData,
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
