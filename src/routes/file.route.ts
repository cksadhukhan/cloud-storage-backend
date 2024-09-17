import { Request, Response } from "express";
import { Router } from "express";
import fs from "fs";
import path from "path";
import { upload } from "../utils";
import { authenticate } from "../middlewares";

const router = Router();

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    res.send("File uploaded successfully.");
  }
);

// Handle file download with streaming
router.get(":id/download", authenticate, (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "../../uploads", req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File not found");
    }

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

export default router;
