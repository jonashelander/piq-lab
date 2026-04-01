# PIQ Lab

PIQ Lab is a configurable mock integration API with a React frontend and a Node/Express/TypeScript backend.

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

- **PIQ Lab → verifyuser** — Configure the response returned by `POST /verifyuser`. Toggle individual parameters, edit values, manage `attributes` key/value pairs, and import a complete JSON object.
- **Logs → verifyuser** — Inspect every incoming request and outgoing response, including headers and bodies. Logs auto-refresh every 5 seconds.

### Test the endpoint

```bash
curl -X POST http://localhost:3001/verifyuser \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"sess_abc","userId":"user123"}'
```

Restarting the backend resets all configuration and logs to seeded defaults.
