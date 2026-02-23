---
name: react-hook-form-zod
description: React Hook Form with Zod validation, shadcn/ui Form components, accessibility (autocomplete/name/labels), async submissions, and error handling patterns
---

## Schema + Type

Define schema at **module level** (outside component). Infer type from it — never define form types manually.

```typescript
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;
```

## useForm Setup

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { email: '', password: '' }, // always required
});
```

## shadcn Form Wiring

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} autoComplete="email" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit" disabled={form.formState.isSubmitting}>
      {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
    </Button>
  </form>
</Form>;
```

`{...field}` spreads `value`, `onChange`, `onBlur`, `name`, `ref` — never set `name` manually.

## Accessibility

- Always add `autoComplete` — `"email"`, `"current-password"`, `"new-password"`, `"off"`
- Always use `<FormLabel>` — renders `<label>` with correct `htmlFor`
- Always use `<FormControl>` — wires `aria-describedby` and `aria-invalid`
- `<FormMessage />` must be inside `<FormItem>`
- React uses `autoComplete` (camelCase) — NOT `autocomplete` (lowercase). Incorrect casing silently breaks browser autofill.

## Async Submit + Server Errors

```typescript
import { toast } from 'sonner';

const onSubmit = async (values: FormValues) => {
  try {
    await someApiCall(values);
    form.reset();
    toast.success('Done!');
  } catch (error) {
    // field-level: form.setError('email', { message: 'Email taken' })
    form.setError('root', { message: error instanceof Error ? error.message : 'Something went wrong' });
  }
};

// Display root error
{form.formState.errors.root && (
  <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
)}
```

## Rules

1. Schema defined **outside** component — never inside
2. Type via `z.infer<typeof schema>` — never manually
3. Always provide `defaultValues`
4. Always use `form.reset()` after success — not manual state clearing
5. Always use `form.setError()` for server validation errors
6. `form.formState.isSubmitting` for loading state
