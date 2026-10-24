# Avianca Technical Challenge

## Overview

This project contains an automated end-to-end test for the Avianca booking flow using Playwright and TypeScript.

The automation covers the mandatory booking scenario requested in the challenge and follows the Page Object Model (POM) design pattern to improve maintainability, scalability, and readability.

---

## Technology Stack

- Playwright
- TypeScript
- Node.js

---

## Project Structure

```text
.
├── components/
│   └── CountryLanguageComponent.ts
│
├── pages/
│   └── HomePage.ts
│
├── tests/
│   ├── booking.spec.ts
│   └── locale.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Test Scenario Implemented

### Locale Configuration

Validate and configure:

- Country: United States
- Language: English
- Currency: USD

### Booking Flow

The automated scenario performs the following actions:

1. Open Avianca website
2. Accept cookies
3. Configure locale to USD / EN
4. Select One Way trip
5. Validate Return field is hidden
6. Search and select destination:
   - San Andres, Colombia (ADZ)
7. Select departure date
8. Select 2 adults
9. Confirm passenger selection
10. Search flights

---

## Design Decisions

### Page Object Model (POM)

The framework follows the Page Object Model pattern.

Benefits:

- Centralized locator management
- Better maintainability
- Reduced test duplication
- Easier future enhancements
- Improved readability

### Dynamic Destination Selection

Destination selection was implemented as a reusable method:

```ts
await homePage.selectDestination(
  'San Andres',
  'San Andres, Colombia ADZ'
);
```

### Dynamic Passenger Selection

Passenger selection was designed to support future scalability:

```ts
await homePage.selectAdults(2);
```

Future scenarios could use:

```ts
await homePage.selectAdults(3);
```

```ts
await homePage.selectAdults(4);
```

without modifying framework code.

### Dynamic Date Handling

Departure dates are selected dynamically from available calendar dates instead of relying on hardcoded values.

Example locator:

```ts
button[data-name="dayCell"][aria-disabled="false"]
```

This minimizes maintenance as calendar dates change over time.

---

## Running The Project

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

Run all tests:

```bash
npx playwright test
```

Run booking scenario only:

```bash
npx playwright test tests/booking.spec.ts
```

Run in headed mode:

```bash
npx playwright test tests/booking.spec.ts --headed
```

Run Playwright UI:

```bash
npx playwright test --ui
```

---

## Challenges Encountered

### Imperva Security Layer

The booking search request is successfully submitted and redirected to Avianca's booking endpoint.

Example generated URL:

```text
https://booking.avianca.com/av/booking/avail
```

However, Avianca occasionally triggers Imperva security protections that may block automated traffic and display:

```text
Access Denied
Error Code 15
```

This behavior occurs after the booking request has already been submitted.

Evidence collected during execution confirms:

- Search request generated successfully
- Parameters populated correctly
- Destination transmitted correctly
- Departure date transmitted correctly
- Passenger count transmitted correctly
- Locale transmitted correctly

This limitation is external to the automation implementation.

---

## Assumptions & Limitations

### Assumptions

The automation was developed under the following assumptions:

- A valid origin airport is already provided by the application.
- The destination used in the challenge is:
  - San Andres, Colombia (ADZ)
- The required locale configuration is:
  - Country: United States
  - Language: English
  - Currency: USD
- Passenger defaults are:
  - 1 Adult
  - 0 Youth
  - 0 Children
  - 0 Infants
- The departure calendar is automatically displayed after destination selection.
- The passengers selector is automatically displayed after departure date selection.

### Dynamic Behavior Assumptions

To improve maintainability:

- Destination selection accepts configurable values.
- Passenger selection accepts configurable quantities.
- Departure date selection avoids hardcoded dates.

### Known Limitations

#### Imperva Security Rules

Avianca uses Imperva Web Application Firewall protections.

In some executions, Imperva may block access to flight results after the booking request is generated.

This is not related to locator stability or test execution flow.

#### Dynamic UI Components

The application relies heavily on asynchronous rendering and dynamic elements.

Changes in:

- Calendar rendering
- Passenger modal behavior
- Search results rendering
- Security protection rules

may require locator maintenance in future releases.

#### Departure Date Strategy

The framework currently selects the next available departure date rather than a fixed date.

This improves test stability but means the selected date may vary depending on the execution day.

---

## CI/CD

Although CI/CD was not implemented as part of this challenge, the framework was designed to support continuous integration with minimal changes.

### Recommended Pipeline

Install dependencies:

```bash
npm ci
```

Install Playwright:

```bash
npx playwright install --with-deps
```

Run tests:

```bash
npx playwright test
```

Generate reports:

```bash
npx playwright show-report
```

---

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches:
      - main
      - master

  pull_request:
    branches:
      - main
      - master

jobs:

  e2e-tests:

    runs-on: ubuntu-latest

    steps:

      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test

      - name: Upload Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Dependency Injection Considerations

The framework uses constructor injection for Playwright's Page object.

Example:

```ts
constructor(page: Page) {
  this.page = page;
}
```

Benefits:

- Separation of concerns
- Easier maintenance
- Easier testing
- Better reusability
- Reduced coupling

This approach aligns with Dependency Injection principles while keeping the project lightweight.

Future improvements could include:

- Test data providers
- Service layers
- Environment providers
- Full dependency injection container implementation

---

## Future Improvements

- Results Page implementation
- Cheapest flight selection
- Cheapest fare selection
- Booking completion flow
- API validation layer
- Network interception validations
- CI/CD deployment pipeline
- Environment management
- Test data management
- Custom reporting
- Parallel execution strategy
- Retry strategy for external security restrictions

---

## Notes

The primary objective of this implementation was to prioritize maintainability, readability, reusability, and robustness while keeping the solution aligned with the challenge requirements.

Whenever possible, hardcoded values were replaced with reusable methods and dynamic selectors to reduce future maintenance effort.