# BUG-003 — Search API returns HTTP 500 on empty `q` parameter

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-003 |
| **Severity** | Major |
| **Priority** | Medium |
| **Status** | Open |
| **Component** | API · Catalog Search |
| **Reported by** | Mohamed Ali Atallah (QA) |

## Environment
- API base URL: `https://staging.api.demo-shop.test/api/v1`
- Build: `api 1.9.3`
- Tool: Postman / cURL

## Preconditions
- Valid bearer token for a standard user.

## Steps to Reproduce
```bash
curl -i "https://staging.api.demo-shop.test/api/v1/products/search?q=" \
  -H "Authorization: Bearer <token>"
```

## Actual Result
- `500 Internal Server Error` with a stack-trace-like body:
  ```json
  { "error": "INTERNAL_ERROR", "message": "NullPointerException at SearchService.tokenize(...)" }
  ```
- Reproducible with `q=` and with the parameter omitted entirely.

## Expected Result
- `400 Bad Request` with a clear validation message, e.g.
  ```json
  { "error": "VALIDATION_ERROR", "message": "Query parameter 'q' must not be empty." }
  ```
  *(or `200 OK` with an empty result set, per the agreed contract).*

## Screenshots / Attachments
| File | Description |
|------|-------------|
| `bug-003-search-500.png` | Postman showing the 500 response and leaked exception details. |
| `bug-003-response.json` | Full captured response body. |

> The request is also saved in the Postman collection: [`../api-testing`](../api-testing) → *Products - Search empty q (negative / BUG-003)*.
> See [`./screenshots`](./screenshots) for the storage convention.

## Notes
- **Security concern:** the response leaks internal exception details (class/method names) → information disclosure; should be a generic error in non-debug environments.
- **Business impact:** an empty search-box submit crashes the endpoint and breaks the results page.
- Recommended fix: validate/normalize `q` at the controller; return `400` (or empty `200`) and sanitize error responses.
