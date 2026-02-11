import { Router, Request, Response } from 'express';
import { verifyWebhook } from '@playcamp/node-sdk';
import { getSdk } from '../sdk.js';
import { handleError } from '../error-handler.js';
import { debugLog, parseId } from '../utils.js';
import { config } from '../config.js';
import type { RequestWithRawBody, ReceivedWebhook } from '../types.js';

const router = Router();

// Constants
const MAX_STORED_WEBHOOKS = 50;

// In-memory storage for received webhooks
const receivedWebhooks: ReceivedWebhook[] = [];

// ============================================
// Webhook Management API
// ============================================

// GET /api/webhooks - List webhooks
router.get('/', async (req: Request, res: Response) => {
  try {
    const webhooks = await getSdk(req).webhooks.listWebhooks();
    res.json({ success: true, data: webhooks });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/webhooks - Create webhook
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventType, url, retryCount, timeoutMs } = req.body;
    if (!eventType || !url) {
      return res.status(400).json({
        success: false,
        error: 'eventType and url are required.',
      });
    }

    const webhook = await getSdk(req).webhooks.create({
      eventType,
      url,
      retryCount,
      timeoutMs,
    });

    res.status(201).json({ success: true, data: webhook });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /api/webhooks/:id - Update webhook
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const webhookId = parseId(req.params.id);
    if (isNaN(webhookId)) {
      return res.status(400).json({ success: false, error: 'Valid webhook ID is required.' });
    }

    const { url, isActive, retryCount, timeoutMs } = req.body;

    const webhook = await getSdk(req).webhooks.update(webhookId, {
      url,
      isActive,
      retryCount,
      timeoutMs,
    });

    res.json({ success: true, data: webhook });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/webhooks/:id - Delete webhook
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const webhookId = parseId(req.params.id);
    if (isNaN(webhookId)) {
      return res.status(400).json({ success: false, error: 'Valid webhook ID is required.' });
    }

    await getSdk(req).webhooks.remove(webhookId);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/webhooks/:id/logs - Get webhook logs
router.get('/:id/logs', async (req: Request, res: Response) => {
  try {
    const webhookId = parseId(req.params.id);
    if (isNaN(webhookId)) {
      return res.status(400).json({ success: false, error: 'Valid webhook ID is required.' });
    }

    const logs = await getSdk(req).webhooks.getLogs(webhookId);
    res.json({ success: true, data: logs });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/webhooks/:id/test - Test webhook
router.post('/:id/test', async (req: Request, res: Response) => {
  try {
    const webhookId = parseId(req.params.id);
    if (isNaN(webhookId)) {
      return res.status(400).json({ success: false, error: 'Valid webhook ID is required.' });
    }

    const webhooks = await getSdk(req).webhooks.listWebhooks();
    const webhook = webhooks.find((w) => w.id === webhookId);

    const result = await getSdk(req).webhooks.test(webhookId);

    const samplePayload = webhook
      ? {
          events: [
            {
              event: webhook.eventType,
              timestamp: new Date().toISOString(),
              isTest: true,
              data: getSampleDataForEventType(webhook.eventType),
            },
          ],
        }
      : null;

    res.json({
      success: true,
      data: {
        ...result,
        webhook: webhook ? { id: webhook.id, eventType: webhook.eventType, url: webhook.url } : null,
        sentPayload: samplePayload,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/webhooks/simulate - Local webhook simulation
router.post('/simulate', (req: Request, res: Response) => {
  const { event, data } = req.body;

  if (!event) {
    return res.status(400).json({ success: false, error: 'event field is required.' });
  }

  const payload = {
    events: [{ event, timestamp: new Date().toISOString(), data: data || {} }],
  };

  debugLog(`\n[webhook] Webhook simulation: ${event}`);
  res.json({ success: true, payload });
});

// GET /api/webhooks/received - List received webhooks
router.get('/received', (_req: Request, res: Response) => {
  res.json({ success: true, data: receivedWebhooks });
});

// DELETE /api/webhooks/received - Clear received webhooks
router.delete('/received', (_req: Request, res: Response) => {
  receivedWebhooks.length = 0;
  res.status(204).send();
});

// ============================================
// Webhook Receiver (separate from API routes)
// ============================================

export function createWebhookReceiverRouter(): Router {
  const receiverRouter = Router();

  // POST /webhooks/playcamp - Webhook receiver endpoint
  receiverRouter.post('/playcamp', (req: Request, res: Response) => {
    const signature = req.headers['x-webhook-signature'] as string;
    const rawBody = (req as RequestWithRawBody).rawBody;
    const webhookId = `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    if (!signature) {
      debugLog('[webhook] No signature header');
      receivedWebhooks.unshift({
        id: webhookId,
        receivedAt: new Date().toISOString(),
        signature: '',
        valid: false,
        error: 'Missing signature header',
        events: [],
      });
      if (receivedWebhooks.length > MAX_STORED_WEBHOOKS) receivedWebhooks.pop();
      return res.status(401).json({ error: 'Missing signature' });
    }

    const result = verifyWebhook({
      payload: rawBody || '',
      signature,
      secret: config.WEBHOOK_SECRET,
    });

    if (!result.valid) {
      debugLog(`[webhook] Signature verification failed - ${result.error}`);
      receivedWebhooks.unshift({
        id: webhookId,
        receivedAt: new Date().toISOString(),
        signature: signature.slice(0, 16) + '...',
        valid: false,
        error: result.error,
        events: [],
      });
      if (receivedWebhooks.length > MAX_STORED_WEBHOOKS) receivedWebhooks.pop();
      return res.status(401).json({ error: result.error });
    }

    const payload = result.payload as unknown;
    const payloadObj = payload as Record<string, unknown> | null;
    const events: Array<Record<string, unknown>> = Array.isArray(payloadObj?.events)
      ? payloadObj.events
      : (payloadObj ? [payloadObj] : []);
    debugLog(`\n[webhook] Webhook received [${webhookId}]: ${events.length} event(s)`);

    receivedWebhooks.unshift({
      id: webhookId,
      receivedAt: new Date().toISOString(),
      signature: signature.slice(0, 16) + '...',
      valid: true,
      events: events.map((evt: Record<string, unknown>) => ({
        event: (evt?.event as string) || 'unknown',
        timestamp: (evt?.timestamp as string) || new Date().toISOString(),
        isTest: (evt?.isTest as boolean) || false,
        data: (evt?.data as Record<string, unknown>) || {},
      })),
    });
    if (receivedWebhooks.length > MAX_STORED_WEBHOOKS) receivedWebhooks.pop();

    for (const evt of events) {
      if (!evt?.event) continue;
      const eventType = evt.event as string;
      const timestamp = evt.timestamp as string;
      const data = (evt.data as Record<string, unknown>) || {};
      debugLog(`   [${eventType}] ${timestamp}`);

      switch (eventType) {
        case 'coupon.redeemed':
          debugLog(`   [coupon] Coupon: ${String(data.couponCode)} / User: ${String(data.userId)}`);
          break;
        case 'payment.created':
          debugLog(`   [payment] Payment: ${String(data.transactionId)} / ${String(data.amount)} ${String(data.currency)}`);
          break;
        case 'payment.refunded':
          debugLog(`   [payment] Refund: ${String(data.transactionId)}`);
          break;
        case 'sponsor.created':
          debugLog(`   [sponsor] Sponsor: ${String(data.userId)} -> ${String(data.creatorKey)}`);
          break;
        case 'sponsor.changed':
          debugLog(`   [sponsor] Changed: ${String(data.oldCreatorKey)} -> ${String(data.newCreatorKey)}`);
          break;
      }
    }

    res.status(200).json({ received: true, id: webhookId });
  });

  return receiverRouter;
}

// ============================================
// Helper Functions
// ============================================

function getSampleDataForEventType(eventType: string): Record<string, unknown> {
  switch (eventType) {
    case 'coupon.redeemed':
      return {
        couponCode: 'TEST-COUPON-CODE',
        userId: 'test-user-123',
        usageId: 1,
        reward: [
          {
            itemId: 'test-item-001',
            itemName: { ko: 'Test Item', en: 'Test Item' },
            itemQuantity: 1,
          },
        ],
      };
    case 'payment.created':
      return {
        transactionId: 'test-txn-123456',
        userId: 'test-user-123',
        amount: 10000,
        currency: 'KRW',
        creatorKey: 'test-creator-key',
        campaignId: 'test-campaign-id',
      };
    case 'payment.refunded':
      return {
        transactionId: 'test-txn-123456',
        userId: 'test-user-123',
      };
    case 'sponsor.created':
      return {
        userId: 'test-user-123',
        campaignId: 'test-campaign-id',
        creatorKey: 'test-creator-key',
      };
    case 'sponsor.changed':
      return {
        userId: 'test-user-123',
        campaignId: 'test-campaign-id',
        oldCreatorKey: 'old-creator-key',
        newCreatorKey: 'new-creator-key',
      };
    default:
      return { message: 'This is a test webhook' };
  }
}

export default router;
