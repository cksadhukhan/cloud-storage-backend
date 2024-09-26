import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    const timestamp = Date.now();
    const uniqueFilename = `${uuidv4()}${fileExtension}`;

    // @ts-ignore
    req.filename = uniqueFilename;

    cb(null, uniqueFilename);
  },
});

export const upload = multer({ storage });
