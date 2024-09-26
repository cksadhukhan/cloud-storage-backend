import { createHash } from "crypto";
import { createReadStream } from "fs";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const calculateFileHash = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filePath = join(UPLOAD_DIR, filename);
    const hash = createHash("md5"); // Create a hash object using the MD5 algorithm
    const input = createReadStream(filePath); // Create a readable stream for the file

    // This event fires whenever data (a chunk of the file) is read from the file.
    input.on("data", (chunk) => hash.update(chunk));

    // This event fires when the file reading has finished, so the hash can be finalized.
    input.on("end", () => resolve(hash.digest("hex"))); // Resolve the final hash value in hexadecimal format

    // This event fires if there's an error reading the file (e.g., file not found, permission issue).
    input.on("error", (err) => reject(err));
  });
};
