import { Router, Request, Response } from 'express';
import { getSdk } from '../sdk.js';
import { handleError } from '../error-handler.js';
import { parsePositiveInt } from '../utils.js';

const router = Router();

// POST /api/coupons/validate - Validate coupon
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { couponCode, userId } = req.body;
    if (!couponCode) {
      return res.status(400).json({
        success: false,
        error: 'couponCode is required.',
      });
    }

    const validation = await getSdk(req).coupons.validate({
      couponCode,
      userId: userId || 'anonymous',
    });
    res.json({ success: true, data: validation });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/coupons/redeem - Redeem coupon
router.post('/redeem', async (req: Request, res: Response) => {
  try {
    const { couponCode, userId } = req.body;
    if (!couponCode || !userId) {
      return res.status(400).json({
        success: false,
        error: 'couponCode and userId are required.',
      });
    }

    const result = await getSdk(req).coupons.redeem({ couponCode, userId });
    res.json({ success: true, data: result });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/coupons/user/:userId - Get user coupon usage history
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const page = parsePositiveInt(req.query.page as string, 1);
    const limit = parsePositiveInt(req.query.limit as string, 20);

    const result = await getSdk(req).coupons.getUserHistory(req.params.userId, { page, limit });
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
