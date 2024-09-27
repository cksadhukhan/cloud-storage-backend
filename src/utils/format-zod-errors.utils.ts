import { ZodError } from "zod";

// Utility function to format Zod errors
export const formatZodErrors = (error: ZodError) => {
  return error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
};
