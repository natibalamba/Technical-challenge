import { expect, Locator, Page } from '@playwright/test';
import { CountryLanguageComponent } from '../components/CountryLanguageComponent';

export class HomePage {
  readonly page: Page;

  readonly countryLanguage: CountryLanguageComponent;

  // Step 2
  readonly oneWayOption: Locator;
  readonly returnField: Locator;

  // Step 3
  readonly destinationField: Locator;
  readonly sanAndresOption: Locator;

  constructor(page: Page) {
    this.page = page;

    this.countryLanguage =
      new CountryLanguageComponent(page);

    // Step 2
    this.oneWayOption = page.getByText(
      /one way|solo ida/i
    );

    this.returnField = page.getByText(
      /return|regreso|vuelta/i
    );

    // Step 3
    this.destinationField = page.getByRole(
      'combobox',
      {
        name: 'Destination',
      }
    );

    this.sanAndresOption = page.getByRole(
      'option',
      {
        name: 'San Andres, Colombia ADZ',
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

      await cookieButton.waitFor({
        state: 'visible',
        timeout: 5000,
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

    await this.page.waitForTimeout(
      2000
    );

    await this.countryLanguage
      .changeToUnitedStates();
  }

  /**
   * STEP 2
   * Select One Way
   */
  async selectOneWay(): Promise<void> {
    console.log(
      'Selecting One Way'
    );

    await expect(
      this.oneWayOption
    ).toBeVisible();

    await this.oneWayOption.click();

    console.log(
      'One Way clicked'
    );

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

  /**
   * STEP 3
   * Select destination
   */
  async selectDestination(): Promise<void> {
    console.log(
      'Selecting destination ADZ'
    );

    await expect(
      this.destinationField
    ).toBeVisible();

    await this.destinationField.click();

    await this.destinationField.fill(
      'San Andres'
    );

    await expect(
      this.sanAndresOption
    ).toBeVisible();

    await this.sanAndresOption.click();

    await this.validateDestinationSelected();
  }

  async validateDestinationSelected(): Promise<void> {

    const destinationValue =
      await this.destinationField.inputValue();

    console.log(
      `Destination field value: ${destinationValue}`
    );

    expect(
      destinationValue.toLowerCase()
    ).toContain(
      'san andres'
    );

    expect(
      destinationValue.toUpperCase()
    ).toContain(
      'ADZ'
    );

    console.log(
      'Destination validated'
    );
  }
}