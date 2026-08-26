import rateLimit from 'express-rate-limit';

// Rate limiter for authentication routes (login, register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Ko'p marotaba noto'g'ri urinish amalga oshirildi. Iltimos 15 daqiqadan so'ng qayta urinib ko'ring.",
    timestamp: new Date().toISOString(),
  },
});

// General Rate Limiter for REST API
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 API requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "API so'rovlar chegarasidan oshib ketdingiz. Iltimos bir oz kutib qayta urinib ko'ring.",
    timestamp: new Date().toISOString(),
  },
});

// Strict Rate Limiter for AI Assistant calls
export const aiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Max 10 requests per 5 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI maslahatchisiga juda ko'p so'rov yuborildi. 5 daqiqadan so'ng qayta so'rang.",
    timestamp: new Date().toISOString(),
  },
});
