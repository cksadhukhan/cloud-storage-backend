import { PrismaClient } from "@prisma/client";
import { logger } from "../services";

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    logger.info("Database Connected!");
  })
  .catch((error) => {
    logger.error("Error connecting to the database:", error);
  });

process.on("beforeExit", () => {
  prisma.$disconnect();
});

export default prisma;
