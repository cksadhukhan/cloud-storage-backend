import { Request, Response } from "express";
import { Router } from "express";
import { upload } from "../utils";
import { authenticate, validateRequest } from "../middlewares";
import {
  grantPermissions,
  uploadFiles,
  getFile,
  downloadLatest,
} from "../controllers";
import {
  deleteFileById,
  downloadSpecificVersion,
  getAllFiles,
  getDuplicateFiles,
  getDuplicatesByFileId,
  getFileVersions,
  restoreFile,
} from "../controllers/file.controller";
import { fileUploadSchema, permissionSchema } from "../models/file.schema";

const router = Router();

/**
 * @swagger
 * /api/v1/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []  # Assuming you're using bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       400:
 *         description: Bad request - Invalid file
 */
router.post(
  "/upload",
  authenticate,
  validateRequest(fileUploadSchema),
  upload.single("file"),
  uploadFiles
);

/**
 * @swagger
 * /api/v1/files:
 *   get:
 *     summary: Get all files by the authenticated user
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of files returned successfully
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get("/", authenticate, getAllFiles);

/**
 * @swagger
 * /api/v1/files/{id}:
 *   get:
 *     summary: Get a specific file by its ID
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File data returned successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get("/:id", authenticate, getFile);

/**
 * @swagger
 * /api/v1/files/{id}/download:
 *   get:
 *     summary: Download the latest version of a file
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get("/:id/download", authenticate, downloadLatest);

/**
 * @swagger
 * /api/v1/files/{id}/versions:
 *   get:
 *     summary: Get all versions of a specific file
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of file versions returned successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get("/:id/versions", authenticate, getFileVersions);

/**
 * @swagger
 * /api/v1/files/{id}/restore/{versionNumber}:
 *   get:
 *     summary: Restore a specific version of a file
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: versionNumber
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File version restored successfully
 *       404:
 *         description: File or version not found
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get("/:id/restore/:versionNumber", authenticate, restoreFile);

/**
 * @swagger
 * /api/v1/files/{id}:
 *   delete:
 *     summary: Delete a file by its ID
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.delete("/:id", authenticate, deleteFileById);

/**
 * @swagger
 * /api/v1/files/{id}/download/{version}:
 *   get:
 *     summary: Download a specific version of a file
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: version
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Specific file version downloaded successfully
 *       404:
 *         description: File or version not found
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get("/:id/download/:version", authenticate, downloadSpecificVersion);

/**
 * @swagger
 * /api/v1/files/{id}/permissions:
 *   post:
 *     summary: Grant permissions to a user for a file
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the file to grant permissions for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to grant permissions to
 *               canRead:
 *                 type: boolean
 *               canWrite:
 *                 type: boolean
 *               canDelete:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Permissions granted successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/:id/permissions",
  authenticate,
  validateRequest(permissionSchema),
  grantPermissions
);

/**
 * @swagger
 * /api/v1/files/duplicates:
 *   get:
 *     summary: Get duplicate files based on hash
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of arrays of duplicate files.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the file.
 *                     originalName:
 *                       type: string
 *                       description: Original name of the file.
 *                     hash:
 *                       type: string
 *                       description: File hash for identifying duplicates.
 *       401:
 *         description: Unauthorized, invalid or expired token.
 */
router.get("/duplicates", authenticate, getDuplicateFiles);

/**
 * @swagger
 * /api/v1/files/{id}/duplicates:
 *   get:
 *     summary: Get duplicates of a specific file by file ID
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the file to find duplicates for
 *     responses:
 *       200:
 *         description: Returns an array of files that are duplicates of the provided file.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the file.
 *                   originalName:
 *                     type: string
 *                     description: Original name of the file.
 *                   hash:
 *                     type: string
 *                     description: File hash for identifying duplicates.
 *       401:
 *         description: Unauthorized, invalid or expired token.
 *       404:
 *         description: File not found or user does not have access.
 */
router.get("/:id/duplicates", authenticate, getDuplicatesByFileId);

export default router;
