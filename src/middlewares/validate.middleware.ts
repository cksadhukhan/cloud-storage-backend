import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { logger } from "../services";

// Middleware to validate Zod schemas and return custom error messages
export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // Parse and validate request body
      next(); // Proceed if validation passes
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        logger.error("Validation error:", { errors: formattedErrors });
        return res.status(400).json({
          status: "error",
          message: "Invalid input data",
          errors: formattedErrors,
        });
      }

      logger.error("Unexpected error during validation:", { error });
      return res.status(500).json({ message: "Internal server error" });
    }
  };
