# Avianca Technical Challenge

## Overview

This project contains an automated end-to-end test for the Avianca booking flow using Playwright and TypeScript.

The objective was to automate critical user journeys on the Avianca website while applying automation engineering best practices focused on:

- Reusability
- Maintainability
- Readability
- Separation of concerns
- Dynamic data handling
- Business-rule validation first
- Minimal hardcoded values

The solution follows the Page Object Model (POM) design pattern and includes reusable methods for common user interactions.

Benefits:

- Centralized locators
- Reusable business actions
- Reduced duplication
- Improved maintainability
- Easier future enhancements

---
## Test Summary

| Test | Status |
|--------|--------|
| Country and Language Configuration | Passed |
| Test 1 - Passenger Limits | Passed |
| Test 2 - Round Trip / One Way Validation | Passed |
| Test 4 - Booking Flow | Passed Until Search |

---

## Technology Stack

- Playwright
- TypeScript
- Node.js

---

## Prerequisites

Before running the project, make sure the following software is installed:

Node.js (v18+ recommended)
npm
Playwright

---

## Installation

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Project Structure

```
.
├── components/
│   └── CountryLanguageComponent.ts
│
├── pages/
│   └── HomePage.ts
│
├── tests/
│   ├── booking.spec.ts
│   ├── locale.spec.ts 
│   ├── passenger-limits.spec.ts
│   └── roundtrip-oneway-validation.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```
---
## Running the Project

### Run all tests

```bash
npx playwright test
```

### Run all tests sequentially

```bash
npx playwright test --workers=1
```

### Run all tests in headed mode

```bash
npx playwright test --headed --workers=1
```

### Run a specific test:
Booking flow: npx playwright test tests/booking.spec.ts
Passenger limits: npx playwright test tests/passenger-limits.spec.ts
Round Trip / One Way validation: npx playwright test tests/roundtrip-oneway-validation.spec.ts
Locale validation: npx playwright test tests/locale.spec.ts

### Open Playwright UI

```bash
npx playwright test --ui
```

---

### Open HTML Report

Generate and open the HTML report:

```bash
npx playwright show-report
```

---

## Automated Test Coverage

### Test: Country and Language Configuration

Status: Automated
Validations:

- Country is configured as United States
- Language is configured as English
- Currency is configured as USD

---

### Test 1: Passenger Selection - Passenger Limits and One-Infant-per-Adult Rule

Status: Automated
Validations:
- Passenger selector opens successfully
- Default passenger controls are validated
- Maximum adult limit is enforced
- Maximum infant limit is enforced
- Group Travel warning is displayed
- One-infant-per-adult rule is enforced
- Passenger selection can be confirmed successfully

Business Rule Validated: 1 Adult = Maximum 1 Infant

---

### Test 2: Round-Trip and One-Way Booking Form Validation

Status: Automated
Validations:
- Round Trip selected by default
- Return field opens the calendar
- One Way selection hides Return field
- Round Trip restores Return field
- Destination selection works correctly
- Required messages are displayed when searching without dates

---

### Test 4: Booking Flow

Status: Automated UNTIL search submission
Validations:

- Locale configuration
- One Way trip
- Destination selection
- Dynamic departure date selection
- Passenger selection
- Passenger confirmation
- Search submission

Booking request successfully generated:

```text
booking/avail
```

Example generated parameters:

```text
tripType=one-way
to=ADZ
nbAdults=2
language=EN
pointOfSale=US
```

---

## Design Decisions

### Page Object Model

Page Objects were implemented to separate test logic from UI interactions.

Example:

```ts
await homePage.selectDestination(
  'San Andres',
  'San Andres, Colombia ADZ'
);
```

---

### Dynamic Passenger Selection

Reusable methods were created for passenger selection.

Example:

```ts
await homePage.selectAdults(2);
```

Future scenarios can reuse:

```ts
await homePage.selectAdults(4);
```

without modifying framework code.

---

### Dynamic Date Selection

Departure dates are selected dynamically from available dates in the calendar.

Example:

```ts
button[data-name="dayCell"][aria-disabled="false"]
```

This reduces maintenance compared to hardcoded dates.

---

## CI/CD

The framework was designed to support CI/CD execution with minimal changes.

Recommended pipeline:

```bash
npm ci
npx playwright install --with-deps
npx playwright test
```

Example GitHub Actions workflow:

```yaml
name: Playwright Tests

on:
  push:
    branches:
      - master

  pull_request:
    branches:
      - master

jobs:
  e2e-tests:

    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm ci

      - run: npx playwright install --with-deps

      - run: npx playwright test

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Assumptions

The following assumptions were used during implementation:

- Origin airport is preconfigured by Avianca.
- Locale required by the challenge is:
  - United States
  - English
  - USD
- Calendar opens automatically after destination selection.
- Passenger selector opens automatically after departure date selection.
- Passenger defaults are:
  - 1 Adult
  - 0 Youth
  - 0 Children
  - 0 Infants

---

## Known Limitations

### Imperva Security Layer

Avianca uses Imperva as a security protection layer.

After the booking request is submitted, automated traffic may be blocked and redirected to an Access Denied page.

Example:

```text
Error Code 15
```

Evidence collected during execution demonstrates that:

- Search request is successfully generated
- Booking URL is correctly constructed
- Parameters are correctly transmitted

The booking request is successfully generated and validated by the automation. Any subsequent blocking occurs at Avianca's security layer and is outside the scope of the automated implementation.

---

## Future Improvements

- Results page automation
- Flight selection automation
- Fare selection automation
- API validations
- Service layer implementation
- Environment configuration management
- Advanced reporting
- Complete CI/CD integration

---

## Notes

The primary goal of this implementation was to prioritize maintainability, reusability, scalability, and validation of business rules while keeping the solution aligned with the challenge requirements.