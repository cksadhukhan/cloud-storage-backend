import { v4 as uuidv4 } from "uuid";
import { prisma } from "../prisma";

export const grantPermission = async (
  ownerId: string, // the user attempting to grant permissions (should be the file owner)
  fileId: string,
  userId: string,
  canRead: boolean,
  canWrite: boolean,
  canDelete: boolean
) => {
  // Check if the user is the owner of the file
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userId: ownerId, // this ensures that the current user is the owner
    },
  });

  // If the user is not the owner, throw an error or deny the operation
  if (!file) {
    throw new Error("Only the owner can grant permissions.");
  }

  // Proceed to upsert the permissions if the owner check passes
  return prisma.filePermission.upsert({
    where: { fileId_userId: { fileId, userId } },
    create: { id: uuidv4(), fileId, userId, canRead, canWrite, canDelete },
    update: { canRead, canWrite, canDelete },
  });
};

// Check file permissions (read, write, delete)
// Check file permissions (read, write, delete)
export const checkPermission = async (
  userId: string,
  fileId: string,
  permissionType: "read" | "write" | "delete"
) => {
  // Check if the user is the owner of the file
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userId, // This checks if the user is the owner
    },
  });

  if (file) {
    // If the user is the owner, they have all permissions
    return true;
  }

  // If the user is not the owner, check permissions in the FilePermission table
  const permission = await prisma.filePermission.findFirst({
    where: {
      userId,
      fileId,
    },
  });

  if (!permission) return false;

  switch (permissionType) {
    case "read":
      return permission.canRead;
    case "write":
      return permission.canWrite;
    case "delete":
      return permission.canDelete;
    default:
      return false;
  }
};
