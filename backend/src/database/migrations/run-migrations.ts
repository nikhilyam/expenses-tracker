import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { db } from '../../config/db.config.js';
import { logger } from '../../logger/pino.logger.js';

const schemaPath = fileURLToPath(new URL('../schema.sql', import.meta.url));
logger.info(`Running database migrations from ${schemaPath}`);
const statements = (await readFile(schemaPath, 'utf8')).split(';').map((statement) => statement.trim()).filter(Boolean);
for (const statement of statements) await db.query(statement);
logger.info('Database schema is ready');
await db.end();
