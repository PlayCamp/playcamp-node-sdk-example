import { Router } from 'express';
import campaignsRouter from './campaigns.js';
import creatorsRouter from './creators.js';
import couponsRouter from './coupons.js';
import sponsorsRouter from './sponsors.js';
import paymentsRouter from './payments.js';
import webhooksRouter, { createWebhookReceiverRouter } from './webhooks.js';

const apiRouter = Router();

// Mount API routes
apiRouter.use('/campaigns', campaignsRouter);
apiRouter.use('/creators', creatorsRouter);
apiRouter.use('/coupons', couponsRouter);
apiRouter.use('/sponsors', sponsorsRouter);
apiRouter.use('/payments', paymentsRouter);
apiRouter.use('/webhooks', webhooksRouter);

export { apiRouter, createWebhookReceiverRouter };
