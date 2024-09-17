import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils";

export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    delete req.user.password;
    return successResponse(res, req.user, "Profile data fetched successfully");
  } catch (error) {
    return errorResponse(null, "User registration failed", 500, error);
  }
};
