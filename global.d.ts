import { User } from "@prisma/client"; // Adjust the path if needed

declare global {
  namespace Express {
    interface Request {
      user?: User; // Make sure the type reflects the Prisma User model
    }
  }
}
