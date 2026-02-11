---
name: react-hook-form-zod
description: React Hook Form with Zod validation, shadcn/ui Form components, accessibility (autocomplete/name/labels), async submissions, and error handling patterns
---

## Architecture Overview

Forms in this project use a **schema-first** approach combining three layers:

1. **Zod** — defines the validation schema and infers TypeScript types
2. **react-hook-form** with `zodResolver` — manages form state, validation, submission, and error tracking
3. **shadcn/ui Form components** — renders accessible form fields with proper labels, error messages, and aria attributes

---

## Zod Schema Definitions

Define schemas at **module level** (outside the component). Use `z.infer` to derive the TypeScript type.

### Basic Validation

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
```

### Conditional Validation

Use `.refine()` or `.superRefine()` for cross-field validation:

```typescript
const authSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().optional(),
    mode: z.enum(['login', 'register']),
  })
  .refine(
    (data) => {
      if (data.mode === 'register') {
        return data.confirmPassword === data.password;
      }
      return true;
    },
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  );

type AuthFormValues = z.infer<typeof authSchema>;
```

### Custom Error Messages

```typescript
const todoSchema = z.object({
  content: z.string().min(1, 'Todo cannot be empty').max(200, 'Todo must be under 200 characters').trim(),
});

type TodoFormValues = z.infer<typeof todoSchema>;
```

---

## useForm + zodResolver Setup

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

// Inside your component:
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    username: '',
    password: '',
  },
});
```

**Key points:**

- `zodResolver` connects Zod validation to react-hook-form
- `defaultValues` is required for controlled inputs — always provide it
- The generic `<FormValues>` ensures full type safety on `form.handleSubmit`, `form.watch`, `form.setError`, etc.

---

## shadcn/ui Form Component Usage

The full rendering pattern uses `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, and `FormMessage`:

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    // handle submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="current-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </Form>
  );
}
```

### Component Hierarchy

Each form field follows this nesting structure:

```
Form (provider — spreads form methods into context)
  └── form (HTML <form> element with handleSubmit)
       └── FormField (connects a field name to react-hook-form's control)
            └── FormItem (wrapper <div> that provides field context)
                 ├── FormLabel (renders <label> with correct htmlFor)
                 ├── FormControl (connects aria-describedby and aria-invalid)
                 │    └── Input / Select / Textarea (the actual input)
                 ├── FormDescription (optional helper text)
                 └── FormMessage (validation error message)
```

---

## Accessibility & Browser Integration

### Critical Rules

1. **ALWAYS add `autoComplete`** to inputs — enables browser autofill and password managers:

   | Field Type       | autoComplete Value   |
   | ---------------- | -------------------- |
   | Username         | `"username"`         |
   | Email            | `"email"`            |
   | Current password | `"current-password"` |
   | New password     | `"new-password"`     |
   | Search / other   | `"off"`              |

2. **ALWAYS use `FormLabel`** — it renders a `<label>` element with the correct `htmlFor` attribute, automatically linked to the input via `FormItem` context.

3. **ALWAYS use `FormControl`** — it wraps the input and connects `aria-describedby` (pointing to `FormMessage` and `FormDescription`) and `aria-invalid` (set to `true` when the field has errors).

4. **`FormMessage` shows validation errors** with proper `aria-describedby` linkage — screen readers announce errors automatically.

5. **`name` attribute is automatic** — react-hook-form's `field` spread (`{...field}`) includes the `name` prop. Do not set it manually.

---

## Async Form Submission

```typescript
import { toast } from 'sonner';

const onSubmit = async (values: FormValues) => {
  try {
    const result = await someApiCall(values);
    if (result.success) {
      form.reset();
      toast.success('Success!');
    }
  } catch (error) {
    // Set a root-level error (not tied to a specific field)
    form.setError('root', {
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
    toast.error('Something went wrong');
  }
};
```

### Server-Side Field Errors

When the server returns field-specific validation errors (e.g., "username taken"):

```typescript
const onSubmit = async (values: FormValues) => {
  try {
    await registerUser(values);
    form.reset();
    toast.success('Account created!');
  } catch (error) {
    if (error instanceof Error && error.message.includes('username')) {
      form.setError('username', { message: 'Username is already taken' });
    } else {
      form.setError('root', { message: 'Registration failed' });
    }
  }
};
```

### Displaying Root Errors

```tsx
{
  form.formState.errors.root && <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>;
}
```

---

## Key Rules

1. **ALWAYS define Zod schema OUTSIDE the component** (module level) — avoids recreating the schema on every render.
2. **ALWAYS use `z.infer<typeof schema>`** for form types — NEVER manually define form value types.
3. **ALWAYS provide `defaultValues`** in `useForm` — required for controlled inputs to avoid React warnings.
4. **ALWAYS use shadcn Form components** for all form fields.
5. **ALWAYS add appropriate `autoComplete` attributes** — enables browser autofill and password managers.
6. **ALWAYS use `FormLabel`** for accessibility — provides proper `<label>` with `htmlFor` linkage.
7. **Use `form.reset()`** after successful submission — NOT manual state clearing.
8. **Use `form.setError()`** for server-side validation errors — supports both field-level and root-level errors.
9. **Use `form.formState.isSubmitting`** for loading states.
10. **Import `toast` from `'sonner'`** for success/error notifications — never create custom toast state.

---

## Quick Reference

| Task              | Code                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| Define schema     | `const schema = z.object({ field: z.string().min(1) })`                 |
| Infer types       | `type T = z.infer<typeof schema>`                                       |
| Create form       | `useForm<T>({ resolver: zodResolver(schema), defaultValues: { ... } })` |
| Submit handler    | `form.handleSubmit(async (values) => { ... })`                          |
| Loading state     | `form.formState.isSubmitting`                                           |
| Reset form        | `form.reset()`                                                          |
| Set field error   | `form.setError('fieldName', { message: '...' })`                        |
| Set root error    | `form.setError('root', { message: '...' })`                             |
| Watch field       | `form.watch('fieldName')`                                               |
| Check dirty       | `form.formState.isDirty`                                                |
| Check valid       | `form.formState.isValid`                                                |
| Disable on submit | `<Button disabled={form.formState.isSubmitting}>`                       |

---

## Troubleshooting

### Input not updating

**Problem:** Typing into an input doesn't show any text.

**Solution:** Make sure to spread `{...field}` on the `Input` component inside `FormControl`. The field spread includes `value`, `onChange`, `onBlur`, `name`, and `ref`.

```tsx
// ❌ Wrong — missing field spread
<FormControl>
  <Input />
</FormControl>

// ✅ Correct — spread field props
<FormControl>
  <Input {...field} autoComplete="username" />
</FormControl>
```

### Validation not triggering

**Problem:** Form submits without showing validation errors.

**Solution:** Ensure `zodResolver` is passed to `useForm`:

```typescript
// ❌ Wrong — no resolver
const form = useForm<FormValues>({ defaultValues: { ... } });

// ✅ Correct — zodResolver connects Zod validation
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... },
});
```

### Form not submitting

**Problem:** Clicking the submit button does nothing.

**Solution:** Ensure `form.handleSubmit` wraps your `onSubmit` function on the `<form>` element:

```tsx
// ❌ Wrong — onSubmit called directly
<form onSubmit={onSubmit}>

// ✅ Correct — handleSubmit validates before calling onSubmit
<form onSubmit={form.handleSubmit(onSubmit)}>
```

### autoComplete not working

**Problem:** Browser autofill doesn't trigger.

**Solution:** In React, the attribute is `autoComplete` (camelCase), not `autocomplete` (lowercase). Also ensure the form has appropriate `autoComplete` values:

```tsx
// ❌ Wrong — lowercase (HTML attribute, not React)
<Input {...field} autocomplete="username" />

// ✅ Correct — camelCase (React JSX)
<Input {...field} autoComplete="username" />
```

### FormMessage not showing errors

**Problem:** Validation fails but no error message appears.

**Solution:** Ensure `<FormMessage />` is inside `<FormItem>` and the field `name` matches the Zod schema key:

```tsx
// ❌ Wrong — FormMessage outside FormItem
<FormField name="username" render={({ field }) => (
  <FormItem>
    <FormControl><Input {...field} /></FormControl>
  </FormItem>
)} />
<FormMessage /> {/* Won't work here */}

// ✅ Correct — FormMessage inside FormItem
<FormField name="username" render={({ field }) => (
  <FormItem>
    <FormControl><Input {...field} /></FormControl>
    <FormMessage />
  </FormItem>
)} />
```
