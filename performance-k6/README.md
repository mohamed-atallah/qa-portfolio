# Performance Testing — Grafana k6

A load/stress script for the demo e-commerce API focused on the product-listing and checkout paths.

- [`load-test.js`](./load-test.js) — staged ramp (warm-up → load → stress → cool-down) with thresholds.

## Thresholds (pass/fail gates)
- `http_req_duration` **p95 < 800 ms**
- `http_req_failed` **< 1%**
- Custom `checkout_errors` rate **< 1%**

## How to run
```bash
# install: https://grafana.com/docs/k6/latest/set-up/install-k6/
k6 run load-test.js

# override target + virtual users
k6 run -e BASE_URL=https://staging.api.demo-shop.test/api/v1 -e VUS=200 load-test.js
```

k6 exits non-zero if a threshold is breached, so it can gate the Jenkins pipeline.
