import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test(
  'Mandatory Test 4',
  async ({ page }) => {

    const homePage =
      new HomePage(page);

    await homePage.goto();

    await homePage.configureUsdEnvironment();

    // STEP 2
    await homePage.selectOneWay();

    await page.pause();

  }
);