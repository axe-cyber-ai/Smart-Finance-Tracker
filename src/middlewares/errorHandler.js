import { logger } from '../config/logger.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Centralized Error Handling Middleware for Express
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Serverda ichki xatolik yuz berdi.';

  logger.error({
    err,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  }, `[Error] ${err.message}`);

  // If request is an API request (JSON)
  if (req.originalUrl.startsWith('/api/')) {
    return sendError(res, err.statusCode, err.message, err.errors || null);
  }

  // If Web request (EJS View render or redirect)
  req.session.error = err.message;
  return res.status(err.statusCode).redirect('back');
};
