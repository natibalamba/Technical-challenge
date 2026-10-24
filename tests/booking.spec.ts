import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test(
  'Mandatory Test 4',
  async ({ page }) => {

    const homePage =
      new HomePage(page);

    await homePage.goto();

    await homePage.configureUsdEnvironment();

    await homePage.selectOneWay();

    await homePage.selectDestination(
      'San Andres',
      'San Andres, Colombia ADZ'
    );

    await homePage.selectDepartureDate();

    await homePage.selectAdults(2);
    await page.pause();

    await homePage.searchFlights();

    
  }
);