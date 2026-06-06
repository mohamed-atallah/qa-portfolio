# Test Plan — Checkout Flow (Demo E-Commerce App)

| | |
|---|---|
| **Document ID** | TP-CHECKOUT-001 |
| **Version** | 1.0 |
| **Author** | Mohamed Ali Atallah (Senior QA Engineer) |
| **Status** | Approved for execution |

---

## 1. Introduction
This plan covers verification of the end-to-end **checkout flow** of the demo e-commerce
application: cart → address → shipping → payment → order confirmation, across web and mobile,
plus the supporting REST APIs.

## 2. Scope

### 2.1 In scope
- Cart review, quantity/coupon updates, and total calculation.
- Address selection and validation.
- Shipping method selection and fee calculation.
- Payment (card, wallet) — happy path + declined/timeout.
- Order creation, confirmation, and email/notification.
- API contract & validation for `/cart`, `/checkout`, `/orders`.
- Functional, API, performance (checkout under load), and basic security (authorization) testing.

### 2.2 Out of scope
- Third-party payment-gateway internals (covered by the provider).
- Catalog browsing and product detail pages (separate plan).
- Penetration testing.

## 3. Test Strategy
| Test type | Approach | Tooling |
|-----------|----------|---------|
| Functional / E2E | Risk-based, scenario + exploratory | Manual + Playwright |
| API | Positive, negative, boundary, schema validation | Postman / REST Assured |
| Regression | Automated suite on every build | Selenium/TestNG + Playwright in Jenkins |
| Performance | Load & stress on checkout endpoints | Grafana k6 |
| Compatibility | Chrome, Firefox, Safari · Android, iOS | Manual / device cloud |

## 4. Entry Criteria
- Build deployed to staging and smoke test passed.
- Test data (users, products, coupons, payment sandboxes) seeded.
- Requirements / acceptance criteria signed off.

## 5. Exit Criteria
- 100% of planned test cases executed.
- 0 open **Critical/Blocker** defects; all **Major** triaged with an agreed plan.
- ≥ 95% pass rate on the automated regression suite.
- Performance: checkout p95 response time within agreed threshold (see §8).

## 6. Test Scenarios (high level)
| # | Scenario | Type | Priority |
|---|----------|------|----------|
| TC-01 | Place order with single item, card payment (happy path) | Functional | High |
| TC-02 | Change item quantity → totals recalculate correctly | Functional | High |
| TC-03 | Apply valid coupon → discount applied once; stacking rejected | Functional | High |
| TC-04 | Payment declined → user sees error, order not created | Negative | High |
| TC-05 | Checkout with empty cart is blocked | Negative | Medium |
| TC-06 | `POST /checkout` without auth → `401` | API / Security | High |
| TC-07 | `POST /checkout` with invalid address id → `400` + message | API | Medium |
| TC-08 | 200 concurrent checkouts → p95 < threshold, 0 errors | Performance | Medium |

## 7. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment sandbox instability | Blocks payment tests | Mock + retry; schedule around provider maintenance |
| Incorrect total calculation (see BUG-001/002) | Financial | Add server + UI regression tests; gate release |
| Late requirement changes | Rework | Risk-based prioritization; automate stable paths first |

## 8. Performance Acceptance
- `POST /checkout` **p95 < 800 ms**, **error rate < 1%** at 200 VUs (see [`performance-k6/`](../performance-k6)).

## 9. Traceability (sample)
| Requirement | Test cases |
|-------------|------------|
| REQ-CHK-01 Place order | TC-01, TC-08 |
| REQ-CHK-02 Totals & discounts | TC-02, TC-03 |
| REQ-CHK-03 Payment handling | TC-01, TC-04 |
| REQ-CHK-04 Auth & validation | TC-06, TC-07 |

## 10. Deliverables
- Executed test cases + results.
- Defect reports (see [`bug-reports/`](../bug-reports)).
- Automated regression run (Jenkins) + Allure/HTML report.
- Performance summary.
