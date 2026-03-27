export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = 'Server Error', statusCode = 500, error = null) => {
  if (error) console.error('Error Details:', error);
  return res.status(statusCode).json({
    success: false,
    message,
    error: error ? error.message || error : null,
  });
};

export const validationError = (res, message = 'Validation Failed', errors = null) => {
  return res.status(400).json({
    success: false,
    message,
    errors,
  });
};

export const notFound = (res, message = 'Resource Not Found') => {
  return res.status(404).json({
    success: false,
    message,
  });
};
