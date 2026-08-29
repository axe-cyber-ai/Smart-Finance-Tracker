import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  APP_NAME: z.string().default('Smart Finance Tracker'),
  APP_ENV: z.enum(['local', 'development', 'staging', 'production']).default('local'),
  APP_URL: z.string().url().optional().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgresql://postgres:password@localhost:5432/smart_finance_db'),
  SESSION_SECRET: z.string().default('smart_finance_tracker_production_secret_key_2026'),
  SERVICES_AI_SECRET: z.string().optional().default(''),
  SERVICES_AI_MODEL: z.string().default('gpt-4o-mini'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables configuration:", _env.error.format());
  process.exit(1);
}

export const config = Object.freeze(_env.data);
