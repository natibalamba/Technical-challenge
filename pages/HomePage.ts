import { expect, Locator, Page } from '@playwright/test';
import { CountryLanguageComponent } from '../components/CountryLanguageComponent';

export class HomePage {
  readonly page: Page;

  readonly countryLanguage: CountryLanguageComponent;

  // STEP 2
  readonly oneWayOption: Locator;
  readonly returnField: Locator;

  // STEP 3
  readonly destinationField: Locator;

  // STEP 4
  readonly departureButton: Locator;

  // STEP 5
  readonly passengersButton: Locator;
  readonly increaseAdultsButton: Locator;

  // STEP 6
  readonly confirmPassengersButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.countryLanguage =
      new CountryLanguageComponent(page);

    // STEP 2
    this.oneWayOption = page.getByText(
      /one way|solo ida/i
    );

    this.returnField = page.getByText(
      /return|regreso|vuelta/i
    );

    // STEP 3
    this.destinationField = page.getByRole(
      'combobox',
      {
        name: 'Destination',
      }
    );

    // STEP 4
    this.departureButton = page.getByRole(
      'button',
      {
        name: 'Departure',
      }
    );

    // STEP 5
    this.passengersButton = page.getByRole(
      'button',
      {
        name: 'Select passengers',
      }
    );

    this.increaseAdultsButton =
      page.getByRole('button', {
        name: 'Increase',
      }).first();

    // STEP 6
    this.confirmPassengersButton =
      page.getByRole('button', {
        name: 'Confirm',
      });

    this.searchButton = page.getByRole(
      'button',
      {
        name: 'Search',
      }
    );
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
          hasText: /accept|aceptar/i,
        })
        .first();

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

    await this.page.waitForTimeout(
      2000
    );

    await this.countryLanguage
      .changeToUnitedStates();
  }

  // ==========================
  // STEP 2
  // ==========================

  async selectOneWay(): Promise<void> {

    console.log(
      'Selecting One Way'
    );

    await expect(
      this.oneWayOption
    ).toBeVisible();

    await this.oneWayOption.click();

    await this.validateOneWaySelected();

    await this.validateReturnFieldNotDisplayed();
  }

  async validateOneWaySelected(): Promise<void> {

    const text =
      await this.oneWayOption.textContent();

    console.log(
      `Selected trip type: ${text}`
    );

    expect(
      ['One way', 'Solo ida']
    ).toContain(
      text?.trim()
    );

    console.log(
      'One Way validated'
    );
  }

  async validateReturnFieldNotDisplayed(): Promise<void> {

    await expect(
      this.returnField
    ).toHaveCount(0);

    console.log(
      'Return field validation completed'
    );
  }

  // ==========================
  // STEP 3
  // ==========================

  async selectDestination(
    searchText: string,
    optionName: string
  ): Promise<void> {

    console.log(
      `Selecting destination: ${optionName}`
    );

    await expect(
      this.destinationField
    ).toBeVisible();

    await this.destinationField.click();

    await this.destinationField.fill(
      searchText
    );

    const destinationOption =
      this.page.getByRole('option', {
        name: optionName,
      });

    await expect(
      destinationOption
    ).toBeVisible();

    await destinationOption.click();

    await this.validateDestinationSelected(
      searchText
    );
  }

  async validateDestinationSelected(
    expectedDestination: string
  ): Promise<void> {

    const destinationValue =
      await this.destinationField.inputValue();

    console.log(
      `Destination field value: ${destinationValue}`
    );

    expect(
      destinationValue.toLowerCase()
    ).toContain(
      expectedDestination.toLowerCase()
    );

    console.log(
      'Destination validated'
    );
  }

  // ==========================
  // STEP 4
  // ==========================

  async selectDepartureDate(): Promise<void> {

    console.log(
      'Selecting first available departure date'
    );

    const availableDates =
      this.page.locator(
        'button[data-name="dayCell"][aria-disabled="false"]'
      );

    const totalDates =
      await availableDates.count();

    console.log(
      `Available dates found: ${totalDates}`
    );

    if (totalDates === 0) {

      throw new Error(
        'No available departure dates found'
      );
    }

    const selectedDate =
      await availableDates
        .first()
        .getAttribute('data-date');

    console.log(
      `Selected date: ${selectedDate}`
    );

    await availableDates.first().click();

    console.log(
      'Departure date validated'
    );
  }

  // ==========================
  // STEP 5
  // ==========================

  async selectAdults(
    targetAdults: number
  ): Promise<void> {

    console.log(
      `Selecting ${targetAdults} adults`
    );

    await expect(
      this.increaseAdultsButton
    ).toBeVisible();

    let currentAdults = 1;

    while (currentAdults < targetAdults) {

      await this.increaseAdultsButton.click();

      currentAdults++;

      console.log(
        `Adults selected: ${currentAdults}`
      );
    }

    await this.confirmPassengers();

    await this.validateAdultsSelected(
      targetAdults
    );
  }

  async confirmPassengers(): Promise<void> {

    console.log(
      'Confirming passenger selection'
    );

    await expect(
      this.confirmPassengersButton
    ).toBeVisible();

    await this.confirmPassengersButton.click();
  }

  async validateAdultsSelected(
    expectedAdults: number
  ): Promise<void> {

    const passengersText =
      await this.passengersButton.textContent();

    console.log(
      `Passengers selector: ${passengersText}`
    );

    expect(
      passengersText
    ).toContain(
      expectedAdults.toString()
    );

    console.log(
      `${expectedAdults} adults validated`
    );
  }

  // ==========================
  // STEP 6
  // ==========================

  async searchFlights(): Promise<void> {

    console.log(
      'Searching flights'
    );

    await expect(
      this.searchButton
    ).toBeVisible();

    await expect(
      this.searchButton
    ).toBeEnabled();

    await this.searchButton.scrollIntoViewIfNeeded();

    await this.searchButton.click();

    await this.page.waitForLoadState(
      'networkidle'
    );

    console.log(
      'Flight search triggered successfully'
    );
  }
}