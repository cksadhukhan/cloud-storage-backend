import { z } from "zod";

export const fileUploadSchema = z.object({
  virtualPath: z.string().optional(),
});

export const permissionSchema = z.object({
  userId: z.string(),
  canRead: z.boolean().optional(),
  canWrite: z.boolean().optional(),
  canDelete: z.boolean().optional(),
});

// Infer the TypeScript type from the schema
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type PermissionInput = z.infer<typeof permissionSchema>;
