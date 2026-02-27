import { z, ZodSchema, ZodError } from 'zod';
import { GraphQLError } from 'graphql';

/**
 * Parse & validate input against a Zod schema.
 * On validation failure, throws a GraphQLError with structured field errors.
 */
export const parseInput = <T>(schema: ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new GraphQLError('Validation failed', {
        extensions: {
          code: 'INVALID_INPUT',
          fieldErrors: err.flatten().fieldErrors,
        },
      });
    }
    throw err;
  }
};

/** Email: valid format, lowercased and trimmed */
export const emailSchema = z
  .string()
  .email()
  .transform((e) => e.toLowerCase().trim());

/** Password: minimum 6 characters */
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
