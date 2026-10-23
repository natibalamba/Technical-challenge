import { Locator, Page } from '@playwright/test';
import { CountryLanguageComponent } from '../components/CountryLanguageComponent';

export class HomePage {
  readonly page: Page;

  readonly countryLanguage: CountryLanguageComponent;

  readonly oneWayButton: Locator;
  readonly destinationField: Locator;
  readonly departureField: Locator;
  readonly passengersButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.countryLanguage =
      new CountryLanguageComponent(page);

    this.oneWayButton = page.getByText(
      /one way/i
    );

    this.destinationField = page.locator(
      '[data-testid="destination"]'
    );

    this.departureField = page.locator(
      '[data-testid="departure-date"]'
    );

    this.passengersButton =
      page.getByText(/passengers/i);

    this.searchButton =
      page.getByRole('button', {
        name: /search/i
      });
  }

  async goto(): Promise<void> {
    await this.page.goto(
      'https://www.avianca.com/en'
    );

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await this.page.waitForTimeout(3000);
  }

  async acceptCookiesIfPresent(): Promise<void> {
    try {

      const cookieButton = this.page
        .getByRole('button')
        .filter({
          hasText: /accept|aceptar/i
        })
        .first();

      await cookieButton.waitFor({
        state: 'visible',
        timeout: 5000
      });

      await cookieButton.click();

      console.log(
        'Cookie banner accepted'
      );

    } catch {

      console.log(
        'Cookie banner not displayed'
      );
    }
  }

  async configureUsdEnvironment(): Promise<void> {

    await this.acceptCookiesIfPresent();

    await this.page.waitForTimeout(3000);

    await this.countryLanguage.changeToUnitedStates();
  }
}