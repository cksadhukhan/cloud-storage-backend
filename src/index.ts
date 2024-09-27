import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import "./middlewares";
import { errorHandler } from "./middlewares";
import { authRoutes, fileRoutes, profileRoutes } from "./routes";
import { swaggerOptions } from "./config";
import { logger, requestLogger } from "./services";
import { prometheusMetrics } from "./controllers";

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use(errorHandler);

app.use(requestLogger);

// Initialize swagger-jsdoc
logger.info("Initializing Swagger...");
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/files", fileRoutes);

app.get("/metrics", prometheusMetrics);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
