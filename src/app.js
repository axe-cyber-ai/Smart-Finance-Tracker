import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { fileURLToPath } from 'url';

import { config } from './config/index.js';
import { logger } from './config/logger.js';
import webRoutes from './routes/webRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import { csrfProtection } from './middlewares/csrfMiddleware.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();

// Trust reverse proxy (Nginx/Host) for secure cookies & accurate IP rate limiting
app.set('trust proxy', true);

// Pino HTTP Request Logging Middleware
app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url.startsWith('/resources') || req.url.startsWith('/favicon'),
    },
  })
);

// Security HTTP Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled CSP to avoid breaking inline scripts & CDN resources in EJS views
    crossOriginEmbedderPolicy: false,
  })
);

// View Engine Setup (EJS + Express Layouts)
app.set('views', path.join(projectRoot, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Body Parsers & Static Directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(projectRoot, 'public')));
app.use('/resources', express.static(path.join(projectRoot, 'resources')));

// Express Session Setup with Prisma Database Store (persistent across restarts)
const prismaClient = new PrismaClient();
const isCookieSecure = process.env.COOKIE_SECURE === 'true' ? true : (process.env.COOKIE_SECURE === 'false' ? false : 'auto');

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isCookieSecure,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: new PrismaSessionStore(prismaClient, {
      checkPeriod: 2 * 60 * 1000, // cleanup expired sessions every 2 min
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// Session CSRF Token Initialization & Middleware
app.use(csrfProtection);

// Global Middleware for Flash Messages and EJS Locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  res.locals.req = req;

  delete req.session.success;
  delete req.session.error;
  next();
});

// Health-check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.APP_ENV,
  });
});

// REST API v1 Routes (with API Rate Limiter)
app.use('/api/v1', apiRateLimiter, apiRoutes);

// App Web Routes (Strict Auth Protected)
app.use('/', webRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`🚀 Smart Finance Tracker Node.js Server running on http://localhost:${PORT}`);
});
