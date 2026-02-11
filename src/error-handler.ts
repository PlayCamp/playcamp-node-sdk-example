import type { Response } from 'express';
import { PlayCampApiError, PlayCampNotFoundError } from '@playcamp/node-sdk';
import { debugLog } from './utils.js';

export function handleError(res: Response, error: unknown): void {
  debugLog('[error] API Error:', error);

  if (error instanceof PlayCampNotFoundError) {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: error.message,
    });
    return;
  }

  if (error instanceof PlayCampApiError) {
    res.status(error.status).json({
      success: false,
      error: error.code,
      message: error.message,
      details: error.details,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: (error as Error).message,
  });
}
