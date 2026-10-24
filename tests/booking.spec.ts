import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test(
  'Mandatory Test 4',
  async ({ page }) => {

    const homePage = new HomePage(page);

    await homePage.goto();

    await homePage.configureUsdEnvironment();

    // STEP 2
    await homePage.selectOneWay();

    // STEP 3
    await homePage.selectDestination(
      'San Andres',
      'San Andres, Colombia ADZ'
    );

    // STEP 4
    await homePage.selectDepartureDate();

    // STEP 5
    await homePage.selectAdults(2);

    // STEP 6
    await homePage.searchFlights();

    console.log(
      'Current URL:',
      page.url()
    );

    await page.screenshot({
      path: 'search-results.png',
      fullPage: true
    });

    await page.pause();
  }
);