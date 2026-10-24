import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.setTimeout(120000);

test.describe(
  'Test 1 - Passenger limits and infant rule',
  () => {

    test(
      'Should enforce one infant per adult rule',
      async ({ page }) => {

        const homePage = new HomePage(page);

        await homePage.goto();
        await homePage.configureUsdEnvironment();

        const passengersButton = page.getByRole(
          'button',
          { name: 'Select passengers' }
        );

        await passengersButton.click();

        const adultsPlus = page
          .getByRole('button', { name: 'Increase' })
          .first();

        const infantsPlus = page
          .getByRole('button', { name: 'Increase' })
          .nth(3);

        const adultsMinus = page
          .getByRole('button', { name: 'Decrease' })
          .first();

        const infantsMinus = page
          .getByRole('button', { name: 'Decrease' })
          .nth(3);

        await expect(adultsMinus).toBeDisabled();
        await expect(infantsMinus).toBeDisabled();

        await expect(adultsPlus).toBeEnabled();
        await expect(infantsPlus).toBeEnabled();

        for (let i = 0; i < 8; i++) {
          await adultsPlus.click();
        }

        await expect(
          page.getByRole('link', {
            name: 'check group travel.',
          })
        ).toBeVisible();

        for (let i = 0; i < 9; i++) {
          await infantsPlus.click();
        }

        await expect(
          infantsMinus
        ).toBeEnabled();

        await adultsMinus.click();

        await page
          .getByRole('button', {
            name: 'Confirm',
          })
          .click();
      }
    );
  }
);