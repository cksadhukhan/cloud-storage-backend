import { Request, Response } from "express";
import { register } from "../config";

export const prometheusMetrics = (req: Request, res: Response) => {
  res.setHeader("Content-Type", register.contentType);

  register.metrics().then((data) => res.status(200).send(data));
};
