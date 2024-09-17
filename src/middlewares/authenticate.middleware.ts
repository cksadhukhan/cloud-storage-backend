import passport from "passport";
import { Request, Response, NextFunction } from "express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({
          message: "An error occurred during authentication",
          error: err,
        });
      }

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized: Invalid token or token not provided",
        });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
