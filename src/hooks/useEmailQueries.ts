import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchIssues,
  fetchDismissedEmails,
  dismissEmail,
  clearHistory,
} from "lib/api";

const queryKeys = {
  issues: ["issues"] as const,
  dismissed: ["dismissed"] as const,
};

export const useIssues = () =>
  useQuery({
    queryKey: queryKeys.issues,
    queryFn: fetchIssues,
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
  });

export const useDismissedEmails = () =>
  useQuery({
    queryKey: queryKeys.dismissed,
    queryFn: fetchDismissedEmails,
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
  });

export const useDismissEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dismissEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dismissed });
    },
  });
};

export const useClearHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues });
      queryClient.invalidateQueries({ queryKey: queryKeys.dismissed });
    },
  });
};

export const useTimeRemaining = (email: string): string | null => {
  const { data: dismissedEmails = [] } = useDismissedEmails();
  const dismissed = dismissedEmails.find((d) => d.email === email);

  if (!dismissed || dismissed.expiresAt <= Date.now()) {
    return null;
  }

  const remaining = dismissed.expiresAt - Date.now();
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};
