import { z } from 'zod'

// ─── Validation Schemas ───────────────────────────────────────────────────────

export const SignupSchema = z.object({
  displayName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email address.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .trim(),
  role: z.string().min(2, { message: 'Role must be at least 2 characters.' }).trim(),
})

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }).trim(),
  password: z.string().min(1, { message: 'Password is required.' }).trim(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type SignupInput = z.infer<typeof SignupSchema>
export type LoginInput = z.infer<typeof LoginSchema>

// ─── Server Action Form State Types ──────────────────────────────────────────

export type SignupFormState =
  | {
      errors?: {
        displayName?: string[]
        email?: string[]
        password?: string[]
        role?: string[]
      }
      message?: string
    }
  | undefined

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
