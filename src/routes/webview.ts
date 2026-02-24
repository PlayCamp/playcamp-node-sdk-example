import { Router, Request, Response } from 'express';
import { getSdk } from '../sdk.js';
import { handleError } from '../error-handler.js';

const router = Router();

// POST /api/webview/token - Create WebView OTT token
router.post('/token', async (req: Request, res: Response) => {
  try {
    const { userId, campaignId, callbackId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required.',
      });
    }

    const result = await getSdk(req).webview.createOtt({
      userId,
      campaignId,
      callbackId,
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
