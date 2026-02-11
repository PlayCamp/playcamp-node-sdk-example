import type { Request } from 'express';

/** Request type with raw body */
export interface RequestWithRawBody extends Request {
  rawBody?: string;
}

/** Received webhook data */
export interface ReceivedWebhook {
  id: string;
  receivedAt: string;
  signature: string;
  valid: boolean;
  error?: string;
  events: Array<{
    event: string;
    timestamp: string;
    isTest?: boolean;
    data: Record<string, unknown>;
  }>;
}
