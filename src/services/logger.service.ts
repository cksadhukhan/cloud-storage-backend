import { Request, Response, NextFunction } from "express";
import { createLogger, format, transports } from "winston";
import { join } from "path";
import LokiTransport from "winston-loki"; // Loki transport for Winston

const { combine, timestamp, printf, errors } = format;

// Custom format for logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

const LOG_DIR = join(process.cwd(), "logger/");

// Create a Winston logger
export const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: join(LOG_DIR, "logs/app.log"),
      level: "info",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
    }),
    new transports.File({
      filename: join(LOG_DIR, "logs/error.log"),
      level: "error",
    }),
    new LokiTransport({
      host: "http://localhost:3100", // Loki host, make sure it's reachable
      json: true, // Send logs in JSON format
      labels: { app: "node_app" }, // Add custom labels to the logs
      format: combine(timestamp(), logFormat),
      // Optional: Add retries, basicAuth, etc.
    }),
  ],
});

// If we're not in production, log to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

// Middleware to log HTTP requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now(); // Start time for request

  res.on("finish", () => {
    const duration = Date.now() - start; // Calculate request duration
    const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} [${duration} ms]`;

    if (res.statusCode >= 400) {
      logger.error(logMessage); // Log as error if status code >= 400
    } else {
      logger.info(logMessage); // Log as info otherwise
    }
  });

  next(); // Proceed to next middleware
};
