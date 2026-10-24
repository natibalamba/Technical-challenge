import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test(
  'Mandatory Test 4',
  async ({ page }) => {

    const homePage =
      new HomePage(page);

    await homePage.goto();

    await homePage.configureUsdEnvironment();

    // Step 2
    await homePage.selectOneWay();

    // Step 3
    await homePage.selectDestination();

    await page.pause();
  }
);