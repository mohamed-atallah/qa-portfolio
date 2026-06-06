# CI/CD — Jenkins

A declarative `Jenkinsfile` that runs the QA suites on every build and publishes reports.

## Pipeline stages
1. **Checkout** — pull the latest code.
2. **API Tests** — run the Postman collection headless with Newman (JUnit report).
3. **UI Regression** — run the Playwright suite (HTML report).
4. **Performance Smoke** — run the k6 script; fails the build if thresholds are breached.
5. **Reports** — publish JUnit + HTML; notify on failure.

The pipeline is parameterized by `TARGET_ENV` and runs nightly via a cron trigger, plus on every PR.

See [`Jenkinsfile`](./Jenkinsfile).
