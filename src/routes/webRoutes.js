import { Router } from 'express';
import { requireAuth, requireGuest } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/adminMiddleware.js';
import { authRateLimiter, aiRateLimiter } from '../middlewares/rateLimiter.js';
import {
  validate,
  authSchemas,
  profileSchemas,
  transactionSchemas,
  categorySchemas,
  budgetSchemas,
} from '../middlewares/validationMiddleware.js';

import * as authController from '../controllers/authController.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as transactionController from '../controllers/transactionController.js';
import * as budgetController from '../controllers/budgetController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as aiAssistantController from '../controllers/aiAssistantController.js';
import * as reportController from '../controllers/reportController.js';
import * as profileController from '../controllers/profileController.js';
import * as adminController from '../controllers/adminController.js';

const router = Router();

// Guest Auth Routes (Rate Limited + Validated)
router.get('/login', requireGuest, authController.showLogin);
router.post(
  '/login',
  authRateLimiter,
  requireGuest,
  validate({ body: authSchemas.login }, { isApi: false }),
  authController.login
);

router.get('/register', requireGuest, authController.showRegister);
router.post(
  '/register',
  authRateLimiter,
  requireGuest,
  validate({ body: authSchemas.register }, { isApi: false }),
  authController.register
);

// STRICT AUTHENTICATION GUARD FOR ALL OTHER ROUTES
router.use(requireAuth);

// Authenticated System Routes
router.post('/logout', authController.logout);

router.get('/', (req, res) => res.redirect('/dashboard'));
router.get('/dashboard', dashboardController.index);

// Single Page Views
router.get('/targo', (req, res) => res.render('targo', { layout: false }));
router.get('/api-docs', (req, res) => res.render('apiDocs', { title: 'API HUJJATLAR' }));

// Admin Routes
router.get('/admin', requireAdmin, adminController.showAdminDashboard);

// Transactions Routes
router.get('/transactions/export', transactionController.exportCsv);
router.get('/transactions', transactionController.index);
router.post(
  '/transactions',
  validate({ body: transactionSchemas.create }, { isApi: false }),
  transactionController.store
);
router.post(
  '/transactions/:id/update',
  validate({ params: transactionSchemas.idParam, body: transactionSchemas.update }, { isApi: false }),
  transactionController.update
);
router.post(
  '/transactions/:id/delete',
  validate({ params: transactionSchemas.idParam }, { isApi: false }),
  transactionController.destroy
);

// Budgets Routes
router.get('/budgets', budgetController.index);
router.post(
  '/budgets',
  validate({ body: budgetSchemas.create }, { isApi: false }),
  budgetController.store
);
router.post(
  '/budgets/:id/update',
  validate({ params: budgetSchemas.idParam, body: budgetSchemas.update }, { isApi: false }),
  budgetController.update
);
router.post(
  '/budgets/:id/delete',
  validate({ params: budgetSchemas.idParam }, { isApi: false }),
  budgetController.destroy
);

// Categories Routes
router.get('/categories', categoryController.index);
router.post(
  '/categories',
  validate({ body: categorySchemas.create }, { isApi: false }),
  categoryController.store
);
router.post(
  '/categories/:id/update',
  validate({ params: categorySchemas.idParam, body: categorySchemas.update }, { isApi: false }),
  categoryController.update
);
router.post(
  '/categories/:id/delete',
  validate({ params: categorySchemas.idParam }, { isApi: false }),
  categoryController.destroy
);

// AI Assistant Route (Strict Rate Limiter)
router.get('/ai-assistant', aiRateLimiter, aiAssistantController.index);
router.get('/ai-assistant/stream', aiRateLimiter, aiAssistantController.streamAnalysis);

// Reports Route
router.get('/reports', reportController.index);

// Profile Routes
router.get('/profile', profileController.edit);
router.post(
  '/profile',
  validate({ body: profileSchemas.update }, { isApi: false }),
  profileController.update
);

export default router;
