import { Router } from 'express';
import { authRateLimiter, aiRateLimiter } from '../middlewares/rateLimiter.js';
import {
  validate,
  authSchemas,
  profileSchemas,
  transactionSchemas,
  categorySchemas,
  budgetSchemas,
} from '../middlewares/validationMiddleware.js';

import * as authApiController from '../controllers/api/authApiController.js';
import * as profileApiController from '../controllers/api/profileApiController.js';
import * as dashboardApiController from '../controllers/api/dashboardApiController.js';
import * as transactionApiController from '../controllers/api/transactionApiController.js';
import * as categoryApiController from '../controllers/api/categoryApiController.js';
import * as budgetApiController from '../controllers/api/budgetApiController.js';
import * as reportApiController from '../controllers/api/reportApiController.js';
import * as adminApiController from '../controllers/api/adminApiController.js';

const router = Router();

// Middleware to check authentication for protected API endpoints
const requireApiAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Avtorizatsiyadan o'tilmagan. API dan foydalanish uchun tizimga kiring.",
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

// Middleware to check admin role for protected API endpoints
const requireApiAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Avtorizatsiyadan o'tilmagan. API dan foydalanish uchun tizimga kiring.",
      timestamp: new Date().toISOString(),
    });
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Ruxsat rad etildi. Ushbu API faqat Administratorlar uchun.",
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

/* ------------------------------------------------------ */
/* 1. Public Auth API Endpoints                           */
/* ------------------------------------------------------ */
router.post('/auth/login', authRateLimiter, validate({ body: authSchemas.login }), authApiController.apiLogin);
router.post('/auth/register', authRateLimiter, validate({ body: authSchemas.register }), authApiController.apiRegister);

/* ------------------------------------------------------ */
/* 2. Protected API Endpoints                             */
/* ------------------------------------------------------ */
router.use(requireApiAuth);

router.post('/auth/logout', authApiController.apiLogout);
router.get('/auth/me', authApiController.apiGetMe);

// Profile API
router.put('/profile', validate({ body: profileSchemas.update }), profileApiController.apiUpdateProfile);
router.put('/profile/password', validate({ body: profileSchemas.updatePassword }), profileApiController.apiUpdatePassword);

// Dashboard Summary API
router.get('/dashboard', dashboardApiController.apiGetDashboard);

// Transactions API (Full CRUD with Zod validation)
router.get('/transactions', transactionApiController.apiGetTransactions);
router.get('/transactions/:id', validate({ params: transactionSchemas.idParam }), transactionApiController.apiGetTransactionById);
router.post('/transactions', validate({ body: transactionSchemas.create }), transactionApiController.apiCreateTransaction);
router.put('/transactions/:id', validate({ params: transactionSchemas.idParam, body: transactionSchemas.update }), transactionApiController.apiUpdateTransaction);
router.delete('/transactions/:id', validate({ params: transactionSchemas.idParam }), transactionApiController.apiDeleteTransaction);

// Categories API (Full CRUD with Zod validation)
router.get('/categories', categoryApiController.apiGetCategories);
router.post('/categories', validate({ body: categorySchemas.create }), categoryApiController.apiCreateCategory);
router.put('/categories/:id', validate({ params: categorySchemas.idParam, body: categorySchemas.update }), categoryApiController.apiUpdateCategory);
router.delete('/categories/:id', validate({ params: categorySchemas.idParam }), categoryApiController.apiDeleteCategory);

// Budgets API
router.get('/budgets', budgetApiController.apiGetBudgets);
router.post('/budgets', validate({ body: budgetSchemas.create }), budgetApiController.apiCreateBudget);

// Reports & Financial Analytics API
router.get('/reports/summary', reportApiController.apiGetReportsSummary);

// Export & Backup API
router.get('/export/json', reportApiController.apiExportData);
router.get('/export/csv', transactionApiController.apiExportCsv);

// AI Insights API (Rate Limited)
router.get('/ai/insights', aiRateLimiter, reportApiController.apiGetAiInsights);

// Admin APIs (Protected by Auth + Admin Role)
router.get('/admin/stats', requireApiAdmin, adminApiController.apiAdminStats);
router.get('/admin/users', requireApiAdmin, adminApiController.apiAdminUsers);

export default router;
