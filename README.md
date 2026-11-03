# Automation Exercise Playwright Framework

## Overview

This repository contains a Playwright and TypeScript end-to-end testing framework for the public [Automation Exercise](https://automationexercise.com/) practice store. The suite covers customer account journeys, product discovery, cart and checkout behavior, contact form validation, accessibility, and a focused visual regression check.

## Framework design

- **Page Object Model:** `pages/` holds reusable page actions and locators for account, product, cart, checkout, and contact workflows.
- **Custom fixtures:** `fixtures/test.fixture.ts` exposes page objects and a unique test user to each isolated test.
- **Test data:** `testdata/` contains user data generation and the known product used by cart and order scenarios. User email addresses are unique per test run.
- **Configuration:** `config/test-config.ts` reads the application URL from `BASE_URL`, defaulting to the public practice store.
- **Cross-browser execution:** The product-search smoke test runs in Chromium, Firefox, and WebKit. Account, checkout, contact, accessibility, and visual workflows are limited to Chromium to avoid repeated state changes and excess load on the independently hosted practice site.
- **Network mocking:** In Chromium, the product search test intercepts the add-to-cart request and supplies a deterministic success response. Firefox and WebKit run the search smoke without mutating cart state.
- **Contact form:** The form validation scenario handles the site's confirmation dialog and verifies its in-page success state; it does not send a message to the live site.
- **Accessibility:** `@axe-core/playwright` checks WCAG 2.0/2.1 A/AA tags and fails the test on critical violations.
- **Visual validation:** A Chromium screenshot baseline covers the searched Blue Top product card. Review intentional UI changes with `npm run test:update-snapshots`.
- **Diagnostics and reports:** Screenshots are saved on failure, traces are recorded on retry, and the HTML and JSON reports are written under `reports/`.

The public practice application is independently hosted; tests do not create or start an application server. Account tests use generated accounts and delete them after successful flows. Order placement uses synthetic payment data on the practice site only.

## Prerequisites

- Node.js LTS
- npm

## Setup

```bash
npm ci
npx playwright install
```

Set `BASE_URL` to test another compatible environment:

```powershell
$env:BASE_URL = "https://automationexercise.com"
```

## Run tests

```bash
npm run test:report -- --project=chromium --workers=2
```

This command runs the complete configured suite and opens the HTML report even if tests fail. It returns a failing exit code when the test run fails. The product-search smoke test runs in Chromium, Firefox, and WebKit; the remaining workflows, including the visual regression assertion, run in Chromium. To run the type check separately, use `npm run typecheck`.

## Reports and debugging

The HTML report opens automatically after `npm run test:report`, including when the test command reports failures. Reports and debugging artifacts are also available at:

- Review `reports/results.json` for machine-readable results.
- Review `reports/artifacts/` for traces, screenshots, and videos captured by Playwright.
- Open a trace with `npx playwright show-trace <trace-file>`.

Update the visual baseline after confirming a deliberate UI change:

```bash
npm run test:update-snapshots
```

## Automated scenarios

1. Register, log out, log back in, and delete the test account.
2. Reject invalid login credentials.
3. Search for a product and validate the matching result.
4. Add a product to the cart and remove it.
5. Require authentication before checkout.
6. Place an order as a registered customer.
7. Validate the required contact email and confirm the successful submission state.
8. Check critical accessibility violations and the product card visual baseline.
