import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils";
import { logger } from "../services";

export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    delete req.user.password;

    // @ts-ignore
    logger.info("Profile data fetched successfully", req.user?.id);
    return successResponse(res, req.user, "Profile data fetched successfully");
  } catch (error) {
    logger.error("Error fetching profile data", error);
    return errorResponse(null, "User registration failed", 500, error);
  }
};
