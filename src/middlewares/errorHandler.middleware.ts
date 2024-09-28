// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils";
import { logger } from "../services";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Internal Server Error", err);
  return errorResponse(res, "Internal Server Error", 500, err.message);
};
