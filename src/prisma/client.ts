import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

process.on("beforeExit", () => {
  prisma.$disconnect();
});

export default prisma;
