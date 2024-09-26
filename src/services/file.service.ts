import { v4 as uuidv4 } from "uuid";
import { createWriteStream } from "fs";
import { join } from "path";
import { prisma } from "../prisma";
import { calculateFileHash } from "../utils";

const UPLOAD_DIR = "uploads";

export const uploadFile = async (
  userId: string,
  originalName: string,
  virtualPath: string,
  filename: string
) => {
  const existingFile = await prisma.file.findFirst({
    where: {
      userId,
      originalName,
      virtualPath,
    },
    include: { versions: true },
  });

  console.log("ExistingFile ", JSON.stringify(existingFile));

  const hash = await calculateFileHash(filename);
  console.log("Hash ", hash);

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
        currenthash: hash,
        currentVersion: 0,
        versions: {
          create: {
            id: uuidv4(),
            version: 0,
            filename: filename,
            hash,
          },
        },
      },
    });

    console.log("newFile ", JSON.stringify(newFile));

    return newFile;
  }
};

// Save file using streams
export const saveFile = async (
  filename: string,
  fileStream: NodeJS.ReadableStream
) => {
  const writeStream = createWriteStream(join(UPLOAD_DIR, filename));
  fileStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
};

// Check file permissions (read, write, delete)
export const checkPermission = async (
  userId: string,
  fileId: string,
  permissionType: "read" | "write" | "delete"
) => {
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

// Grant permissions to a user
export const grantPermission = async (
  fileId: string,
  userId: string,
  canRead: boolean,
  canWrite: boolean,
  canDelete: boolean
) => {
  return prisma.filePermission.upsert({
    where: { fileId_userId: { fileId, userId } },
    create: { id: uuidv4(), fileId, userId, canRead, canWrite, canDelete },
    update: { canRead, canWrite, canDelete },
  });
};
