import { Response } from "express";

export const successResponse = (
  res: Response | null,
  data: any,
  message: string = "Success",
  statusCode: number = 200
) => {
  return res?.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response | null,
  message: string = "Error",
  statusCode: number = 500,
  errors: any = {}
) => {
  return res?.status(statusCode).json({
    success: false,
    message,
    errors: errors?.message ?? errors,
  });
};

export const validationErrorResponse = (
  res: Response | null,
  errors: any,
  message: string = "Validation Failed",
  statusCode: number = 422
) => {
  return res?.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
