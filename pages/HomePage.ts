import { expect, Locator, Page } from '@playwright/test';
import { CountryLanguageComponent } from '../components/CountryLanguageComponent';

export class HomePage {
  readonly page: Page;
  readonly countryLanguage: CountryLanguageComponent;
  readonly oneWayOption: Locator;
  readonly returnField: Locator;
  readonly destinationField: Locator;
  readonly passengersButton: Locator;
  readonly increaseAdultsButton: Locator;
  readonly confirmPassengersButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.countryLanguage =
      new CountryLanguageComponent(page);

    this.oneWayOption =
      page.getByText(/one way|solo ida/i);

    this.returnField =
      page.getByText(/return|regreso|vuelta/i);

    this.destinationField =
      page.getByRole('combobox', {
        name: 'Destination',
      });

    this.passengersButton =
      page.getByRole('button', {
        name: 'Select passengers',
      });

    this.increaseAdultsButton =
      page.getByRole('button', {
        name: 'Increase',
      }).first();

    this.confirmPassengersButton =
      page.getByRole('button', {
        name: 'Confirm',
      });

    this.searchButton =
      page.getByRole('button', {
        name: 'Search',
      });
  }

  async goto(): Promise<void> {
    await this.page.goto(
      'https://www.avianca.com/en'
    );

    await this.page.waitForLoadState(
      'domcontentloaded'
    );
  }

  async acceptCookiesIfPresent(): Promise<void> {
    try {

      await this.page
        .getByRole('button')
        .filter({
          hasText: /accept|aceptar/i,
        })
        .first()
        .click();

    } catch {
      // Cookie banner not displayed
    }
  }

  async configureUsdEnvironment(): Promise<void> {
    await this.acceptCookiesIfPresent();
    await this.countryLanguage.changeToUnitedStates();
  }

  async selectOneWay(): Promise<void> {

    await this.oneWayOption.click();

    await expect(
      this.oneWayOption
    ).toContainText(/one way|solo ida/i);

    await expect(
      this.returnField
    ).toHaveCount(0);
  }

  async selectDestination(
    searchText: string,
    optionName: string
  ): Promise<void> {

    await this.destinationField.click();

    await this.destinationField.fill(
      searchText
    );

    await this.page
      .getByRole('option', {
        name: optionName,
      })
      .click();

    await expect(
      this.destinationField
    ).toHaveValue(
      new RegExp(searchText, 'i')
    );
  }

  async selectDepartureDate(): Promise<void> {

    const availableDates =
      this.page.locator(
        'button[data-name="dayCell"][aria-disabled="false"]'
      );

    await expect(
      availableDates.nth(1)
    ).toBeVisible();

    await availableDates.nth(1).click();
  }

  async selectAdults(
    targetAdults: number
  ): Promise<void> {

    for (
      let currentAdults = 1;
      currentAdults < targetAdults;
      currentAdults++
    ) {

      await this.increaseAdultsButton.click();
    }

    await this.confirmPassengersButton.click();

    await expect(
      this.passengersButton
    ).toContainText(
      targetAdults.toString()
    );
  }

  async searchFlights(): Promise<void> {

    await this.searchButton.click();

    await this.page.waitForLoadState(
      'networkidle'
    );

    expect(
      this.page.url()
    ).toContain(
      'booking/avail'
    );
  }
}