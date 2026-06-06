# BUG-001 — Cart total not recalculated when item quantity is changed

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-001 |
| **Severity** | Major |
| **Priority** | High |
| **Status** | Open |
| **Component** | Web · Shopping Cart |
| **Reported by** | Mohamed Ali Atallah (QA) |

## Environment
- Build: `web 2.14.0` (staging)
- OS / Browser: Windows 11 · Chrome 124.0
- Account: standard registered user

## Preconditions
- User is logged in.
- Cart contains 1 product: *"Wireless Mouse"* — unit price **SAR 80.00**, quantity **1**, subtotal **SAR 80.00**.

## Steps to Reproduce
1. Open the cart page.
2. In the quantity field for *Wireless Mouse*, change `1` → `3`.
3. Observe the line subtotal and the **Order Total**.

## Actual Result
- The line subtotal updates to **SAR 240.00**, **but the Order Total stays at SAR 80.00**.
- The total only corrects itself after a full page refresh.
- API note: `PATCH /api/v1/cart/items/882` returns `200` with the correct `lineTotal`, but the cart summary is rendered from cached client state and is not re-fetched.

## Expected Result
- Line subtotal updates to **SAR 240.00** (3 × 80.00).
- Order Total updates to reflect the new subtotal (plus any tax/shipping).

## Screenshots / Attachments
| File | Description |
|------|-------------|
| `bug-001-cart-total-stale.png` | Cart showing line subtotal SAR 240.00 while Order Total still reads SAR 80.00. |
| `bug-001-network.har` | Captured `PATCH /cart/items/882` request/response. |

> Full-resolution screenshots and the HAR/console log are attached to the ticket in JIRA.
> See [`./screenshots`](./screenshots) for the storage convention.

## Notes
- Reproducible **100%** of the time across Chrome, Firefox, and Safari → not browser-specific.
- Likely root cause: the cart summary component does not subscribe to the quantity-update event.
- **Business impact:** users may be charged an incorrect total at checkout → potential revenue/trust issue.
- Workaround: refresh the page before checkout.
