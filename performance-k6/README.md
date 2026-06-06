# Performance Testing — Grafana k6 (TypeScript)

A load/stress test for the demo e-commerce API (product-listing + checkout paths), written in
**TypeScript** with `@types/k6` and bundled to JavaScript for execution.

> k6 runs JavaScript natively — it cannot execute `.ts` directly — so the TypeScript source in
> [`src/load-test.ts`](./src/load-test.ts) is transpiled to `dist/load-test.js` with **esbuild**
> before running.

## Thresholds (pass/fail gates)
- `http_req_duration` **p95 < 800 ms**
- `http_req_failed` **< 1%**
- Custom `checkout_errors` rate **< 1%**

## Setup
```bash
cd performance-k6
npm install
```

## Type-check
```bash
npm run typecheck
```

## Build + run
```bash
# build TS -> dist/load-test.js, then run with k6
npm test

# or build and run separately, overriding target + virtual users
npm run build
k6 run -e BASE_URL=https://staging.api.demo-shop.test/api/v1 -e VUS=200 dist/load-test.js
```

k6 exits non-zero if a threshold is breached, so it can gate the Jenkins pipeline.

## Layout
```
performance-k6/
├── src/load-test.ts   # TypeScript source (typed with @types/k6)
├── package.json       # esbuild + typescript + @types/k6
├── tsconfig.json      # strict, types: ["k6"]
└── dist/load-test.js  # build output (gitignored)
```
