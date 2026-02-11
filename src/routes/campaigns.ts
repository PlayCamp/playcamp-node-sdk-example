import { Router, Request, Response } from 'express';
import { getSdk } from '../sdk.js';
import { handleError } from '../error-handler.js';
import { parsePositiveInt } from '../utils.js';

const router = Router();

// GET /api/campaigns - List campaigns
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parsePositiveInt(req.query.page as string, 1);
    const limit = parsePositiveInt(req.query.limit as string, 20);

    const result = await getSdk(req).campaigns.listCampaigns({ page, limit });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/campaigns/:id - Get campaign details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const campaign = await getSdk(req).campaigns.getCampaign(req.params.id);
    res.json({ success: true, data: campaign });
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/campaigns/:id/creators - Get campaign creators
router.get('/:id/creators', async (req: Request, res: Response) => {
  try {
    const creators = await getSdk(req).campaigns.getCreators(req.params.id);
    res.json({ success: true, data: creators });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
