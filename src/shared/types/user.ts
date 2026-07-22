import { z } from 'zod';

// --- Zod Schemas ---

export const UserSchema = z.object({
  id: z.string().optional(),
  displayName: z.string(), // Expect the snake_case from the database
  email: z.string().email(),
  role: z.string(),
})

export const UpdateUserPayloadSchema = z.object({
  id: z.string(),
  display_name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.string().optional(),
  browser_notifications: z.boolean().optional(),
  email_notifications: z.boolean().optional(),
  language_display: z.string().optional(),
}).transform((data) => ({
  id: data.id,
  displayName: data.display_name,
  email: data.email,
  role: data.role,
  browserNotifications: data.browser_notifications,
  emailNotifications: data.email_notifications,
  languageDisplay: data.language_display,
}));

// --- Inferred Types ---

export type User = z.infer<typeof UserSchema>;
export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;
