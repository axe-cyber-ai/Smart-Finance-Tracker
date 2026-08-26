import crypto from 'crypto';

/**
 * Custom Session-Based CSRF Middleware for Web routes (EJS forms)
 */
export const csrfProtection = (req, res, next) => {
  // Ensure session has a CSRF secret/token
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  // Make token available to EJS views via res.locals
  res.locals.csrfToken = req.session.csrfToken;

  // State-changing HTTP methods require validation
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Exempt REST API routes from Web Session CSRF (API routes use Authorization/Headers or session API guards)
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const clientToken = req.body._csrf || req.headers['x-csrf-token'] || req.query._csrf;

  if (!clientToken || clientToken !== req.session.csrfToken) {
    console.warn(`[CSRF Warning] Invalid or missing CSRF token from IP: ${req.ip}`);
    req.session.error = "Xavfsizlik kaliti (CSRF token) mos kelmadi yoki eskirgan. Qayta urinib ko'ring.";
    return res.status(403).redirect('back');
  }

  next();
};
