import { Request, Response } from "express";

export const getProfile = async (req: Request, res: Response) => {
  try {
    return res.json({
      message: "Successfully fetched profile",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: "User registration failed", error });
  }
};
