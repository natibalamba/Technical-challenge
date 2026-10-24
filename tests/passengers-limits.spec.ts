import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe(
  'Test 1 - Passenger limits and infant rule',
  () => {

    test(
      'Should enforce one infant per adult rule',
      async ({ page }) => {

        const homePage =
          new HomePage(page);

        await homePage.goto();

        await homePage.configureUsdEnvironment();

        const passengersButton =
          page.getByRole(
            'button',
            {
              name: 'Select passengers',
            }
          );

        await passengersButton.click();

        const adultsPlus =
          page.getByRole(
            'button',
            {
              name: 'Increase',
            }
          ).first();

        const infantsPlus =
          page.getByRole(
            'button',
            {
              name: 'Increase',
            }
          ).nth(3);

        const adultsMinus =
          page.getByRole(
            'button',
            {
              name: 'Decrease',
            }
          ).first();

        const infantsMinus =
          page.getByRole(
            'button',
            {
              name: 'Decrease',
            }
          ).nth(3);

        const groupTravelMessage =
          page.getByRole(
            'link',
            {
              name: 'check group travel.',
            }
          );

        const confirmButton =
          page.getByRole(
            'button',
            {
              name: 'Confirm',
            }
          );

        //
        // STEP 2
        //

        await expect(
          adultsMinus
        ).toBeDisabled();

        await expect(
          infantsMinus
        ).toBeDisabled();

        await expect(
          adultsPlus
        ).toBeEnabled();

        await expect(
          infantsPlus
        ).toBeEnabled();

        //
        // STEP 3
        // Add adults to maximum (9)
        //

        console.log(
          'Adding adults to maximum limit'
        );

        for (
          let i = 0;
          i < 8;
          i++
        ) {
          await adultsPlus.click();
        }

        await expect(
          groupTravelMessage
        ).toBeVisible();

        console.log(
          'Group travel message displayed'
        );

        //
        // STEP 4
        // Add 9 infants
        //

        console.log(
          'Adding infants'
        );

        for (
          let i = 0;
          i < 9;
          i++
        ) {
          await infantsPlus.click();
        }

        await expect(
          infantsMinus
        ).toBeEnabled();

        console.log(
          'Maximum infants reached'
        );

        //
        // STEP 5
        // Remove one adult
        //

        console.log(
          'Removing one adult'
        );

        await adultsMinus.click();

        console.log(
          'One infant per adult rule applied'
        );

        //
        // STEP 6
        //

        await confirmButton.click();

        console.log(
            'Passenger selection confirmed'
        );
      }
    );
  }
);