import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const nativeFileSchema = z
  .instanceof(File, { message: "Please select a valid file." })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 5MB.",
  })
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Only .jpg, .png, and .pdf formats are supported.",
  });


