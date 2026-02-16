import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDynamite } from '@aexol/dynamite';
import { query, mutation, sessionSelector } from '@/api';

export const useSettings = () => {
  const { t } = useDynamite();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const data = await query()({ user: { sessions: sessionSelector } });
      return data.user?.sessions ?? [];
    },
  });

  const revokeSession = useMutation({
    mutationFn: async (sessionId: string) => {
      await mutation()({ user: { revokeSession: [{ sessionId }, true] } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success(t('Session revoked'));
    },
  });

  const revokeAllSessions = useMutation({
    mutationFn: async () => {
      await mutation()({ user: { revokeAllSessions: true } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success(t('All other sessions revoked'));
    },
  });

  const changePassword = useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      await mutation()({ user: { changePassword: [{ oldPassword, newPassword }, true] } });
    },
    onSuccess: () => {
      toast.success(t('Password changed successfully'));
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (password: string) => {
      await mutation()({ user: { deleteAccount: [{ password }, true] } });
    },
    // onSuccess is handled by the component (needs to logout + redirect)
  });

  return {
    sessions,
    isLoadingSessions,
    revokeSession,
    revokeAllSessions,
    changePassword,
    deleteAccount,
  };
};
