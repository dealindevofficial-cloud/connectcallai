# Vapi Outbound Call Contract (Next.js API Route)

This app should trigger outbound calls from server-side code only (Node.js runtime API routes).

## Endpoint

- Method: `POST`
- URL: `${VAPI_API_BASE_URL}/call` (default `https://api.vapi.ai/call`)
- Required headers:
  - `Authorization: Bearer ${VAPI_API_KEY}`
  - `Content-Type: application/json`

## Minimum Request Body

```json
{
  "assistantId": "assistant-id",
  "phoneNumberId": "phone-number-id",
  "customer": {
    "number": "+15551234567"
  }
}
```

## Rules Confirmed from Vapi Docs

- Use **exactly one** assistant source:
  - `assistantId` for a saved assistant, or
  - `assistant` for a transient inline assistant config.
- `phoneNumberId` must be a Vapi phone-number resource (including imported Twilio numbers).
- Destination must be supplied via `customer.number` in E.164 format.
- Optional scheduling uses:
  - `schedulePlan.earliestAt`
  - `schedulePlan.latestAt`
- Optional batch mode uses `customers` (array) instead of a single `customer`.

## Environment Variables for This Runtime

- Required:
  - `VAPI_API_KEY`: private server key for Bearer auth.
  - `VAPI_OUTBOUND_PHONE_NUMBER_ID`: default source number.
  - `VAPI_ASSISTANT_REAL_ESTATE_ID`
  - `VAPI_ASSISTANT_RESTAURANTS_ID`
  - `VAPI_ASSISTANT_HOSPITALS_ID`
  - `VAPI_ASSISTANT_PET_CLINICS_ID`
- Recommended:
  - `VAPI_API_BASE_URL` (default `https://api.vapi.ai`)
  - `VAPI_REQUEST_TIMEOUT_MS` (fetch timeout guard)

## Next.js Runtime Notes

- Keep `VAPI_API_KEY` server-only (do **not** expose with `NEXT_PUBLIC_` prefix).
- Use API route runtime `nodejs` for predictable network/timeout behavior.
- Log non-sensitive metadata only (industry slug, request id, outcome, status code).

## Abuse Guard (Lightweight)

- In-memory IP throttling is enabled in `app/api/demo-call/route.ts`.
- Defaults: `3` requests per `60` seconds per IP.
- Optional tuning:
  - `DEMO_CALL_RATE_MAX_REQUESTS` (default `3`)
  - `DEMO_CALL_RATE_WINDOW_MS` (default `60000`)
  - `DEMO_CALL_RATE_MAX_TRACKED_IPS` (default `2000`, memory safety cap)
- When throttled, API returns:
  - HTTP `429`
  - `status: "validation_error"`
  - `retryAfterSeconds` in JSON response
  - `Retry-After` response header

## Manual Verification Checklist

- Happy path (`called_now`)
  - Submit valid `name`, `phone`, `email`, and each valid `industry`.
  - Confirm response HTTP `200` with `status: "called_now"`.
  - Confirm UI shows immediate success copy for live call placement.
- Validation failures (`validation_error`)
  - Submit invalid email (for example `foo@`) and verify HTTP `400`.
  - Submit invalid phone (for example `123`) and verify HTTP `400`.
  - Submit missing/invalid industry and verify HTTP `400`.
  - Confirm UI surfaces a field-level actionable message.
- Abuse guard (`429`)
  - Submit the same valid payload more than limit within the window.
  - Confirm HTTP `429`, `Retry-After` header, and `retryAfterSeconds`.
  - Confirm UI shows a retry-later message rather than generic failure.
- Provider fallback (`queued_fallback`)
  - Temporarily force provider failure (e.g. invalid `VAPI_API_KEY` in local env).
  - Submit valid payload and confirm HTTP `202` with `status: "queued_fallback"`.
  - Verify `.data/demo-call-queue.jsonl` receives the queued record.
  - Confirm UI shows queued fallback messaging.

## Sources

- [Vapi Outbound Calling](https://docs.vapi.ai/calls/outbound-calling)
- [Vapi Create Call API](https://docs.vapi.ai/api-reference/calls/create)
