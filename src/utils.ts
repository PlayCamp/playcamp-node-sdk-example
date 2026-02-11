import { config } from './config.js';

/** Debug log (only outputs when SDK_DEBUG=true) */
export function debugLog(message: string, ...args: unknown[]): void {
  if (config.SDK_DEBUG) {
    console.log(message, ...args);
  }
}

/** Parse positive integer (returns default if invalid) */
export function parsePositiveInt(value: string | undefined, defaultValue: number, max = 100): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 1) return defaultValue;
  return Math.min(parsed, max);
}

/** Parse positive integer for ID (no max limit) */
export function parseId(value: string | undefined): number {
  if (!value) return NaN;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 1) return NaN;
  return parsed;
}
