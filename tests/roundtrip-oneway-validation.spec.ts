import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe(
  'Test 2 - Round Trip and One Way Validation',
  () => {

    test(
      'Should validate Round Trip and One Way behavior',
      async ({ page }) => {

        const homePage = new HomePage(page);

        await homePage.goto();
        await homePage.configureUsdEnvironment();

        const roundTripOption = page.getByRole(
          'radio',
          {
            name: 'Round trip',
          }
        );

        const returnField = page.getByRole(
          'button',
          {
            name: /return/i,
          }
        );

        const destinationField = page.getByRole(
          'combobox',
          {
            name: 'Destination',
          }
        );

        // Validate Round Trip by default

        await expect(
          roundTripOption
        ).toBeVisible();

        // Open Return calendar

        await returnField.click();

        await expect(
          page.locator(
            'button[data-name="dayCell"]'
          ).first()
        ).toBeVisible();

        // Switch to One Way

        await homePage.selectOneWay();

        await expect(
          page.getByText(
            /return|regreso|vuelta/i
          )
        ).toHaveCount(0);

        // Switch back to Round Trip

        await roundTripOption.click();

        await expect(
          returnField
        ).toBeVisible();

        // Destination selection

        await destinationField.click();

        await expect(
          destinationField
        ).toBeVisible();

        await destinationField.fill(
          'Buenos Aires'
        );

        const ezeOption = page.getByRole(
          'option',
          {
            name: /Buenos Aires.*EZE/i,
          }
        );

        await expect(
          ezeOption
        ).toBeVisible();

        await ezeOption.click();

        await expect(
          destinationField
        ).toHaveValue(
          /Buenos Aires/i
        );

        // Search without selecting dates

        await page
          .getByRole(
            'button',
            {
              name: 'Search',
            }
          )
          .click();

        const requiredMessages =
          page.getByText(
            /required/i
          );

        await expect(
          requiredMessages.first()
        ).toBeVisible();

        expect(
          await requiredMessages.count()
        ).toBeGreaterThanOrEqual(2);

      }
    );
  }
);