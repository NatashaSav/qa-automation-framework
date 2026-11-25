
# AI Agent Instructions

## 1. Project Overview

This is a QA Automation Framework built with:
- TypeScript
- Playwright Test
- Node.js

The project covers:

- UI testing of Sauce Demo.
- API testing of Restful Booker.
- Automated test execution through GitHub Actions.

The goal is to build a maintainable, reliable and readable automation framework following modern QA engineering practices.

## 2. Language

- All source code must be written in English.
- Test names must be written in English.
- Comments and documentation must be written in English.
- Commit messages must be written in English.
- Use clear and descriptive naming.

## 3. Target Applications

### 3.1 Sauce Demo

Base URL:
https://www.saucedemo.com

Primary test user:
standard_user

Credentials:
- Use environment variables for credentials.
- Public demo credentials may have documented defaults.
- Do not duplicate credentials across test files.
- Do not expose private secrets in source code.

Locators:
- Configure Playwright testIdAttribute as `data-test`.
- Prefer getByTestId(), getByRole(), getByLabel() and getByPlaceholder().
- Avoid brittle CSS selectors and XPath.
- Prefer user-facing locators when they provide reliable identification.

Do not assume the application is bug-free.
If actual behavior differs from expected behavior, investigate and report it instead of changing assertions just to make tests pass.

### 3.2 Restful Booker

Base URL:
https://restful-booker.herokuapp.com

API documentation:
https://restful-booker.herokuapp.com/apidoc

Important considerations:
- This is a public shared API.
- Data can be modified by other users.
- Responses may occasionally be slow or unstable.
- Verify actual API behavior before implementing assertions.
- Do not rely on assumptions about HTTP status codes or error response formats.
- Do not hardcode generated booking IDs.
- Use the ID returned by the create booking response.
- Protect authentication tokens and credentials.

## 4. Project Structure

Follow the existing project structure:

- `src/ui/pages/` - UI Page Object classes.
- `src/ui/fixtures/` - custom UI fixtures.
- `src/api/clients/` - reusable API request clients.
- `src/api/fixtures/` - custom API fixtures.
- `src/api/types/` - TypeScript interfaces and types.
- `src/test-data/` - reusable test data.
- `tests/ui/` - UI test specifications.
- `tests/api/` - API test specifications.
- `.github/workflows/` - GitHub Actions workflows.

Do not introduce alternative folder structures without a clear reason.

## 5. TypeScript and Coding Standards

- Use strict TypeScript.
- Avoid `any`. Prefer explicit types or `unknown`.
- Avoid unnecessary type assertions.
- Avoid non-null assertions unless justified.
- Use async/await consistently.
- Prefer const over let when reassignment is unnecessary.
- Use meaningful variable, function and class names.
- Keep functions focused and reasonably small.
- Avoid duplicated business logic.
- Prefer composition over unnecessary inheritance.
- Avoid overengineering and speculative abstractions.
- Handle errors explicitly where appropriate.
- Do not suppress TypeScript errors without justification.

Follow the principle:
Readable and maintainable code is more important than clever or overly abstract code.

## 6. Playwright UI Testing

### Architecture

- Use Playwright Test.
- Use built-in and custom fixtures where appropriate.
- Apply a lightweight Page Object Model.
- Keep page objects responsible for page interactions and page-specific locators.
- Keep test assertions primarily in test specifications.
- Avoid oversized page objects and unnecessary base classes.

Expected page objects:
- LoginPage
- InventoryPage
- CartPage
- CheckoutPage

### Locators and Assertions

- Prefer getByTestId(), getByRole(), getByLabel() and getByPlaceholder().
- Avoid brittle selectors and positional locators when a semantic locator is available.
- Use Playwright web-first assertions.
- Prefer auto-waiting and locator-based interactions.
- Never use page.waitForTimeout() for ordinary synchronization.
- Do not use arbitrary fixed delays.
- Do not use force clicks to hide real interaction problems.

### Test Independence

- Each test must be independently executable.
- Do not depend on test execution order.
- Avoid shared mutable state.
- Use unique test data when necessary.
- Cover positive, negative and boundary scenarios.
- Do not use test.only in committed code.

## 7. API Testing

- Use Playwright APIRequestContext.
- Keep HTTP request implementation in reusable API client classes.
- Keep business assertions in test specifications.
- Define explicit TypeScript types for request and response payloads.
- Validate both HTTP status codes and response bodies.
- Validate important response fields, not only response success.
- Handle authentication correctly.
- Obtain booking IDs dynamically from API responses.

### Booking CRUD Scenario

The main CRUD scenario must cover:

1. Authentication.
2. Creating a booking.
3. Updating the booking.
4. Deleting the booking.
5. Verifying that the booking no longer exists.

Keep this lifecycle in one test with descriptive test.step() sections.

Negative tests must remain independent.

### Cleanup

- Clean up resources created by tests.
- Use try/finally when necessary to guarantee cleanup.
- Ensure cleanup does not hide the original test failure.
- Do not delete resources that were not created by the current test.

### Reliability

- Limit API parallelism when necessary because the service is shared.
- Avoid unnecessary requests.
- Do not add automatic retries that can hide functional defects.
- Distinguish application failures from temporary infrastructure problems.

## 8. Test Data and Configuration

- Keep reusable test data in `src/test-data/`.
- Avoid shared mutable test data.
- Generate unique data when necessary.
- Use environment variables for configuration and credentials.
- Keep `.env` out of Git.
- Provide `.env.example` with variable names and safe example values.
- Avoid hardcoded environment-specific URLs across multiple files.

## 9. Bug Reporting

When actual application behavior differs from expected behavior:

- Do not silently change the assertion.
- Investigate whether the behavior is reproducible.
- Capture the actual result and relevant evidence.
- Document confirmed or potential bugs in README.md.
- Include steps to reproduce, expected result and actual result.
- Do not mark an issue as a confirmed application bug without sufficient evidence.

Do not use test.fail() automatically to hide known failures.

## 10. GitHub Actions and CI

- Run tests on push. Support workflow_dispatch for manual runs when requested. Add a pull_request trigger only when the assignment requires it.
- Install dependencies using npm ci.
- Install required Playwright browsers.
- Run TypeScript type checking.
- Execute UI and API tests.
- Generate Playwright HTML reports.
- Upload reports and useful failure artifacts.
- Preserve reports even when tests fail.
- Use CI-specific retries only when justified.
- Never expose secrets in workflow logs.

## 11. Code Quality

Before considering implementation complete:

- Run TypeScript type checking.
- Run relevant tests.
- Review changed files.
- Check for duplicated logic.
- Check for unused variables and unnecessary abstractions.
- Verify that test data is cleaned up.
- Ensure no secrets or generated files are committed.

Do not claim that checks passed unless they were actually executed.

## 12. AI Agent Workflow

Before implementing a task:

1. Inspect the existing project structure and relevant files.
2. Understand the requested scope.
3. Explain the proposed approach for significant changes.
4. Reuse existing utilities and conventions where appropriate.
5. Implement only the requested scope.
6. Run relevant checks.
7. Report changed files, test results and known limitations.

Do not rewrite working code without a clear reason.

Do not make architectural changes without explaining their purpose.

If requirements are ambiguous, ask for clarification instead of inventing assumptions.


## 13. Test execution and failure handling

You may run tests to validate your implementation.

If any test fails:
1. Stop and do not modify the code to fix the failure.
2. Analyze the failure and report the exact error.
3. Explain the likely cause and identify whether it appears to be a test issue, an application issue, or an environment issue.
4. Suggest a possible fix, but wait for my approval before making any changes.
5. Do not automatically rerun tests after making changes unless I approve those changes.

You may fix implementation issues only within the explicitly approved scope of the task. Do not make unrelated changes or weaken assertions just to make tests pass.


## 14. AI Worklog

- Record actual AI agent mistakes in AI_WORKLOG.md.
- Document what the agent suggested incorrectly.
- Explain how the issue was identified.
- Record the correction and the reasoning behind it.
- Include relevant prompts when useful.
- Never invent AI mistakes or claim that an issue occurred if it did not.
