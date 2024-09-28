import { Request, Response } from "express";
import { Router } from "express";
import { upload } from "../utils";
import { authenticate, validateRequest } from "../middlewares";
import {
  grantPermissions,
  uploadFiles,
  getFile,
  downloadLatest,
  deleteFileById,
  downloadSpecificVersion,
  getAllFiles,
  getDuplicateFiles,
  getDuplicatesByFileId,
  getFileVersions,
  restoreFile,
  updateFile,
  getMetadata,
  addMetadata,
  updateMetadata,
  deleteMetadata,
  searchFiles,
} from "../controllers";
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
 * /api/v1/files/{id}:
 *   put:
 *     summary: Update file information
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
 *         description: ID of the file to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Updated description of the file
 *     responses:
 *       200:
 *         description: File updated successfully
 *       404:
 *         description: File not found
 *       400:
 *         description: Bad request
 */
router.put("/:id", authenticate, updateFile);

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

/**
 * @swagger
 * /api/v1/files/{id}/metadata:
 *   get:
 *     summary: Get metadata for a file
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
 *         description: ID of the file to retrieve metadata for
 *     responses:
 *       200:
 *         description: Metadata retrieved successfully
 *       404:
 *         description: File not found
 */
router.get("/:id/metadata", authenticate, getMetadata);

/**
 * @swagger
 * /api/v1/files/{id}/metadata:
 *   post:
 *     summary: Add metadata to a file
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
 *         description: ID of the file to add metadata for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: Metadata key
 *               value:
 *                 type: string
 *                 description: Metadata value
 *     responses:
 *       200:
 *         description: Metadata added successfully
 *       404:
 *         description: File not found
 */
router.post("/:id/metadata", authenticate, addMetadata);

/**
 * @swagger
 * /api/v1/files/{id}/metadata:
 *   put:
 *     summary: Update metadata for a file
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
 *         description: ID of the file to update metadata for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: Metadata key
 *               value:
 *                 type: string
 *                 description: Metadata value
 *     responses:
 *       200:
 *         description: Metadata updated successfully
 *       404:
 *         description: File or metadata not found
 */
router.put("/:id/metadata", authenticate, updateMetadata);

/**
 * @swagger
 * /api/v1/files/{id}/metadata:
 *   delete:
 *     summary: Delete metadata for a file
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
 *         description: ID of the file to delete metadata for
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Metadata key to delete
 *     responses:
 *       200:
 *         description: Metadata deleted successfully
 *       404:
 *         description: File or metadata not found
 */
router.delete("/:id/metadata", authenticate, deleteMetadata);

/**
 * @swagger
 * /api/v1/files/search:
 *   get:
 *     summary: Search for files based on query parameters
 *     tags:
 *       - [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: false
 *         schema:
 *           type: string
 *           description: Search query for file names or descriptions
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           description: Filter files by type (e.g., image, document, etc.)
 *       - in: query
 *         name: minSize
 *         required: false
 *         schema:
 *           type: integer
 *           description: Minimum file size in bytes
 *       - in: query
 *         name: maxSize
 *         required: false
 *         schema:
 *           type: integer
 *           description: Maximum file size in bytes
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter files created after this date
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter files created before this date
 *     responses:
 *       200:
 *         description: Files found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   originalName:
 *                     type: string
 *                   size:
 *                     type: integer
 *                   type:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   description:
 *                     type: string
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.get(
  "/search",
  authenticate,
  // validateRequest(fileSearchSchema),
  searchFiles // Controller to handle file search
);

export default router;
