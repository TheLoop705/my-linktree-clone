import { z } from "zod";

export const createLinkSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  url: z.string().url({ message: "Invalid URL format" }),
  pageId: z.string().uuid({ message: "Invalid Page ID" }),
  description: z
    .string()
    .max(255, { message: "Description cannot exceed 255 characters" })
    .optional(),
});

export const updateLinkSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" })
    .optional(),
  url: z.string().url({ message: "Invalid URL format" }).optional(),
  description: z
    .string()
    .max(255, { message: "Description cannot exceed 255 characters" })
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
  // position is typically handled by a separate reordering endpoint
});
