// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  return errorResponse(res, "Internal Server Error", 500, err.message);
};
