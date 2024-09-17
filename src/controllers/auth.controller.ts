import { Request, Response } from "express";
import passport from "passport";
import { loginUser, registerUser } from "../services";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await registerUser(email, password);
    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "User registration failed", error });
  }
};

export const login = (req: Request, res: Response) => {
  const token = loginUser(req.user as any);
  res.json({ token });
};

export const profile = (req: Request, res: Response) => {
  res.json({
    message: "You are accessing a protected route!",
    user: req.user,
  });
};
