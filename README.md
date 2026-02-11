# PlayCamp SDK Example Server

An example server for testing all PlayCamp SDK features.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env` file and set the following variables:

```bash
# Required
SERVER_API_KEY=your_server_key:your_secret
WEBHOOK_SECRET=your_webhook_secret

# SDK Environment (choose one)
SDK_ENVIRONMENT=sandbox    # 'sandbox' or 'live'
# SDK_API_URL=http://localhost:3003  # Custom URL (takes precedence over environment)

# Options
SDK_TEST_MODE=false        # Enable test mode
SDK_DEBUG=true             # Enable debug logging
PORT=4000                  # Server port
```

### 3. Run Server

```bash
# Development mode (auto-restart on file changes)
npm run dev

# Normal execution
npm start
```

### 4. Access Web UI

Open `http://localhost:4000` in your browser

---

## Environment Configuration

### SDK Environment

| Environment | URL | Purpose |
|-------------|-----|---------|
| `sandbox` | https://sandbox-sdk-api.playcamp.io | Development/Testing |
| `live` | https://sdk-api.playcamp.io | Production |

```bash
# Sandbox environment
SDK_ENVIRONMENT=sandbox

# Live environment (default)
SDK_ENVIRONMENT=live

# Custom URL (local development, etc.)
SDK_API_URL=http://localhost:3003
```

### Test Mode

When `SDK_TEST_MODE=true` is set, all API requests include the `isTest=true` parameter.

You can also activate test mode per-request using the "Test Mode" toggle in the web UI.

---

## Project Structure

```
playcamp-node-sdk-example/
├── public/
│   └── index.html         # Web UI
├── src/
│   ├── index.ts           # Entry point (server start)
│   ├── app.ts             # Express app setup
│   ├── config.ts          # Environment variable management
│   ├── sdk.ts             # SDK instance management
│   ├── types.ts           # Type definitions
│   ├── utils.ts           # Utility functions
│   ├── error-handler.ts   # Error handler
│   └── routes/
│       ├── index.ts       # Route aggregator
│       ├── campaigns.ts   # Campaigns API
│       ├── creators.ts    # Creators API
│       ├── coupons.ts     # Coupons API
│       ├── sponsors.ts    # Sponsors API
│       ├── payments.ts    # Payments API
│       └── webhooks.ts    # Webhooks API
├── .env                   # Environment variables (git ignored)
├── package.json
└── tsconfig.json
```

---

## API Endpoints

### Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List campaigns |
| GET | `/api/campaigns/:id` | Get campaign details |
| GET | `/api/campaigns/:id/creators` | Get campaign creators |

### Creators

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/creators/search?keyword=` | Search creators |
| GET | `/api/creators/:key` | Get creator details |
| GET | `/api/creators/:key/coupons` | Get creator coupons |

### Coupons

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/coupons/validate` | Validate coupon |
| POST | `/api/coupons/redeem` | Redeem coupon |
| GET | `/api/coupons/user/:userId` | Get user coupon history |

### Sponsors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sponsors/:userId` | Get sponsor |
| POST | `/api/sponsors` | Create sponsor |
| PUT | `/api/sponsors/:userId` | Update sponsor |
| DELETE | `/api/sponsors/:userId` | Delete sponsor |
| GET | `/api/sponsors/:userId/history` | Get sponsor history |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments` | Create payment |
| GET | `/api/payments/:transactionId` | Get payment |
| GET | `/api/payments/user/:userId` | Get user payment history |
| POST | `/api/payments/:transactionId/refund` | Refund payment |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhooks` | List webhooks |
| POST | `/api/webhooks` | Create webhook |
| PUT | `/api/webhooks/:id` | Update webhook |
| DELETE | `/api/webhooks/:id` | Delete webhook |
| GET | `/api/webhooks/:id/logs` | Get webhook logs |
| POST | `/api/webhooks/:id/test` | Test webhook |

### Webhook Receiver

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/playcamp` | Webhook receiver endpoint |
| GET | `/api/webhooks/received` | List received webhooks |
| DELETE | `/api/webhooks/received` | Clear received webhooks |
| POST | `/api/webhooks/simulate` | Simulate webhook |

---

## Web UI Usage

### Basic Settings

1. **API URL**: Example server address (default: `http://localhost:4000`)
2. **Test Mode**: Toggle to enable/disable test mode

### Tab Features

| Tab | Features |
|----|----------|
| Campaigns | View campaign list/details/creators |
| Creators | Search creators/view details/coupons |
| Coupons | Validate/redeem coupons/view history |
| Sponsors | Sponsor CRUD and history |
| Payments | Create/view/refund payments |
| Webhooks | Manage webhooks and view received webhooks |

---

## API Usage Examples

### Campaigns

```bash
# List campaigns
curl http://localhost:4000/api/campaigns

# Get campaign details
curl http://localhost:4000/api/campaigns/CAMPAIGN_ID

# Get campaign creators
curl http://localhost:4000/api/campaigns/CAMPAIGN_ID/creators
```

### Creators

```bash
# Search creators
curl "http://localhost:4000/api/creators/search?keyword=test"

# Get creator details
curl http://localhost:4000/api/creators/TEST1

# Get creator coupons
curl http://localhost:4000/api/creators/TEST1/coupons
```

### Coupons

```bash
# Validate coupon
curl -X POST http://localhost:4000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"couponCode": "TESTCODE", "userId": "user_123"}'

# Redeem coupon
curl -X POST http://localhost:4000/api/coupons/redeem \
  -H "Content-Type: application/json" \
  -d '{"couponCode": "TESTCODE", "userId": "user_123"}'

# Get user coupon history
curl http://localhost:4000/api/coupons/user/user_123
```

### Sponsors

```bash
# Get sponsor
curl http://localhost:4000/api/sponsors/user_123

# Create sponsor
curl -X POST http://localhost:4000/api/sponsors \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "creatorKey": "TEST1", "campaignId": "campaign_001"}'

# Update sponsor
curl -X PUT http://localhost:4000/api/sponsors/user_123 \
  -H "Content-Type: application/json" \
  -d '{"campaignId": "campaign_001", "newCreatorKey": "TEST2"}'

# Delete sponsor
curl -X DELETE "http://localhost:4000/api/sponsors/user_123?campaignId=campaign_001"

# Get sponsor history
curl http://localhost:4000/api/sponsors/user_123/history
```

### Payments

```bash
# Create payment
curl -X POST http://localhost:4000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "transactionId": "txn_abc123",
    "productId": "diamond_100",
    "productName": "100 Diamonds",
    "amount": 4900,
    "currency": "KRW",
    "platform": "iOS"
  }'

# Get payment
curl http://localhost:4000/api/payments/txn_abc123

# Get user payment history
curl http://localhost:4000/api/payments/user/user_123

# Refund payment
curl -X POST http://localhost:4000/api/payments/txn_abc123/refund
```

---

## Webhook Testing

### 1. Create Webhook

```bash
curl -X POST http://localhost:4000/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "coupon.redeemed",
    "url": "http://localhost:4000/webhooks/playcamp"
  }'
```

Set the `secret` from the response in `.env` as `WEBHOOK_SECRET`.

### 2. Test Webhook

```bash
curl -X POST http://localhost:4000/api/webhooks/1/test
```

### 3. Check Received Webhooks

```bash
curl http://localhost:4000/api/webhooks/received
```

### 4. Simulate Webhook

```bash
curl -X POST http://localhost:4000/api/webhooks/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.created",
    "data": {
      "transactionId": "test-123",
      "userId": "user-456",
      "amount": 10000
    }
  }'
```

### Supported Webhook Events

| Event | Description |
|-------|-------------|
| `coupon.redeemed` | Coupon redeemed |
| `payment.created` | Payment created |
| `payment.refunded` | Payment refunded |
| `sponsor.created` | Sponsor created |
| `sponsor.changed` | Sponsor changed |

---

## Debug Mode

Setting `SDK_DEBUG=true` outputs SDK HTTP requests/responses to the console:

```
[PlayCamp SDK] 2024-01-15T10:30:00.000Z → GET https://sandbox-sdk-api.playcamp.io/v1/server/campaigns
[PlayCamp SDK] 2024-01-15T10:30:00.234Z ← ✓ 200 GET ... (234ms)
  response: { "data": [...] }
```

---

## Troubleshooting

### Server won't start

```
Required environment variables not set.
```

→ Check that `SERVER_API_KEY` and `WEBHOOK_SECRET` are set in `.env`

### API request failed (401)

```
401 Unauthorized
```

→ Check `SERVER_API_KEY` format (`keyId:secret`)

### Webhook signature verification failed

```
Invalid signature
```

→ Verify `WEBHOOK_SECRET` matches the secret received when creating the webhook

---

## Related Documentation

- [PlayCamp Node SDK](https://www.npmjs.com/package/@playcamp/node-sdk)
