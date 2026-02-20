import { Loader2, NotebookPen, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { Skeleton } from '@/components/ui/Skeleton';

import { cn } from '@/lib/utils';
import { type NoteItem, NoteStatus } from '@/api';
import { useAuthStore } from '@/stores';

import { useNotes } from '../Notes.hook';

// --- Zod schema (module-level — never inside component) ---

const createNoteSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

type CreateNoteValues = z.infer<typeof createNoteSchema>;

// --- Status badge helpers ---

const statusBadgeClass = (status: NoteItem['status']): string =>
  cn(
    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
    status === NoteStatus.ACTIVE
      ? 'bg-green-500/10 text-green-700 dark:text-green-400'
      : 'bg-muted text-muted-foreground',
  );

const statusLabel = (status: NoteItem['status']): string => (status === NoteStatus.ACTIVE ? 'Active' : 'Archived');

// --- Date formatter ---

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// --- Component ---

export const NotesShowcase = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { notes, isLoading, createNote, isCreating, deleteNote, isDeleting } = useNotes();

  const form = useForm<CreateNoteValues>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (values: CreateNoteValues) => {
    const success = await createNote({ content: values.content, status: NoteStatus.ACTIVE });
    if (success) {
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <NotebookPen className="h-5 w-5" />
          Notes
        </CardTitle>
        <CardDescription>
          Demonstrates the notes module — create, list, and delete notes backed by a live GraphQL API.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Notes list */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Your Notes</h4>

          {/* Loading skeletons */}
          {isLoading && isAuthenticated && (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>
          )}

          {/* Not authenticated */}
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground rounded-md border border-dashed p-4 text-center">
              Log in to create and view notes.
            </p>
          )}

          {/* Empty state */}
          {isAuthenticated && !isLoading && notes.length === 0 && (
            <p className="text-sm text-muted-foreground rounded-md border border-dashed p-4 text-center">
              No notes yet. Create one below!
            </p>
          )}

          {/* Notes list */}
          {isAuthenticated && !isLoading && notes.length > 0 && (
            <ul className="space-y-2">
              {notes.map((note) => {
                // Zeus maps the ID scalar to `any`, which becomes `unknown` via FromSelector.
                // Cast once here — the value is always a string at runtime.
                const noteId = note.id as string;
                return (
                  <li key={noteId} className="flex items-start justify-between gap-3 rounded-md border p-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm text-foreground break-words">{note.content}</p>
                      <div className="flex items-center gap-2">
                        <span className={statusBadgeClass(note.status)}>{statusLabel(note.status)}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</span>
                      </div>
                    </div>

                    {isAuthenticated && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        disabled={isDeleting}
                        onClick={() => deleteNote(noteId)}
                        aria-label="Delete note"
                      >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Create form — only when authenticated */}
        {isAuthenticated && (
          <>
            <Separator />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Create a Note</h4>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Input placeholder="Write a note..." autoComplete="off" disabled={isCreating} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <NotebookPen className="h-4 w-4" />}
                    {isCreating ? 'Creating...' : 'Create Note'}
                  </Button>
                </form>
              </Form>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
