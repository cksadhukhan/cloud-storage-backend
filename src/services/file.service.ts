import { v4 as uuidv4 } from "uuid";
import { createReadStream, createWriteStream, unlink } from "fs";
import { join } from "path";
import { prisma } from "../prisma";
import { calculateFileHash } from "../utils";
import { checkPermission } from "./permission.service";
import { SearchFilesParams } from "../types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const uploadFile = async (
  userId: string,
  originalName: string,
  virtualPath: string,
  filename: string,
  description: string | null,
  type: string | null,
  size: number | null
) => {
  const existingFile = await prisma.file.findFirst({
    where: {
      userId,
      originalName,
      virtualPath,
    },
    include: { versions: true },
  });

  const hash = await calculateFileHash(filename);

  if (existingFile) {
    const newVersionNumber = existingFile.versions.length + 1;

    await prisma.fileVersion.create({
      data: {
        id: uuidv4(),
        fileId: existingFile.id,
        version: newVersionNumber,
        filename,
        hash,
      },
    });

    await prisma.file.update({
      where: { id: existingFile.id },
      data: {
        currenthash: hash,
        currentVersion: newVersionNumber,
        description,
        size,
        type,
      },
    });

    return existingFile;
  } else {
    const newFile = await prisma.file.create({
      data: {
        id: uuidv4(),
        originalName,
        virtualPath,
        userId,
        filename,
        description,
        size,
        type,
        currenthash: hash,
        currentVersion: 0,
        versions: {
          create: {
            id: uuidv4(),
            version: 0,
            filename,
            hash,
          },
        },
      },
    });

    return newFile;
  }
};

export const getAllFilesByUserId = async (userId: string) => {
  const files = await prisma.file.findMany({
    where: { userId },
    select: {
      id: true,
      originalName: true,
      filename: true,
    },
  });
  return files;
};

export const getFileById = async (fileId: string, userId: string) => {
  const file = await prisma.file.findFirst({
    where: { id: fileId },
    select: {
      id: true,
      originalName: true,
      virtualPath: true,
      filename: true,
      userId: true,
      currenthash: true,
      currentVersion: true,
      createdAt: true,
    },
  });

  if (!file) throw new Error("File not found");

  // Check permission for non-owners
  if (file.userId !== userId) {
    const hasReadPermission = await checkPermission(userId, fileId, "read");
    if (!hasReadPermission) {
      throw new Error("You don't have read permissions for this file");
    }
  }

  return file;
};

export const downloadLatestFile = async (
  fileId: string,
  userId: string,
  res: any
) => {
  const file = await prisma.file.findFirst({
    where: { id: fileId },
    select: { filename: true, userId: true },
  });

  if (!file) throw new Error("File not found");

  // Check permission for non-owners
  if (file.userId !== userId) {
    const hasReadPermission = await checkPermission(userId, fileId, "read");
    if (!hasReadPermission) {
      throw new Error("You don't have read permissions for this file");
    }
  }

  const filePath = join(UPLOAD_DIR, file.filename);
  const fileStream = createReadStream(filePath);

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file.filename}"`
  );
  fileStream.pipe(res);
};

export const getFileWithVersions = async (fileId: string, userId: string) => {
  const file = await prisma.file.findFirst({
    where: { id: fileId, userId },
    include: {
      versions: {
        select: {
          version: true,
          filename: true,
          hash: true,
          createdAt: true,
        },
      },
    },
  });

  if (!file) throw new Error("File not found or you don't have access");

  return file;
};

export const restoreFileVersion = async (
  fileId: string,
  versionNumber: number,
  userId: string
) => {
  const fileVersion = await prisma.fileVersion.findFirst({
    where: { fileId, File: { userId }, version: versionNumber },
  });

  if (!fileVersion)
    throw new Error("Version not found or you don't have access");

  await prisma.file.update({
    where: { id: fileVersion.fileId },
    data: {
      currenthash: fileVersion.hash,
      currentVersion: fileVersion.version,
      filename: fileVersion.filename,
    },
  });

  return fileVersion;
};

export const deleteFile = async (fileId: string, userId: string) => {
  const file = await prisma.file.findFirst({
    where: { id: fileId, userId },
    include: {
      versions: true,
    },
  });

  if (!file) throw new Error("File not found or you don't have access");

  // Delete all versions from disk and database
  for (const version of file.versions) {
    const filePath = join(UPLOAD_DIR, version.filename);
    // await unlink(filePath).catch(() => {}); // Ignore errors like file not found
  }

  // Delete file records from the database
  await prisma.file.delete({
    where: { id: fileId },
  });

  return { message: "File deleted successfully" };
};

export const downloadFileVersion = async (
  fileId: string,
  version: number,
  userId: string,
  res: any
) => {
  // Fetch the specific version of the file owned by the user
  const fileVersion = await prisma.fileVersion.findFirst({
    where: {
      fileId,
      File: {
        userId, // Ensure the file belongs to the authenticated user
      },
      version, // Match the requested version number
    },
    include: {
      File: {
        select: {
          filename: true, // We may need this for logging or validation
        },
      },
    },
  });

  if (!fileVersion) {
    throw new Error("File version not found or you don't have access");
  }

  // The file version exists, now prepare the file for download
  const filePath = join(UPLOAD_DIR, fileVersion.filename);

  // Stream the file to the response
  const fileStream = createReadStream(filePath);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileVersion.filename}"`
  );

  // Send the file as a stream to avoid large memory usage
  fileStream.pipe(res);
};

/**
 * Get groups of duplicate files for the authenticated user based on their hash.
 */
export const findDuplicateFilesForUser = async (userId: string) => {
  const duplicates = await prisma.file.groupBy({
    by: ["currenthash"],
    having: {
      currenthash: {
        _count: {
          gt: 1, // Only include files that have a hash count > 1 (duplicates)
        },
      },
    },
    where: {
      userId, // Filter by the authenticated user's ID
    },
    orderBy: {
      currenthash: "asc",
    },
  });

  const result = await Promise.all(
    duplicates.map(async (group) => {
      return await prisma.file.findMany({
        where: {
          currenthash: group.currenthash,
          userId, // Ensure only the user's files are fetched
        },
      });
    })
  );

  return result;
};

/**
 * Find duplicates of a specific file by its ID for the authenticated user.
 * @param id The file ID to search duplicates for
 * @param userId The authenticated user's ID
 */
export const findDuplicatesByFileIdForUser = async (
  id: string,
  userId: string
) => {
  const file = await prisma.file.findUnique({
    where: { id, userId }, // Ensure the file belongs to the authenticated user
  });

  if (!file) {
    throw new Error("File not found or you do not have access to this file");
  }

  const duplicates = await prisma.file.findMany({
    where: {
      currenthash: file.currenthash,
      userId,
      NOT: {
        id: file.id, // Exclude the file itself
      },
    },
  });

  return duplicates;
};

// Service for updating file description
export const updateFileDescription = async (
  fileId: string,
  description: string
) => {
  return await prisma.file.update({
    where: { id: fileId },
    data: { description },
  });
};

// Service for retrieving metadata
export const getFileMetadata = async (fileId: string) => {
  return await prisma.metadata.findMany({
    where: { fileId },
  });
};

// Service for adding metadata
export const addFileMetadata = async (
  fileId: string,
  key: string,
  value: string
) => {
  return await prisma.metadata.create({
    data: {
      id: uuidv4(),
      fileId,
      key,
      value,
    },
  });
};

// Service for updating metadata
export const updateFileMetadata = async (
  fileId: string,
  key: string,
  value: string
) => {
  return await prisma.metadata.update({
    where: { fileId_key: { fileId, key } },
    data: { value },
  });
};

// Service for deleting metadata
export const deleteFileMetadata = async (fileId: string, key: string) => {
  await prisma.metadata.delete({
    where: { fileId_key: { fileId, key } },
  });
};

export const searchFiles = async ({
  query,
  type,
  minSize,
  maxSize,
  startDate,
  endDate,
}: SearchFilesParams) => {
  try {
    const files = await prisma.file.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { originalName: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
          type ? { type: type } : {},
          minSize ? { size: { gte: parseInt(minSize) } } : {},
          maxSize ? { size: { lte: parseInt(maxSize) } } : {},
          startDate ? { createdAt: { gte: new Date(startDate) } } : {},
          endDate ? { createdAt: { lte: new Date(endDate) } } : {},
        ],
      },
    });

    return files;
  } catch (error) {
    throw new Error("Error searching for files");
  }
};
