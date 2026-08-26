/**
 * Standardized API Response Helpers
 */

export const sendSuccess = (res, statusCode = 200, message = 'Muvaffaqiyatli bajarildi', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, statusCode = 500, message = 'Serverda xatolik yuz berdi', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};
