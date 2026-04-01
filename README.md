# PIQ Lab

PIQ Lab is a configurable mock integration API supporting multiple endpoints, with a React frontend and a Node/Express/TypeScript backend.

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`.

## Usage

Open `http://localhost:3000` in your browser.

- **PIQ Lab** — Select an endpoint to configure the response it returns. Toggle individual fields, edit values, manage nested key/value pairs where applicable, and import a complete JSON object.
- **Logs** — Inspect every incoming request and outgoing response per endpoint, including headers and bodies. Logs auto-refresh every 5 seconds.

### Supported endpoints

| Endpoint | Route |
|---|---|
| verifyuser | `POST /verifyuser` |
| authorize | `POST /authorize` |
| transfer | `POST /transfer` |
| cancel | `POST /cancel` |
| notification | `POST /notification` |
| lookupuser | `POST /lookupuser` |
| signin | `POST /signin` |

### Test an endpoint

```bash
# verifyuser
curl -X POST http://localhost:3001/verifyuser \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"sess_abc","userId":"user123"}'

# authorize
curl -X POST http://localhost:3001/authorize \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","merchantTxId":"111111111"}'

# transfer
curl -X POST http://localhost:3001/transfer \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","merchantTxId":"111111111","amount":"100.00"}'

# cancel
curl -X POST http://localhost:3001/cancel \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","merchantTxId":"111111111"}'

# notification
curl -X POST http://localhost:3001/notification \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","merchantTxId":"111111111"}'

# lookupuser (supports configurable nested attributes)
curl -X POST http://localhost:3001/lookupuser \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123"}'

# signin
curl -X POST http://localhost:3001/signin \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","sessionId":"sess_abc"}'
```

Restarting the backend resets all endpoint configurations and logs to seeded defaults.
