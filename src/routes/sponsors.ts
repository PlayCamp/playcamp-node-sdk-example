import { Router, Request, Response } from 'express';
import { getSdk } from '../sdk.js';
import { handleError } from '../error-handler.js';
import { parsePositiveInt } from '../utils.js';

const router = Router();

// GET /api/sponsors/:userId - Get sponsor status
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const sponsors = await getSdk(req).sponsors.getByUser(req.params.userId);
    res.json({ success: true, data: sponsors });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/sponsors - Create sponsor
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, creatorKey, campaignId } = req.body;
    if (!userId || !creatorKey) {
      return res.status(400).json({
        success: false,
        error: 'userId and creatorKey are required.',
      });
    }

    const sponsor = await getSdk(req).sponsors.create({
      userId,
      creatorKey,
      campaignId,
    });

    res.status(201).json({ success: true, data: sponsor });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /api/sponsors/:userId - Update sponsor
router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const { campaignId, newCreatorKey } = req.body;
    if (!newCreatorKey) {
      return res.status(400).json({
        success: false,
        error: 'newCreatorKey is required.',
      });
    }

    const sponsor = await getSdk(req).sponsors.update(req.params.userId, {
      campaignId: campaignId || undefined,
      newCreatorKey,
    });

    res.json({ success: true, data: sponsor });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/sponsors/:userId - Delete sponsor
router.delete('/:userId', async (req: Request, res: Response) => {
  try {
    const campaignId = req.query.campaignId as string;
    await getSdk(req).sponsors.remove(req.params.userId, campaignId ? { campaignId } : undefined);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// GET /api/sponsors/:userId/history - Get sponsor change history
router.get('/:userId/history', async (req: Request, res: Response) => {
  try {
    const page = parsePositiveInt(req.query.page as string, 1);
    const limit = parsePositiveInt(req.query.limit as string, 20);
    const campaignId = req.query.campaignId as string;

    const result = await getSdk(req).sponsors.getHistory(req.params.userId, {
      campaignId,
      page,
      limit,
    });

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
