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

        //
        // STEP 1
        // Validate Round Trip by default
        //

        const roundTripOption =
        page.getByRole(
            'radio',
            {
            name: 'Round trip',
            }
        );

        await expect(
          roundTripOption
        ).toBeVisible();

        //
        // STEP 2
        // Open Return calendar
        //

        const returnField =
          page.getByRole(
            'button',
            {
              name: /return/i,
            }
          );

        await returnField.click();

        const calendarDays =
          page.locator(
            'button[data-name="dayCell"]'
          );

        await expect(
          calendarDays.first()
        ).toBeVisible();

        //
        // STEP 3
        // Switch to One Way
        //

        await homePage.selectOneWay();

        await expect(
          page.getByText(
            /return|regreso|vuelta/i
          )
        ).toHaveCount(0);

        //
        // STEP 4
        // Switch back to Round Trip
        //

        await roundTripOption.click();

        await expect(
          returnField
        ).toBeVisible();

        //
        // STEP 5
        // Open destination dropdown
        //

        const destinationField =
          page.getByRole(
            'combobox',
            {
              name: 'Destination',
            }
          );

        await destinationField.click();

        await expect(
          destinationField
        ).toBeVisible();

        //
        // STEP 6
        // Select Buenos Aires EZE
        //

        await destinationField.fill(
          'Buenos Aires'
        );

        const ezeOption =
          page.getByRole(
            'option',
            {
              name: /Buenos Aires.*EZE/i,
            }
          );

        await expect(
          ezeOption
        ).toBeVisible();

        await ezeOption.click();

        const destinationValue =
          await destinationField.inputValue();

        expect(
          destinationValue
            .toLowerCase()
        ).toContain(
          'buenos aires'
        );

        //
        // STEP 7
        // Search without dates
        //

        const searchButton =
          page.getByRole(
            'button',
            {
              name: 'Search',
            }
          );

        await searchButton.click();

        const requiredMessages =
          page.getByText(
            /required/i
          );

        await expect(
          requiredMessages.first()
        ).toBeVisible();

        //
        // Validate two Required messages
        //

        const requiredCount =
          await requiredMessages.count();

        expect(
          requiredCount
        ).toBeGreaterThanOrEqual(2);

      }
    );
  }
);