import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { query, mutation, noteSelector, type NoteItem, NoteStatus } from '@/api';

export type { NoteItem };

interface CreateNoteInput {
  content: string;
  status?: NoteStatus | null;
}

export const useNotes = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  // --- Notes Query ---

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async (): Promise<NoteItem[]> => {
      const data = await query()({
        user: { notes: noteSelector },
      });
      return data.user?.notes ?? [];
    },
    enabled: isAuthenticated,
  });

  // --- Create Note Mutation ---

  const createNoteMutation = useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      await mutation()({
        user: { createNote: [{ input }, noteSelector] },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // --- Delete Note Mutation ---

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await mutation()({
        user: { deleteNote: [{ id }, true] },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const createNote = async (input: CreateNoteInput) => {
    try {
      await createNoteMutation.mutateAsync(input);
      return true;
    } catch {
      return false;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteNoteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  return {
    notes,
    isLoading,
    createNote,
    isCreating: createNoteMutation.isPending,
    deleteNote,
    isDeleting: deleteNoteMutation.isPending,
  };
};
