import { Router, Request, Response } from 'express';
import { getSdk } from '../sdk.js';
import { handleError } from '../error-handler.js';
import { parsePositiveInt } from '../utils.js';

const router = Router();

// POST /api/payments - Create payment
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      transactionId,
      productId,
      productName,
      amount,
      currency,
      platform,
      distributionType,
      purchasedAt,
    } = req.body;

    if (!userId || !transactionId || !productId || !amount || !currency || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Required fields are missing.',
      });
    }

    const payment = await getSdk(req).payments.create({
      userId,
      transactionId,
      productId,
      productName,
      amount,
      currency,
      platform,
      distributionType,
      purchasedAt: purchasedAt || new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/payments/:transactionId - Get payment
router.get('/:transactionId', async (req: Request, res: Response) => {
  try {
    const payment = await getSdk(req).payments.getByTransactionId(req.params.transactionId);
    res.json({ success: true, data: payment });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/payments/user/:userId - Get user payment history
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const page = parsePositiveInt(req.query.page as string, 1);
    const limit = parsePositiveInt(req.query.limit as string, 20);

    const result = await getSdk(req).payments.listByUser(req.params.userId, { page, limit });
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/payments/:transactionId/refund - Refund payment
router.post('/:transactionId/refund', async (req: Request, res: Response) => {
  try {
    const payment = await getSdk(req).payments.refund(req.params.transactionId);
    res.json({ success: true, data: payment });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
