# AI Work Log

## 1. Tooling

- **AI tool:** GitHub Copilot Agent mode
- **IDE:** Visual Studio Code
- **Model:** GPT-6 Luna (Copilot Fusion)

## 2. Agent Instructions

- **Instruction files:**
  - `AGENTS.md`
  - `.github/copilot-instructions.md`

- **Key rules:**
  - Use Playwright best practices and web-first assertions instead of fixed waits.
  - Report application bugs without weakening or changing test assertions to make tests pass.
  - Keep the Page Object Model lightweight and avoid unnecessary abstractions.
  - Follow the existing project structure and TypeScript strict typing.
  - Verify changes by running relevant checks and tests.

  - **How instruction compliance was verified:** I asked Copilot to inspect the instruction files and summarize the project rules. I also checked its proposed changes against the instructions and verified the modified files manually.

## 3. Key Prompts

### 1. Project Configuration Review

**Goal:** Review the existing project configuration and instructions before implementation.

**Prompt:**

Before making any changes, review the current project configuration and instructions.

Read:
- AGENTS.md
- .github/copilot-instructions.md
- package.json
- tsconfig.json
- playwright.config.ts
- .gitignore

Tasks:

1. Summarize the project's current architecture and configuration.
2. Identify potential configuration issues, inconsistencies, or missing settings.
3. Check compatibility between the installed TypeScript version, module configuration, and package.json.
4. Review Playwright configuration for UI and API testing.
5. Identify missing configuration required by our project requirements.
6. Check whether any existing project instructions conflict with each other.

Important constraints:
- Do not modify, create, or delete any files.
- Do not install additional dependencies.
- Do not generate test code.
- Do not make assumptions without explaining them.
- Follow the repository instructions.

For every finding, provide:
- File name and relevant setting.
- Why it might be a problem.
- Whether it is critical or optional.
- Your recommended solution.

At the end, list the checks that should be performed before implementation begins.

**Result:** Copilot reviewed the project instructions and configuration files, summarized the existing setup, and identified potential issues and checks to perform before implementation. No files were modified during this review.

### 2. UI Automation Implementation Plan

**Goal:** Prepare and review a minimal implementation plan for the Sauce Demo UI automation tests before making any changes.

**Prompt:**

We are starting the UI automation implementation for Sauce Demo (user: standard_user).

**Task:** Propose a minimal implementation plan. Do NOT create, modify, or delete any files yet. Wait for my approval.

### Before planning

- Read `AGENTS.md`, `.github/copilot-instructions.md`, the existing project structure, and relevant configuration files.
- Follow the existing project conventions.
- Do not rely on memory about the site's behavior. Where an expectation matters, mark it as "to verify on the real site".

### Scope

- Playwright Test + TypeScript.
- Lightweight Page Object Model (no base classes).
- 5–7 main tests covering login, product catalog, sorting, cart, and checkout happy path.
- 2–3 negative or boundary tests (e.g. invalid credentials, locked-out user, checkout with empty required fields).
- Tests must be independent.
- Implement a reusable authenticated fixture in `src/ui/fixtures/testFixtures.ts` that performs login through the UI and provides an authenticated page for tests that require an existing session.
- Keep login tests separate and allow them to use the standard Playwright `page` fixture.
- Ensure each test has an isolated browser context and independent application state. Do not share mutable state between tests.
- Avoid unnecessary fixture layers or abstractions.

### The plan must contain

**1. Files**

For each proposed file, explain its responsibility and why it is needed. Include the proposed Page Objects, fixture, test files, and test data where appropriate. Do not propose files that are not clearly necessary.

**2. Test list**

Provide a table with:

- Test name
- Steps
- Key assertions
- Positive or negative/boundary scenario

Ensure the proposed tests cover all assignment requirements without unnecessary duplication.

**3. Configuration**

Review the existing `playwright.config.ts`.

Identify only necessary changes, explain why they are needed, and explicitly state if no changes are required. Do not rewrite or restructure the existing configuration without a clear reason.

**4. Test data and credentials**

Explain where users, products, and checkout data should live. Keep credentials in environment variables and do not expose secrets. Avoid creating separate data files unless they provide clear value.

**5. Risks and open questions**

Identify assumptions that need verification on the real site, potential application bugs, and any implementation risks.

### Constraints

- No overengineering or unnecessary abstractions.
- No `waitForTimeout` or fixed waits.
- Use Playwright web-first assertions.
- Prefer semantic locators and the configured `data-test` test ID attribute.
- Use English in all code, comments, documentation, and test names.
- Do not implement anything until I explicitly approve the plan.

Wait for my approval before making any changes.

**Result:** Copilot proposed a UI implementation plan covering the required files, Page Objects, authenticated fixture, test scenarios, configuration, test data, and risks. The plan was reviewed and approved before implementation started.

### 3. Page Objects and Authenticated Fixture

**Goal:** Implement the UI Page Objects and reusable authenticated fixture as the first implementation step.

**Prompt:**

The plan is approved. Start implementation with **Step 1: Page Objects and the authenticated fixture only**.

Create the following files:

- `src/ui/pages/LoginPage.ts`
- `src/ui/pages/InventoryPage.ts`
- `src/ui/pages/CartPage.ts`
- `src/ui/pages/CheckoutPage.ts`
- `src/ui/fixtures/testFixtures.ts`

Requirements:
- Follow `AGENTS.md` and `.github/copilot-instructions.md`.
- Use the lightweight Page Object Model described in the approved plan. Do not introduce a base page class.
- Keep locators and page interactions inside the relevant Page Object classes.
- Use semantic locators and configured `data-test` attributes where appropriate.
- Implement a reusable `authenticatedPage` fixture that logs in through the UI using the existing `page` fixture and credentials from environment variables.
- Keep the implementation simple and avoid unnecessary abstractions.
- Do not create test files yet.
- Do not modify `playwright.config.ts` or other existing files unless absolutely necessary. If a change is necessary, explain why before making it.
- Use English for all code, comments, and names.
- Do not use fixed waits or `waitForTimeout`.

After implementation:
1. Explain the responsibility of each created file.
2. Explain how the `authenticatedPage` fixture works.
3. Run `npm run typecheck` and report the actual result.
4. List any assumptions about the real site's locators or behavior that still need verification.

Do not proceed to writing tests until I review and approve this step.

**Result:** Copilot implemented the four Page Objects and the reusable authenticated fixture. The fixture performs login through the UI using credentials from environment variables. The implementation was reviewed before moving to the test-writing step.

### 4. UI Test Implementation

**Goal:** Implement the planned independent UI tests using the existing Page Objects and authenticated fixture.

**Prompt:**

Implement **Step 2: UI test files only**, based on the approved plan and the existing Page Objects and fixture.

Before implementation:
- Read `AGENTS.md` and `.github/copilot-instructions.md`.
- Review all existing files in `src/ui/pages/` and `src/ui/fixtures/`.
- Follow the approved test plan and existing project conventions.

### Files to create

1. `tests/ui/login.spec.ts`
2. `tests/ui/shopping.spec.ts`

### Test scenarios

Implement exactly these 7 independent tests:

**login.spec.ts**
1. `standard user can log in` — use the standard Playwright `page` fixture and verify successful login.
2. `invalid credentials show a login error` — use invalid credentials and verify that login fails and an error message is displayed.

**shopping.spec.ts**
3. `authenticated user can view the product catalog` — use `authenticatedPage` and verify that the catalog contains products with readable names and prices.
4. `products can be sorted by price from low to high` — use `authenticatedPage`, select ascending price sorting, and verify that displayed prices are in ascending numeric order.
5. `selected product appears in the cart` — add a specific product to the cart, open the cart, and verify that the selected product is present.
6. `user can complete checkout` — add a product, proceed through the cart and checkout using valid customer details, finish the order, and verify the confirmation state.
7. `checkout requires customer details` — add a product, open the cart, proceed to checkout, submit the empty form, and verify that checkout does not advance and validation feedback appears.

### Implementation requirements

- Import `test` and `expect` from the existing `src/ui/fixtures/testFixtures.ts` in both test files.
- Use the existing Page Objects and `authenticatedPage` fixture wherever appropriate.
- Keep login tests separate from authenticated shopping tests.
- Use independent test data; do not depend on execution order or shared mutable state.
- Use Playwright web-first assertions (`expect`) for verification.
- Parse product prices as numbers before checking their order; do not compare price strings lexicographically.
- Use meaningful and sufficiently specific assertions. Avoid checking only that an element exists when its content or state can be verified.
- Use stable semantic locators and the configured `data-test` attribute.
- Do not use fixed waits, `waitForTimeout`, forced clicks, or unnecessary retries.
- Do not duplicate page interactions directly in tests when an existing Page Object method already provides them.
- Do not introduce new Page Objects, fixtures, base classes, helpers, or data files unless there is a clear technical reason.
- Do not modify existing Page Objects, fixtures, `playwright.config.ts`, `package.json`, or other existing files in this step. If you discover a necessary change, stop and explain the reason before making it.
- Use English for test names, code, and comments.

### After implementation

1. Summarize the two created files and the tests implemented.
2. Run `npm run typecheck` and report the actual result.
3. Do not run the full test suite yet.
4. List any assumptions about locators or site behavior that still need verification.
5. Do not modify `AI_WORKLOG.md` unless an actual agent mistake occurred and was corrected.

Do not proceed to CI, API tests, or README changes. Wait for my review and approval of Step 2.

**Result:** Copilot created the two UI test files using the existing Page Objects and fixture. During test execution, two locator issues were identified and corrected. The complete UI test suite was subsequently run and all 8 tests passed.

### 5. API Automation Implementation Plan

**Goal:** Plan a minimal Restful Booker API test implementation before coding.

**Prompt summary:** Copilot was asked to inspect the project instructions, configuration, structure, and API test setup, then propose the files and tests for authentication, the booking lifecycle, negative scenarios, test data, assertions, and risks. No files could be changed before approval.

**Result:** Copilot returned a plan only. No files were changed at this stage.

### 6. API Contract Verification

**Goal:** Verify Restful Booker behavior before implementing assertions.

**Prompt summary:** Copilot was asked to verify the authentication response and token format; unauthenticated update and delete behavior; missing-required-field creation behavior; deleted-booking lookup; cleanup behavior; and environment-variable handling. This was a read-only verification stage.

**Result:** The auth endpoint returned a JSON token, used in a `Cookie: token=<token>` header. Probes observed HTTP 403 for unauthenticated updates and deletes, and HTTP 404 when fetching a deleted booking. Repeated probes omitting `lastname` returned HTTP 500; the API documentation marks the field required but does not define the exact validation response. No files were changed.

### 7. API Implementation

**Goal:** Implement the approved Restful Booker API tests.

**Prompt summary:** The approved scope allowed creating `src/api/types/booking.ts`, `src/api/clients/bookingApiClient.ts`, `src/api/fixtures/apiFixtures.ts`, `src/test-data/bookingData.ts`, and `tests/api/booking.spec.ts`, and modifying `.env.example` only to add the `API_USERNAME` and `API_PASSWORD` variable names. The prompt required Playwright `APIRequestContext`, TypeScript, the booking lifecycle, two independent unauthenticated mutation tests, cookie-token authentication, isolated data, cleanup that preserves the original failure, and no new dependencies or unrelated changes.

**Result:** The five API implementation files were created and `.env.example` was updated as authorized. TypeScript type checking passed. The first API test run stopped before making requests because the API credential environment variables were unavailable. A later API-only run, with the variables available, passed all 3 tests. No API test run in GitHub Actions is claimed.

### 8. API Implementation Review

**Goal:** Review the API implementation without changing files.

**Prompt summary:** Copilot was asked to check instruction compliance, authentication and cookie handling, test independence, cleanup, assertions, sensitive-data exposure, abstractions, and authorized scope.

**Result:** The review found that cleanup diagnostics included raw response content, creating a potential sensitive-data logging risk. This was reported for correction; no files were changed during the review.

### 9. Sensitive Logging Correction

**Goal:** Remove response content from API cleanup diagnostics while preserving useful failure information.

**Prompt summary:** Copilot was authorized to modify only `tests/api/booking.spec.ts`. The prompt required removing raw response bodies from logs and annotations, retaining operation and status details, and preserving the original test failure when cleanup also failed.

**Result:** Cleanup diagnostics now report the DELETE operation and HTTP status, or that no response was received. Raw response bodies and arbitrary exception messages are not emitted. Cleanup failures remain secondary to an earlier test failure. TypeScript type checking passed and the API suite passed all 3 tests after this change.

### 10. CI Implementation Plan

**Goal:** Propose a minimal GitHub Actions workflow before implementation.

**Prompt summary:** Copilot inspected project instructions, npm scripts, Playwright configuration, environment handling, and test setup. It was asked for a plan covering push and manual triggers, Node.js, `npm ci`, Chromium, type checking, UI/API tests, GitHub Secrets, and artifact upload. No files could be changed before approval.

**Result:** Copilot proposed a single-job workflow plan only; no files were changed during planning.

### 11. CI Workflow Implementation

**Goal:** Implement the approved GitHub Actions workflow.

**Prompt summary:** The approved prompt authorized creating only `.github/workflows/ci.yml`. It specified `actions/checkout@v4`, `actions/setup-node@v4` with Node.js 22, `npm ci`, Chromium installation with system dependencies, type checking, UI and API tests, API credentials from GitHub Actions Secrets, report/test-result artifact upload with `if: always()` and seven-day retention, and `contents: read` permissions. Triggers were push and `workflow_dispatch`; a `pull_request` trigger was explicitly excluded.

**Result:** `.github/workflows/ci.yml` was created with the approved steps, triggers, permissions, and artifact configuration. The workflow was subsequently executed successfully on GitHub Actions. All 8 UI tests and all 3 API tests passed. During artifact review, I discovered that the API test run overwrote the UI HTML report because both suites used the same output directory. This reporting issue was addressed separately in Prompt 16.

### 12. Final Repository Review

**Goal:** Compare the repository with the original QA automation assignment.

**Prompt summary:** Copilot was asked to perform a read-only review of coverage, documentation, configuration, test quality, and security, without running tests or changing files.

**Result:** The review identified that `README.md` was missing and that the project CI instructions still required a `pull_request` trigger, which the assignment did not require. No files were changed during this review.

### 13. CI and Instruction Alignment Review

**Goal:** Align CI trigger guidance with the assignment and existing workflow.

**Prompt summary:** Copilot was asked to verify push execution, manual dispatch, type checking, both test suites, artifact upload, and API Secrets handling. It was authorized to update `AGENTS.md` only if its CI trigger guidance conflicted with the assignment.

**Result:** The workflow already met the requested CI behavior and was not changed. The duplicated CI trigger guidance in AGENTS.md and .github/copilot-instructions.md was updated to require push runs, allow manual runs, and make pull-request triggers assignment-dependent. I reviewed the Git diff and confirmed that only the intended CI instruction lines were changed in those two files, with no unrelated modifications. The workflow was subsequently executed successfully on GitHub Actions.

### 14. README Creation

**Goal:** Document the framework based on repository contents and the take-home assignment.

**Prompt summary:** Copilot was asked to create only `README.md`, covering the overview, structure, actual UI/API coverage, setup, environment variables, commands, CI, limitations, and bug-report format. The prompt prohibited inventing test results, coverage, or bugs.

**Result:** `README.md` was created from the inspected source and configuration. It records the missing-`lastname` response as a potential issue, not a confirmed bug. No tests were run for this documentation change.

### 15. README Accuracy Review

**Goal:** Correct README statements that needed more precise wording against the source.

**Prompt summary:** Copilot was asked to check whether the successful login test uses environment variables or direct credentials, qualify API cleanup guarantees, and distinguish the documented required-field rule from expected validation behavior and observed HTTP 500 responses. Only `README.md` could be changed.

**Result:** Only README wording was updated. It now distinguishes credentials passed directly by the standalone login tests from those read by the authenticated fixture, limits the cleanup statement to cases where the token and booking ID are available, and keeps the missing-field report classified as Potential because the exact error contract is undocumented. No tests were run.

### 16. Separate UI and API HTML Reports

**Goal:** Configure separate Playwright HTML reports for UI and API test runs and include both reports in the existing GitHub Actions artifact.

**Prompt summary:** Copilot was asked to inspect the existing Playwright configuration and GitHub Actions workflow, then make only the changes strictly necessary to generate separate UI and API HTML reports. The prompt explicitly prohibited changes to test implementation files, Page Objects, fixtures, API code, test data, documentation, package files, and unrelated CI settings. It also required preserving the existing test commands, workflow triggers, permissions, execution order, environment variables, and artifact retention period.

**Result:** Only `playwright.config.ts` was modified. The HTML reporter now uses `playwright-report/ui` for UI tests and `playwright-report/api` for API tests, based on the npm lifecycle event. TypeScript type checking passed, all 8 UI tests and all 3 API tests passed, and both HTML report files were generated successfully locally. The updated configuration still needs to be verified in a new GitHub Actions run.

## 4. AI Mistakes and Corrections

Only actual mistakes identified during development are documented here.

### 1. Copilot used outdated information about the instruction file location

- **What the agent did:** The agent incorrectly reported that `.github/copilot-instructions.md` did not exist, although the file had already been moved to the correct location.
- **How I noticed:** I checked the file location using terminal commands and confirmed that the file existed at `.github/copilot-instructions.md`.
- **Fix:** I started a new Copilot chat and asked the agent to inspect the file directly. The agent then correctly identified the file and summarized its instructions.
- **Location:** `.github/copilot-instructions.md`

### 2. Copilot modified a file outside the authorized scope

- **What the agent did:** I explicitly instructed Copilot to modify only `tests/ui/login.spec.ts`. However, it also modified `src/ui/pages/InventoryPage.ts` by changing the Products locator.
- **How I noticed:** Copilot mentioned the additional change in its response. I inspected the file manually using the terminal and confirmed that the locator had been changed.
- **Fix:** I reviewed the unauthorized change separately instead of accepting it automatically. I reviewed the additional change and kept it after verifying that the locator was appropriate.
- **Location:** `src/ui/pages/InventoryPage.ts`

### 3. Copilot used incorrect locators in shopping tests

- **What the agent did:** Copilot used an incorrect test ID (`cart-item`) to locate products in the cart and an incorrect `heading` role to locate the "Checkout: Your Information" text.
- **How I noticed:** Two shopping tests failed. I inspected the Playwright error context files and page snapshots. The snapshots showed that the product was present in the cart and the checkout title was rendered as text, not as a heading.
- **Fix:** I asked Copilot to inspect the actual page structure and correct only the two identified locators. It replaced `cart-item` with `inventory-item` and used `getByText()` for the checkout title. Both previously failing tests passed after the changes.
- **Location:** `src/ui/pages/CartPage.ts`, `tests/ui/shopping.spec.ts`

## 5. Engineering Decisions

Document important technical decisions made during development and briefly explain why they were chosen.

- **UI architecture:** Use four focused Page Objects and an authenticated-page fixture rather than a base page class or shared mutable browser state.
- **API client and types:** Use Playwright `APIRequestContext`, a small reusable booking client, and explicit booking/authentication types without adding dependencies.
- **API authentication:** Read API credentials from environment variables and send the returned token in the documented `Cookie: token=<token>` header.
- **Isolated API data and cleanup:** Generate a unique booking value per test. Attempt cleanup in `finally` once the token and returned booking ID are available; report cleanup failure without replacing an earlier test failure.
- **Cleanup diagnostics:** Report the cleanup operation and HTTP status, but omit response bodies and arbitrary exception messages to reduce sensitive-data exposure.
- **CI scope:** Use one minimal workflow on push with optional `workflow_dispatch`, and do not add a pull-request trigger unless an assignment requires one.
- **Potential API behavior:** Record the observed missing-`lastname` HTTP 500 as Potential because the field is documented as required but its exact validation response is unspecified.
- **Separate HTML reports:** Generate UI and API HTML reports in separate directories (`playwright-report/ui` and `playwright-report/api`) based on the npm lifecycle event. This prevents the API test run from overwriting the UI report when both suites execute in the same CI workflow.
