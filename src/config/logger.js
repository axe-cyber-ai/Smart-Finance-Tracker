import pino from 'pino';
import { config } from './index.js';

export const logger = pino({
  level: config.APP_ENV === 'production' ? 'info' : 'debug',
  transport:
    config.APP_ENV !== 'production'
      ? {
          target: 'pino/file',
          options: { destination: 1 }, // stdout
        }
      : undefined,
  base: {
    env: config.APP_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
