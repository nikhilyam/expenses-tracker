import { app } from './app.js';
import { env } from './config/env.config.js';
import { logger } from './logger/pino.logger.js';
app.listen(env.PORT, () => logger.info({ port: env.PORT }, 'Expenses API listening'));
