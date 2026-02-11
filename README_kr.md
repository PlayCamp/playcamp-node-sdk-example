# PlayCamp SDK Example Server

PlayCamp SDK의 모든 기능을 테스트할 수 있는 예제 서버입니다.

## 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정합니다:

```bash
# 필수
SERVER_API_KEY=your_server_key:your_secret
WEBHOOK_SECRET=your_webhook_secret

# SDK 환경 설정 (택 1)
SDK_ENVIRONMENT=sandbox    # 'sandbox' 또는 'live'
# SDK_API_URL=http://localhost:3003  # 커스텀 URL (환경 설정보다 우선)

# 옵션
SDK_TEST_MODE=false        # 테스트 모드 활성화
SDK_DEBUG=true             # 디버그 로그 활성화
PORT=4000                  # 서버 포트
```

### 3. 서버 실행

```bash
# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev

# 일반 실행
npm start
```

### 4. 웹 UI 접속

브라우저에서 `http://localhost:4000` 접속

---

## 환경 설정

### SDK Environment

| Environment | URL | 용도 |
|-------------|-----|------|
| `sandbox` | https://sandbox-sdk-api.playcamp.io | 개발/테스트 |
| `live` | https://sdk-api.playcamp.io | 프로덕션 |

```bash
# Sandbox 환경
SDK_ENVIRONMENT=sandbox

# Live 환경 (기본값)
SDK_ENVIRONMENT=live

# 커스텀 URL (로컬 개발 등)
SDK_API_URL=http://localhost:3003
```

### Test Mode

`SDK_TEST_MODE=true`로 설정하면 모든 API 요청에 `isTest=true` 파라미터가 추가됩니다.

웹 UI에서도 "Test Mode" 토글을 통해 요청별로 테스트 모드를 활성화할 수 있습니다.

---

## 프로젝트 구조

```
playcamp-node-sdk-example/
├── public/
│   └── index.html         # 웹 UI
├── src/
│   ├── index.ts           # 진입점 (서버 시작)
│   ├── app.ts             # Express 앱 설정
│   ├── config.ts          # 환경 변수 관리
│   ├── sdk.ts             # SDK 인스턴스 관리
│   ├── types.ts           # 타입 정의
│   ├── utils.ts           # 유틸리티 함수
│   ├── error-handler.ts   # 에러 핸들러
│   └── routes/
│       ├── index.ts       # 라우트 통합
│       ├── campaigns.ts   # 캠페인 API
│       ├── creators.ts    # 크리에이터 API
│       ├── coupons.ts     # 쿠폰 API
│       ├── sponsors.ts    # 스폰서 API
│       ├── payments.ts    # 결제 API
│       └── webhooks.ts    # 웹훅 API
├── .env                   # 환경 변수 (git 제외)
├── package.json
└── tsconfig.json
```

---

## API 엔드포인트

### Campaigns

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/campaigns` | 캠페인 목록 |
| GET | `/api/campaigns/:id` | 캠페인 상세 |
| GET | `/api/campaigns/:id/creators` | 캠페인 크리에이터 |

### Creators

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/creators/search?keyword=` | 크리에이터 검색 |
| GET | `/api/creators/:key` | 크리에이터 상세 |
| GET | `/api/creators/:key/coupons` | 크리에이터 쿠폰 |

### Coupons

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/coupons/validate` | 쿠폰 검증 |
| POST | `/api/coupons/redeem` | 쿠폰 리딤 |
| GET | `/api/coupons/user/:userId` | 사용자 쿠폰 내역 |

### Sponsors

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/sponsors/:userId` | 스폰서 조회 |
| POST | `/api/sponsors` | 스폰서 생성 |
| PUT | `/api/sponsors/:userId` | 스폰서 변경 |
| DELETE | `/api/sponsors/:userId` | 스폰서 삭제 |
| GET | `/api/sponsors/:userId/history` | 스폰서 이력 |

### Payments

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/payments` | 결제 등록 |
| GET | `/api/payments/:transactionId` | 결제 조회 |
| GET | `/api/payments/user/:userId` | 사용자 결제 내역 |
| POST | `/api/payments/:transactionId/refund` | 결제 환불 |

### Webhooks

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/webhooks` | 웹훅 목록 |
| POST | `/api/webhooks` | 웹훅 등록 |
| PUT | `/api/webhooks/:id` | 웹훅 수정 |
| DELETE | `/api/webhooks/:id` | 웹훅 삭제 |
| GET | `/api/webhooks/:id/logs` | 웹훅 로그 |
| POST | `/api/webhooks/:id/test` | 웹훅 테스트 |

### Webhook Receiver

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/webhooks/playcamp` | 웹훅 수신 엔드포인트 |
| GET | `/api/webhooks/received` | 수신된 웹훅 목록 |
| DELETE | `/api/webhooks/received` | 수신된 웹훅 초기화 |
| POST | `/api/webhooks/simulate` | 웹훅 시뮬레이션 |

---

## 웹 UI 사용법

### 기본 설정

1. **API URL**: Example 서버 주소 (기본: `http://localhost:4000`)
2. **Test Mode**: 토글하여 테스트 모드 활성화/비활성화

### 탭별 기능

| 탭 | 기능 |
|----|------|
| Campaigns | 캠페인 목록/상세/크리에이터 조회 |
| Creators | 크리에이터 검색/상세/쿠폰 조회 |
| Coupons | 쿠폰 검증/리딤/내역 조회 |
| Sponsors | 스폰서 CRUD 및 이력 조회 |
| Payments | 결제 등록/조회/환불 |
| Webhooks | 웹훅 관리 및 수신 확인 |

---

## API 사용 예제

### 캠페인

```bash
# 캠페인 목록
curl http://localhost:4000/api/campaigns

# 캠페인 상세
curl http://localhost:4000/api/campaigns/CAMPAIGN_ID

# 캠페인 크리에이터
curl http://localhost:4000/api/campaigns/CAMPAIGN_ID/creators
```

### 크리에이터

```bash
# 크리에이터 검색
curl "http://localhost:4000/api/creators/search?keyword=test"

# 크리에이터 상세
curl http://localhost:4000/api/creators/TEST1

# 크리에이터 쿠폰
curl http://localhost:4000/api/creators/TEST1/coupons
```

### 쿠폰

```bash
# 쿠폰 검증
curl -X POST http://localhost:4000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"couponCode": "TESTCODE", "userId": "user_123"}'

# 쿠폰 리딤
curl -X POST http://localhost:4000/api/coupons/redeem \
  -H "Content-Type: application/json" \
  -d '{"couponCode": "TESTCODE", "userId": "user_123"}'

# 사용자 쿠폰 내역
curl http://localhost:4000/api/coupons/user/user_123
```

### 스폰서

```bash
# 스폰서 조회
curl http://localhost:4000/api/sponsors/user_123

# 스폰서 생성
curl -X POST http://localhost:4000/api/sponsors \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_123", "creatorKey": "TEST1", "campaignId": "campaign_001"}'

# 스폰서 변경
curl -X PUT http://localhost:4000/api/sponsors/user_123 \
  -H "Content-Type: application/json" \
  -d '{"campaignId": "campaign_001", "newCreatorKey": "TEST2"}'

# 스폰서 삭제
curl -X DELETE "http://localhost:4000/api/sponsors/user_123?campaignId=campaign_001"

# 스폰서 이력
curl http://localhost:4000/api/sponsors/user_123/history
```

### 결제

```bash
# 결제 등록
curl -X POST http://localhost:4000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "transactionId": "txn_abc123",
    "productId": "diamond_100",
    "productName": "다이아몬드 100개",
    "amount": 4900,
    "currency": "KRW",
    "platform": "iOS"
  }'

# 결제 조회
curl http://localhost:4000/api/payments/txn_abc123

# 사용자 결제 내역
curl http://localhost:4000/api/payments/user/user_123

# 결제 환불
curl -X POST http://localhost:4000/api/payments/txn_abc123/refund
```

---

## 웹훅 테스트

### 1. 웹훅 등록

```bash
curl -X POST http://localhost:4000/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "coupon.redeemed",
    "url": "http://localhost:4000/webhooks/playcamp"
  }'
```

응답의 `secret`을 `.env`의 `WEBHOOK_SECRET`에 설정합니다.

### 2. 웹훅 테스트 전송

```bash
curl -X POST http://localhost:4000/api/webhooks/1/test
```

### 3. 수신된 웹훅 확인

```bash
curl http://localhost:4000/api/webhooks/received
```

### 4. 웹훅 시뮬레이션

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

### 지원 웹훅 이벤트

| Event | 설명 |
|-------|------|
| `coupon.redeemed` | 쿠폰 리딤 완료 |
| `payment.created` | 결제 생성 |
| `payment.refunded` | 결제 환불 |
| `sponsor.created` | 스폰서 생성 |
| `sponsor.changed` | 스폰서 변경 |

---

## 디버그 모드

`SDK_DEBUG=true`로 설정하면 SDK의 HTTP 요청/응답이 콘솔에 출력됩니다:

```
[PlayCamp SDK] 2024-01-15T10:30:00.000Z → GET https://sandbox-sdk-api.playcamp.io/v1/server/campaigns
[PlayCamp SDK] 2024-01-15T10:30:00.234Z ← ✓ 200 GET ... (234ms)
  response: { "data": [...] }
```

---

## 문제 해결

### 서버가 시작되지 않음

```
Required environment variables not set.
```

→ `.env` 파일에 `SERVER_API_KEY`와 `WEBHOOK_SECRET`이 설정되어 있는지 확인

### API 요청 실패 (401)

```
401 Unauthorized
```

→ `SERVER_API_KEY` 형식 확인 (`keyId:secret`)

### 웹훅 서명 검증 실패

```
Invalid signature
```

→ `WEBHOOK_SECRET`이 웹훅 등록 시 받은 secret과 일치하는지 확인

---

## 관련 문서

- [PlayCamp Node SDK](https://www.npmjs.com/package/@playcamp/node-sdk)
