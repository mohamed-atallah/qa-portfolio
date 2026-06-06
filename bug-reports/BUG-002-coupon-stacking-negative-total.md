# BUG-002 — Stacking two coupons produces a negative order total

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-002 |
| **Severity** | Critical |
| **Priority** | High |
| **Status** | Open |
| **Component** | Web · Checkout · Promotions |
| **Reported by** | Mohamed Ali Atallah (QA) |

## Environment
- Build: `web 2.14.0` (staging) · API `v1`
- OS / Browser: macOS 14 · Safari 17.4

## Preconditions
- Cart subtotal = **SAR 100.00**.
- Two active coupons exist: `WELCOME50` (50% off) and `FLAT80` (SAR 80 off).
- Promotion rules state coupons are **not** stackable.

## Steps to Reproduce
1. Go to checkout.
2. Apply coupon `WELCOME50` → total becomes **SAR 50.00** (correct).
3. In the same session, apply coupon `FLAT80`.
4. Observe the **Order Total** and the **Pay** button.

## Expected Result
- Second coupon is rejected with a message: *"Only one coupon can be applied per order."*
- Order Total remains **SAR 50.00**.

## Actual Result
- Both coupons apply. Order Total becomes **−SAR 30.00** (50 − 80).
- The **Pay** button is enabled with a negative total.

## Evidence
- `evidence/negative-total.png` *(screenshot placeholder)*
- API: `POST /api/v1/checkout/coupons` accepts the second code and returns `"orderTotal": -30.00` with `200 OK`.

## Notes
- Reproducible **100%**. Also occurs via the API directly (server-side validation missing) → **not a UI-only bug**.
- **Business impact (why Critical):** allows orders at a negative price; direct financial loss and a clear fraud vector.
- Recommended fix: enforce non-stackable rule **and** clamp `orderTotal` to a minimum of `0` server-side; add a regression test for both layers.
