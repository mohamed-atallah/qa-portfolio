# API Testing — Postman

A runnable Postman collection demonstrating positive, negative, boundary, and schema-validation
checks against a demo e-commerce API.

## Files
- [`demo-shop.postman_collection.json`](./demo-shop.postman_collection.json) — the collection (Postman Schema v2.1).
- [`demo-shop.postman_environment.json`](./demo-shop.postman_environment.json) — environment variables (`base_url`, `token`).

## What it covers
| Request | Type | Assertions |
|---------|------|------------|
| `POST /auth/login` | Positive | `200`, response has `token`, saves token to env |
| `GET /products` | Positive + schema | `200`, JSON array, response time < 800 ms, each item has `id`/`name`/`price` |
| `GET /products/search?q=` | Negative | `400` (documents BUG-003 if `500`), error body shape |
| `POST /checkout` (no auth) | Security | `401 Unauthorized` |
| `POST /checkout/coupons` (stacking) | Negative | second coupon rejected; `orderTotal >= 0` (documents BUG-002) |

## How to run
1. Import both files into Postman (or run headless with Newman).
2. Select the **demo-shop** environment.
3. Run the collection.

```bash
# Headless run with Newman (used in the Jenkins pipeline)
newman run demo-shop.postman_collection.json -e demo-shop.postman_environment.json \
  --reporters cli,junit --reporter-junit-export newman-report.xml
```
