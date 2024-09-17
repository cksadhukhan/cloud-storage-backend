export const successResponse = (
  res: any,
  data: any,
  message: string = "Success",
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: any,
  message: string = "Error",
  statusCode: number = 500,
  errors: any = {}
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const validationErrorResponse = (
  res: any,
  errors: any,
  message: string = "Validation Failed",
  statusCode: number = 422
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
