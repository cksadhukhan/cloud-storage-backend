import { Request, Response } from "express";
import { logger, loginUser, registerUser } from "../services";
import { errorResponse, successResponse } from "../utils";
import { CreateUserInput } from "../models";
import { User } from "@prisma/client";

export const register = async (req: Request, res: Response) => {
  const { email, password }: CreateUserInput = req.body;
  try {
    const user = await registerUser(email, password);
    // @ts-ignore
    delete user.password;
    logger.info("User registered successfully", user.id);
    return successResponse(res, user, "User registered successfully", 201);
  } catch (error) {
    return errorResponse(res, "User registration failed", 500, error);
  }
};

export const login = (req: Request, res: Response) => {
  try {
    const token = loginUser(req.user as User);
    // @ts-ignore
    logger.info("Login successful", req.user?.id);
    return successResponse(res, { token }, "Login successful");
  } catch (error) {
    return errorResponse(res, "Login failed", 500, error);
  }
};
