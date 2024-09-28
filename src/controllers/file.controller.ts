import { Request, Response } from "express";
import {
  uploadFile,
  getAllFilesByUserId,
  grantPermission,
  getFileById,
  deleteFile,
  downloadLatestFile,
  getFileWithVersions,
  restoreFileVersion,
  downloadFileVersion,
} from "../services";
import { errorResponse, successResponse } from "../utils";

// Upload a file
export const uploadFiles = async (req: Request, res: Response) => {
  const { virtualPath = "/" } = req.body;
  const {
    // @ts-ignore
    user: { id: userId },
    // @ts-ignore
    filename,
  } = req;

  const originalName = req.file?.originalname || filename;

  if (!req.file || !userId || !originalName) {
    return errorResponse(res, "Missing required fields", 400);
  }

  try {
    const file = await uploadFile(userId, originalName, virtualPath, filename);
    return successResponse(res, file, "File uploaded successfully");
  } catch (error) {
    return errorResponse(res, "Error uploading file", 500, error);
  }
};

// Get all files by user
export const getAllFiles = async (req: Request, res: Response) => {
  const {
    // @ts-ignore
    user: { id: userId },
  } = req;

  try {
    const files = await getAllFilesByUserId(userId);
    return successResponse(res, files, "Files fetched successfully");
  } catch (error) {
    return errorResponse(res, "Error fetching files", 500, error);
  }
};

// Get file by ID
export const getFile = async (req: Request, res: Response) => {
  const { id: fileId } = req.params;
  const {
    // @ts-ignore
    user: { id: userId },
  } = req;

  try {
    const file = await getFileById(fileId, userId);
    return successResponse(res, file, "File fetched successfully");
  } catch (error) {
    return errorResponse(res, "Error fetching files", 500, error);
  }
};

// Download latest version of a file
export const downloadLatest = async (req: Request, res: Response) => {
  const { id: fileId } = req.params;
  const {
    // @ts-ignore
    user: { id: userId },
  } = req;

  try {
    await downloadLatestFile(fileId, userId, res);
  } catch (error) {
    return errorResponse(res, "Error downloading file", 500, error);
  }
};

// Download a specific file version
export const downloadSpecificVersion = async (req: Request, res: Response) => {
  const { id: fileId, version } = req.params;
  const {
    // @ts-ignore
    user: { id: userId },
  } = req;

  try {
    await downloadFileVersion(fileId, parseInt(version), userId, res);
  } catch (error) {
    return errorResponse(res, "Error downloading file version", 500, error);
  }
};

// Get file versions
export const getFileVersions = async (req: Request, res: Response) => {
  const { id: fileId } = req.params;
  const {
    // @ts-ignore
    user: { id: userId },
  } = req;

  try {
    const file = await getFileWithVersions(fileId, userId);
    return successResponse(res, file, "File versions fetched successfully");
  } catch (error) {
    return errorResponse(res, "Error fetching file versions", 500, error);
  }
};

// Restore file to a specific version
export const restoreFile = async (req: Request, res: Response) => {
  const { id: fileId, versionNumber } = req.params;
  const {
    // @ts-ignore
    user: { id: userId },
  } = req;

  try {
    const fileVersion = await restoreFileVersion(
      fileId,
      parseInt(versionNumber),
      userId
    );
    return successResponse(
      res,
      fileVersion,
      "File restored to the specified version"
    );
  } catch (error) {
    return errorResponse(res, "Error restoring file", 500, error);
  }
};

// Delete a file
export const deleteFileById = async (req: Request, res: Response) => {
  const { id: fileId } = req.params;
  const {
    // @ts-ignore
    user: { id: userId },
  } = req;

  try {
    const result = await deleteFile(fileId, userId);
    return successResponse(res, result, "File deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting file", 500, error);
  }
};

// Grant permissions controller
export const grantPermissions = async (req: Request, res: Response) => {
  const { id: fileId } = req.params; // Extract fileId from URL parameters
  const { userId, canRead, canWrite, canDelete } = req.body;

  // @ts-ignore
  const ownerId = req.user.id; // Owner ID extracted from the authenticated user

  try {
    // Ensure the authenticated user is the file owner before granting permissions
    const result = await grantPermission(
      ownerId, // Owner's userId (ensures only the owner can grant permissions)
      fileId, // File ID from params
      userId,
      canRead,
      canWrite,
      canDelete
    );

    return successResponse(res, result, "Permissions granted successfully");
  } catch (error: any) {
    return errorResponse(res, "Error granting permissions", 500, error);
  }
};
