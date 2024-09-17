import { Request, Response } from "express";
import passport from "passport";
import { loginUser, registerUser } from "../services";
import { errorResponse, successResponse } from "../utils";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
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
  const token = loginUser(req.user as any);
  return successResponse(res, { token }, "Login successful");
};
