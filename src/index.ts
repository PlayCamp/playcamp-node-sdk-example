import { config, validateConfig, getEffectiveApiUrl } from './config.js';
import { app } from './app.js';
import { parsePositiveInt } from './utils.js';

// Validate required environment variables
validateConfig();

// Start server
const port = parsePositiveInt(config.PORT, 4000, 65535);

app.listen(port, () => {
  const debugStatus = config.SDK_DEBUG ? 'Debug: ON' : 'Debug: OFF';
  const testStatus = config.SDK_TEST_MODE ? 'Test Mode: ON' : 'Test Mode: OFF';
  const effectiveApiUrl = getEffectiveApiUrl();
  const envInfo = config.SDK_API_URL
    ? `Custom: ${effectiveApiUrl}`
    : `Environment: ${config.SDK_ENVIRONMENT || 'live'}`;

  console.log(`
╔═══════════════════════════════════════════════════╗
║     PlayCamp SDK Example Server                   ║
╠═══════════════════════════════════════════════════╣
║  Server: http://localhost:${port}
║  SDK API: ${effectiveApiUrl}
║  ${envInfo}
║  ${debugStatus} | ${testStatus}
╚═══════════════════════════════════════════════════╝

📋 API Endpoints:

[Campaigns]
   GET  /api/campaigns              - List campaigns
   GET  /api/campaigns/:id          - Get campaign
   GET  /api/campaigns/:id/creators - Get campaign creators

[Creators]
   GET  /api/creators/search        - Search creators
   GET  /api/creators/:key          - Get creator
   GET  /api/creators/:key/coupons  - Get creator coupons

[Coupons]
   POST /api/coupons/validate       - Validate coupon
   POST /api/coupons/redeem         - Redeem coupon
   GET  /api/coupons/user/:userId   - Get user coupon history

[Sponsors]
   GET  /api/sponsors/:userId          - Get sponsor
   POST /api/sponsors                  - Create sponsor
   PUT  /api/sponsors/:userId          - Update sponsor
   DELETE /api/sponsors/:userId        - Delete sponsor
   GET  /api/sponsors/:userId/history  - Get sponsor history

[Payments]
   POST /api/payments                    - Create payment
   POST /api/payments/bulk               - Create bulk payments
   GET  /api/payments/:txnId             - Get payment
   GET  /api/payments/user/:userId       - Get user payments
   POST /api/payments/:txnId/refund      - Refund payment

[Webhooks]
   GET  /api/webhooks             - List webhooks
   POST /api/webhooks             - Create webhook
   PUT  /api/webhooks/:id         - Update webhook
   DELETE /api/webhooks/:id       - Delete webhook
   GET  /api/webhooks/:id/logs    - Get webhook logs
   POST /api/webhooks/:id/test    - Test webhook

[Webhook Receiver]
   POST /webhooks/playcamp        - Receive webhooks
   GET  /api/webhooks/received    - Get received webhooks
   DELETE /api/webhooks/received  - Clear received webhooks
   POST /api/webhooks/simulate    - Simulate webhook
  `);
});
