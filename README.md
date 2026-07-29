# AgriSense backend

FastAPI backend, structured feature-first so each person owns one
router + service pair and nobody touches another person's files.

## Structure

```
app/
  main.py               # entrypoint, CORS, mounts all routers — shared file, touch carefully
  config.py             # env var loading — shared file
  schemas/              # pydantic request/response models, one file per feature
    detection.py
    chat.py
    recovery.py
  routers/               # request handling only, one file per feature
    health.py            # GET /
    detection.py          # POST /predict        <- Detection owner
    chat.py                # POST /chat            <- LeafDoc AI owner
    recovery.py            # POST /recovery-plan   <- Recovery Planner owner
  services/              # actual business logic / AI calls, one file per feature
    detection_service.py  <- Detection owner
    chat_service.py       <- LeafDoc AI owner
    recovery_service.py   <- Recovery Planner owner
```

Each feature owner only needs to edit their own `routers/*.py` +
`services/*.py` pair. The router shape (endpoint path, request/response
fields) is already locked to the API contract — don't change field names,
only fill in the TODOs inside the service files.

## Setup

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in your API key
uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive API docs (Swagger UI) —
useful for testing each endpoint before the frontend is wired up.

## Current state

Every endpoint returns mock data matching the contract exactly, so the
frontend team can start integrating immediately. Each service file has a
clear TODO marking where to swap in the real AI call.

## Known thing to resolve before demo

`config.py` loads `ANTHROPIC_API_KEY`. Confirm this matches whichever AI
provider the services actually end up calling (the wider project doc
mentions Gemini) — rename the env var and `config.py` together if not.
