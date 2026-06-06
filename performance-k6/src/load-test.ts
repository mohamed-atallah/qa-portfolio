import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { Options } from 'k6/options';

// Custom metric: checkout error rate
const checkoutErrors = new Rate('checkout_errors');

const BASE_URL: string = __ENV.BASE_URL || 'https://staging.api.demo-shop.test/api/v1';
const PEAK_VUS: number = Number(__ENV.VUS || 200);

export const options: Options = {
  scenarios: {
    browse_and_checkout: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: Math.round(PEAK_VUS * 0.25) }, // warm-up
        { duration: '1m', target: PEAK_VUS },                      // sustained load
        { duration: '1m', target: Math.round(PEAK_VUS * 1.5) },    // stress spike
        { duration: '30s', target: 0 },                            // cool-down
      ],
      gracefulRampDown: '15s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
    checkout_errors: ['rate<0.01'],
  },
};

export default function (): void {
  // 1) Browse the catalog
  const list = http.get(`${BASE_URL}/products`, { tags: { name: 'products_list' } });
  check(list, {
    'products: status 200': (r) => r.status === 200,
    'products: fast enough': (r) => r.timings.duration < 800,
  });

  sleep(1);

  // 2) Attempt a checkout
  const payload = JSON.stringify({ cartId: `c-${__VU}-${__ITER}`, paymentMethod: 'card' });
  const res = http.post(`${BASE_URL}/checkout`, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'checkout' },
  });

  const ok = check(res, {
    'checkout: status 200/201': (r) => r.status === 200 || r.status === 201,
  });
  checkoutErrors.add(!ok);

  sleep(Math.random() * 2);
}
