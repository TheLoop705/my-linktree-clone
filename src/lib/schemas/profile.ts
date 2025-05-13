import * as z from "zod";

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, { message: "Display name cannot be empty" })
    .max(50, { message: "Display name cannot exceed 50 characters" })
    .optional(),
  bio: z
    .string()
    .max(200, { message: "Bio cannot exceed 200 characters" })
    .optional(),
  // We can add other UserProfile fields here later, e.g.:
  // profileImageUrl: z.string().url({ message: "Invalid URL" }).optional(),
  // profession: z.string().max(50).optional(),
  // location: z.string().max(50).optional(),
  // websiteUrl: z.string().url({ message: "Invalid URL" }).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changeEmailSchema = z.object({
  newEmail: z.string().email({ message: "Invalid email address" }),
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }), // To confirm identity
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"], // Path to field that gets the error
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
