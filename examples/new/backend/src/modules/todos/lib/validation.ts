import { z } from 'zod';

/** Todo content: trimmed, 1–500 characters */
export const todoContentSchema = z
  .string()
  .transform((v) => v.trim())
  .pipe(z.string().min(1, 'Content is required').max(500, 'Content must be 500 characters or less'));
