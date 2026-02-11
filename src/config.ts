import 'dotenv/config';

// Environment variables
export const config = {
  SERVER_API_KEY: process.env.SERVER_API_KEY || '',
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || '',
  SDK_ENVIRONMENT: process.env.SDK_ENVIRONMENT as 'sandbox' | 'live' | undefined,
  SDK_API_URL: process.env.SDK_API_URL,
  SDK_TEST_MODE: process.env.SDK_TEST_MODE === 'true',
  SDK_DEBUG: process.env.SDK_DEBUG === 'true',
  PORT: process.env.PORT || '4000',
};

// Validate required environment variables
export function validateConfig(): void {
  if (!config.SERVER_API_KEY || !config.WEBHOOK_SECRET) {
    console.error('Required environment variables not set.');
    console.error('   Required: SERVER_API_KEY, WEBHOOK_SECRET');
    console.error('   Optional: SDK_ENVIRONMENT (sandbox|live), SDK_API_URL, SDK_TEST_MODE');
    process.exit(1);
  }
}

// Get effective API URL for logging
export function getEffectiveApiUrl(): string {
  return config.SDK_API_URL || (config.SDK_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox-sdk-api.playcamp.io'
    : 'https://sdk-api.playcamp.io');
}
