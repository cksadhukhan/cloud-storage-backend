import { Request, Response } from "express";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { upload } from "../utils";
import { authenticate } from "../middlewares";
import { grantPermissions, uploadFiles } from "../controllers";

const router = Router();

/**
 * @swagger
 * /api/v1/file/upload:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - File
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
router.post("/upload", authenticate, upload.single("file"), uploadFiles);

/**
 * @swagger
 * /api/v1/file/permissions:
 *   post:
 *     summary: Grant permissions to a user for a file
 *     tags:
 *       - File
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: string
 *               userId:
 *                 type: string
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
router.post("/permissions", grantPermissions);

export default router;
