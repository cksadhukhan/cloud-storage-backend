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

// Upload a file
export const uploadFiles = async (req: Request, res: Response) => {
  const { virtualPath = "/" } = req.body;
  const {
    // @ts-ignore
    user: { id: userId },
    // @ts-ignore
    filename,
  } = req;
  const originalName = req.file?.originalname || "";

  if (!req.file || !userId || !originalName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const file = await uploadFile(userId, originalName, virtualPath, filename);
    res.status(200).json({ message: "File uploaded successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
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
    res.status(200).json({ message: "Files fetched successfully", files });
  } catch (error) {
    res.status(500).json({ message: "Error fetching files", error });
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
    res.status(200).json({ message: "File fetched successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error fetching file", error });
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
    res.status(500).json({ message: "Error downloading file", error });
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
    res.status(500).json({ message: "Error downloading file version", error });
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
    res
      .status(200)
      .json({ message: "File versions fetched successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error fetching file versions", error });
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
    res
      .status(200)
      .json({ message: "File restored to the specified version", fileVersion });
  } catch (error) {
    res.status(500).json({ message: "Error restoring file", error });
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
    res.status(200).json({ message: "File deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error });
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

    res
      .status(200)
      .json({ message: "Permissions granted successfully", result });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error granting permissions", error: error.message });
  }
};
