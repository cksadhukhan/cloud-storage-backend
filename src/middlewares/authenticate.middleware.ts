import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils";

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
        return errorResponse(
          res,
          "An error occurred during authentication",
          500,
          err
        );
      }

      if (!user) {
        return errorResponse(
          res,
          "Unauthorized: Invalid token or token not provided",
          401,
          err
        );
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
