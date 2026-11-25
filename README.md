# QA Automation Framework

## Project overview

This repository contains a TypeScript and Playwright Test framework for:

- UI automation of Sauce Demo.
- API automation of Restful Booker.
- Local test execution and GitHub Actions CI.

The UI suite uses a lightweight Page Object Model and a custom authenticated-page fixture. The API suite uses Playwright's `APIRequestContext`, a reusable API client, typed request and response data, and isolated booking data.

## Project structure

- [`src/ui/pages/`](./src/ui/pages/) — Sauce Demo page objects: `LoginPage`, `InventoryPage`, `CartPage`, and `CheckoutPage`.
- [`src/ui/fixtures/testFixtures.ts`](./src/ui/fixtures/testFixtures.ts) — authenticated UI fixture.
- [`src/api/clients/bookingApiClient.ts`](./src/api/clients/bookingApiClient.ts) — Restful Booker request methods.
- [`src/api/fixtures/apiFixtures.ts`](./src/api/fixtures/apiFixtures.ts) — API client and credential fixtures.
- [`src/api/types/booking.ts`](./src/api/types/booking.ts) — booking and authentication types and response guards.
- [`src/test-data/bookingData.ts`](./src/test-data/bookingData.ts) — unique booking data factory.
- [`tests/ui/`](./tests/ui/) — UI test specifications.
- [`tests/api/`](./tests/api/) — API test specifications.
- [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — GitHub Actions workflow.
- [`playwright.config.ts`](./playwright.config.ts) — UI/API projects, base URLs, reporters, and test settings.
- [`package.json`](./package.json) and [`package-lock.json`](./package-lock.json) — npm scripts and dependency manifest/lockfile.
- [`AGENTS.md`](./AGENTS.md) and [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) — project instructions.
- [`AI_WORKLOG.md`](./AI_WORKLOG.md) — AI-assisted workflow notes and recorded mistakes.

## Test coverage

### Sauce Demo UI

The UI specifications are [`login.spec.ts`](./tests/ui/login.spec.ts) and [`shopping.spec.ts`](./tests/ui/shopping.spec.ts).

Login scenarios:

- A standard user can log in.
- A locked-out user is rejected.
- Incorrect credentials are rejected with an error.

Shopping and checkout scenarios:

- The catalog displays products with names and prices.
- Products can be sorted by ascending price.
- A selected product appears in the cart.
- A user can complete checkout and see the confirmation.
- Checkout requires customer details; the test submits an empty form and checks the validation feedback.

### Restful Booker API

The API scenarios are in [`booking.spec.ts`](./tests/api/booking.spec.ts):

- The lifecycle test authenticates, creates a booking, updates it, deletes it, and verifies that a subsequent GET returns not found.
- An update without authentication is rejected, and the booking remains unchanged.
- A delete without authentication is rejected, and the booking remains available.

Each test creates its own booking data and uses the ID returned by its create response. Once the authentication token and booking ID are available, the shared helper attempts cleanup in a `finally` block unless the booking has already been deleted. Cleanup failures are reported without replacing an earlier test failure.

## Setup and installation

### Prerequisites

- Node.js 22 or later, as specified by [`package.json`](./package.json).
- npm.

### Install dependencies and browser

From the repository root:

```sh
npm ci
npx playwright install chromium
```

On Linux, install the browser's system dependencies as well:

```sh
npx playwright install --with-deps chromium
```

### Configure environment variables

Create a local `.env` file by copying [`.env.example`](./.env.example). For example:

```sh
cp .env.example .env
```

Set the Restful Booker credentials in `.env` before running API tests. Do not commit `.env`; it is excluded by [`.gitignore`](./.gitignore). Do not put private credentials in this README or in source files.

| Variable | Required for | Description |
| --- | --- | --- |
| `UI_BASE_URL` | UI tests | Optional Sauce Demo base URL override; otherwise the Playwright configuration default is used. |
| `UI_USERNAME` | Authenticated UI tests | Used by the authenticated UI fixture for shopping scenarios; standalone login tests pass scenario credentials directly. |
| `UI_PASSWORD` | Authenticated UI tests | Used by the authenticated UI fixture for shopping scenarios; the successful standalone login test passes its public demo credential directly. The example file provides the public demo values. |
| `API_BASE_URL` | API tests | Optional Restful Booker base URL override; otherwise the Playwright configuration default is used. |
| `API_USERNAME` | API tests | Restful Booker username. Set locally in `.env`; for CI, configure a GitHub Actions Secret with this name. |
| `API_PASSWORD` | API tests | Restful Booker password. Set locally in `.env`; for CI, configure a GitHub Actions Secret with this name. |

The Playwright configuration loads `.env` locally. In GitHub Actions, add `API_USERNAME` and `API_PASSWORD` under the repository's **Settings → Secrets and variables → Actions**. The workflow passes them to the API test step as environment variables and does not upload `.env`.

## Running tests

Run these commands from the repository root:

| Purpose | Command |
| --- | --- |
| TypeScript type checking | `npm run typecheck` |
| UI tests | `npm run test:ui` |
| API tests | `npm run test:api` |
| All configured tests | `npm test` |
| Open the Playwright HTML report | `npm run test:report` |

Playwright writes its HTML report to `playwright-report/`. UI traces, screenshots, and videos are configured to be retained on failure; test output is written under `test-results/`.

## GitHub Actions

The workflow in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):

- Runs on every push and supports optional manual execution with `workflow_dispatch`.
- Sets up Node.js 22, installs dependencies with `npm ci`, and installs Chromium with system dependencies.
- Runs TypeScript type checking, the UI suite, and the API suite.
- Uploads `playwright-report/` and `test-results/` as a workflow artifact, including when checks fail. Artifacts are retained for 7 days.

The configured triggers do not include pull requests.

### Viewing CI results and artifacts

1. Open the repository on GitHub and select the **Actions** tab.
2. Select a run of the **QA Automation CI** workflow.
3. Review the job's individual steps to see their results and logs.
4. At the bottom of the workflow run page, find the **Artifacts** section and download `playwright-reports-and-test-results`.

The downloaded artifact contains:

- `playwright-report/` — the Playwright HTML report.
- `test-results/` — test results and available diagnostic materials, such as traces, screenshots, and videos for failed UI tests.

Artifacts are retained for 7 days.

## Limitations and excluded scenarios

- The UI project is configured for Chromium only; Firefox and WebKit are not configured.
- The API suite does not automate a malformed booking request that omits a required field. The API documentation marks booking fields as required but does not specify the error status or response body for that case; see the potential report below.
- The CI workflow is scoped to push and optional manual runs; it does not run on pull requests.
- Restful Booker is a public shared service, so availability and responses can vary.

## Bug reports

No confirmed application bugs are documented.

### Missing required booking field returns a server error

- **Reproduction steps:**
  1. Send `POST /booking` with an otherwise valid booking payload.
  2. Omit the `lastname` field.
  3. Inspect the response.
- **Expected result:** Documented requirement: `lastname` is required. Reasonable expected behavior: reject the request with a validation error rather than an internal server error; the documentation does not specify the exact status code or body.
- **Actual result:** Two live probes returned HTTP 500 with a plain-text `Internal Server Error` response and no booking ID.
- **Status:** Potential — the behavior was observed more than once, but the API documentation does not define the exact error response, so this is not recorded as a confirmed application bug.
