import path from "path";
import multer from "multer";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    const timestamp = Date.now();
    const uniqueFilename = `${baseName}-${timestamp}${fileExtension}`;
    cb(null, uniqueFilename);
  },
});

export const upload = multer({ storage });
