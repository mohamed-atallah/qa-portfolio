# Bug Reports

Sample defect reports written in the format I use day-to-day in JIRA / Azure DevOps.
Each report is self-contained and reproducible.

| ID | Title | Severity | Priority |
|----|-------|----------|----------|
| [BUG-001](./BUG-001-cart-quantity-not-updating.md) | Cart total not recalculated when item quantity is changed | Major | High |
| [BUG-002](./BUG-002-coupon-stacking-negative-total.md) | Stacking two coupons produces a negative order total | Critical | High |
| [BUG-003](./BUG-003-search-api-500-on-empty-query.md) | Search API returns HTTP 500 on empty `q` parameter | Major | Medium |

Screenshots and attachments referenced by each report are stored in [`./screenshots`](./screenshots).

## Template

```
Bug ID:            BUG-XXX
Title:             <concise summary>
Severity:          Blocker / Critical / Major / Minor / Trivial
Priority:          High / Medium / Low
Environment:       <build, OS, browser/device, API base URL>
Preconditions:     <state required before steps>
Steps to Reproduce: 1. ... 2. ... 3. ...
Actual Result:     <what actually happens>
Expected Result:   <what should happen>
Screenshots / Attachments:
                   - <file> — <caption>
                   - <log/HAR> — <caption>
Notes:             <root-cause hints, frequency, business impact, workaround>
```
