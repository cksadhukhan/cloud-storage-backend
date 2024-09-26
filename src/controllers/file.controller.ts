import { Request, Response } from "express";
import { grantPermission, uploadFile } from "../services";

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

  console.log("OriginalName ", originalName);
  console.log("userId ", userId);
  console.log("virtualPath ", virtualPath);
  console.log("filename ", filename);

  if (!req.file || !userId || !originalName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const file = await uploadFile(
      userId,
      originalName,
      virtualPath,
      filename
      // req.file.stream
    );
    res.status(200).json({ message: "File uploaded successfully", file });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
  }
};

// Grant permissions
export const grantPermissions = async (req: Request, res: Response) => {
  const { userId, fileId, canRead, canWrite, canDelete } = req.body;

  try {
    const result = await grantPermission(
      fileId,
      userId,
      canRead,
      canWrite,
      canDelete
    );
    res
      .status(200)
      .json({ message: "Permissions granted successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Error granting permissions", error });
  }
};
