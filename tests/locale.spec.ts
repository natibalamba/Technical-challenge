import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Country and Language Configuration', () => {

  test('Should switch to USD and English', async ({ page }) => {

    const homePage = new HomePage(page);

    await homePage.goto();

    await homePage.configureUsdEnvironment();

  });

});