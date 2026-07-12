"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchProfile, updateProfile } from "../services";

export function useProfile() {
  const { session } = useAuth();
  const { data: profile, error, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!session,
    staleTime: 60 * 1000
  });
  return { profile, error, isLoading };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
    }
  });
  return { updateProfile: mutateAsync, isSaving: isPending };
}
