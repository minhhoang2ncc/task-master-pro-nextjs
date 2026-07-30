import { z } from "zod"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or fewer"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or fewer"),

  priority: z.enum(["Low", "Medium", "High"], {
    error: "Please select a valid priority",
  }),

  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (val) => dayjs(val, "YYYY-MM-DD", true).isValid(),
      "Please enter a valid date (YYYY-MM-DD)"
    )
    .refine(
      (val) => {
        const today = dayjs().format("YYYY-MM-DD")
        return val >= today
      },
      "Due date cannot be in the past"
    ),
})

export type TaskFormValues = z.infer<typeof taskSchema>
