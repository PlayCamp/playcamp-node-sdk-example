import type { Request } from 'express';
import {
  PlayCampServer,
  type Environment,
  type PlayCampConfigInput,
} from '@playcamp/node-sdk';
import { config } from './config.js';

// Base SDK config
const baseConfig: PlayCampConfigInput = {
  debug: config.SDK_DEBUG,
};

if (config.SDK_API_URL) {
  baseConfig.baseUrl = config.SDK_API_URL;
} else if (config.SDK_ENVIRONMENT) {
  baseConfig.environment = config.SDK_ENVIRONMENT as Environment;
}

// SDK instances (normal and test mode)
const sdk = new PlayCampServer(config.SERVER_API_KEY, { ...baseConfig, isTest: false });
const sdkTest = new PlayCampServer(config.SERVER_API_KEY, { ...baseConfig, isTest: true });

/** Returns appropriate SDK instance based on request's isTest parameter */
export function getSdk(req: Request): PlayCampServer {
  const isTest = req.query.isTest === 'true' || req.body?.isTest === true;
  return isTest ? sdkTest : sdk;
}

export { sdk, sdkTest };
