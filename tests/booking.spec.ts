import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test(
  'Mandatory Test 4',
  async ({ page }) => {

    const homePage =
      new HomePage(page);

    await homePage.goto();

    await homePage.configureUsdEnvironment();

    const ariaLabel =
      await homePage.countryLanguage
        .getCurrentConfiguration();

    console.log(
      `Current locale configuration: ${ariaLabel}`
    );

    expect(ariaLabel).toContain('USD');
    expect(ariaLabel).toContain('EN');

    // Próximos pasos:
    // await homePage.selectOneWay();
    // await homePage.selectDestination('San Andres');
    // await homePage.selectAvailableDate();
    // await homePage.selectTwoAdults();
    // await homePage.searchFlights();

  }
);