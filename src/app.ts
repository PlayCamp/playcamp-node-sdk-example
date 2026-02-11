import express, { Request } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter, createWebhookReceiverRouter } from './routes/index.js';
import type { RequestWithRawBody } from './types.js';

const app = express();

// JSON parsing with raw body preservation for webhook verification
app.use(
  express.json({
    verify: (req: Request, _res, buf) => {
      (req as RequestWithRawBody).rawBody = buf.toString();
    },
  })
);

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../public')));

// Mount routes
app.use('/api', apiRouter);
app.use('/webhooks', createWebhookReceiverRouter());

export { app };
