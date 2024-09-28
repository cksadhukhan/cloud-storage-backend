import { Request, Response } from "express";
import { loginUser, registerUser } from "../services";
import { errorResponse, successResponse } from "../utils";
import { CreateUserInput } from "../models/user.schema";

export const register = async (req: Request, res: Response) => {
  const { email, password }: CreateUserInput = req.body;
  try {
    const user = await registerUser(email, password);
    // @ts-ignore
    delete user.password;
    return successResponse(res, user, "User registered successfully", 201);
  } catch (error) {
    return errorResponse(res, "User registration failed", 500, error);
  }
};

export const login = (req: Request, res: Response) => {
  try {
    const token = loginUser(req.user as any);
    return successResponse(res, { token }, "Login successful");
  } catch (error) {
    return errorResponse(res, "Login failed", 500, error);
  }
};
