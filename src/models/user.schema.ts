import { z } from "zod";

// Define Zod schema for user validation with custom error messages
export const createUserSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

// Infer the TypeScript type from the schema
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
