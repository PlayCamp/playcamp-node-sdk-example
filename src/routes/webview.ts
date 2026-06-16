import { Router, Request, Response } from 'express';
import { getSdk } from '../sdk.js';
import { getEffectiveApiUrl } from '../config.js';
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

    // Build the full webview URL from the configured SDK API host so it works
    // regardless of SDK_API_URL (local, sandbox, live, custom).
    const base = getEffectiveApiUrl().replace(/\/$/, '');
    let webviewUrl = `${base}/webview/?ott=${encodeURIComponent(result.ott)}`;
    if (campaignId) webviewUrl += '&tabs=sponsor,coupon';

    res.status(201).json({ success: true, data: result, webviewUrl });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
