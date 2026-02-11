import { Router, Request, Response } from 'express';
import { getSdk } from '../sdk.js';
import { handleError } from '../error-handler.js';
import { parsePositiveInt } from '../utils.js';

const router = Router();

// GET /api/creators/search - Search creators
router.get('/search', async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        error: 'keyword parameter is required.',
      });
    }

    const creators = await getSdk(req).creators.search({
      keyword,
      limit: parsePositiveInt(req.query.limit as string, 20),
    });

    res.json({ success: true, data: creators });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/creators/:key - Get creator details
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const creator = await getSdk(req).creators.getCreator(req.params.key);
    res.json({ success: true, data: creator });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/creators/:key/coupons - Get creator coupons
router.get('/:key/coupons', async (req: Request, res: Response) => {
  try {
    const coupons = await getSdk(req).creators.getCoupons(req.params.key);
    res.json({ success: true, data: coupons });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
