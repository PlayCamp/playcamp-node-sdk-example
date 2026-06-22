import { Router, Request, Response } from 'express';
import { getSdk } from '../sdk.js';
import { handleError } from '../error-handler.js';

const router = Router();

// POST /api/playtime-sessions - Report a single playtime session
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      userId,
      durationSeconds,
      startedAt,
      endedAt,
      campaignId,
      creatorKey,
      platform,
      metadata,
      callbackId,
      isTest,
    } = req.body;

    if (!sessionId || !userId || !durationSeconds || !startedAt || !endedAt) {
      return res.status(400).json({
        success: false,
        error: 'sessionId, userId, durationSeconds, startedAt, endedAt are required.',
      });
    }

    const session = await getSdk(req).playtimeSessions.create({
      sessionId,
      userId,
      durationSeconds,
      startedAt,
      endedAt,
      // Optional attribution overrides (added in SDK 0.0.8). When omitted the
      // server matches the sponsorship and defaults platform to 'Other'.
      campaignId,
      creatorKey,
      platform,
      metadata,
      callbackId,
      isTest,
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/playtime-sessions/bulk - Report playtime sessions in bulk (up to 1000)
router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const { sessions, callbackId, isTest } = req.body;

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'sessions array is required and must not be empty.',
      });
    }

    const result = await getSdk(req).playtimeSessions.createBulk({
      sessions,
      callbackId,
      isTest,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
