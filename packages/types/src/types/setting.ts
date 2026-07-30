import { z } from 'zod';

// --- Zod Schema ---
export const NotificationSettingsSchema = z.object({
  browserNotifications: z.boolean(),
  emailNotifications: z.boolean(),
})

export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;

export type AppLanguage = 'English' | 'Vietnamese' | 'Japanese' | string

export interface LanguageSettings {
  language: AppLanguage
}
