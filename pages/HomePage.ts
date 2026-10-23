import { expect, Locator, Page } from '@playwright/test';
import { CountryLanguageComponent } from '../components/CountryLanguageComponent';

export class HomePage {
  readonly page: Page;

  readonly countryLanguage: CountryLanguageComponent;

  readonly oneWayOption: Locator;
  readonly returnField: Locator;

  constructor(page: Page) {
    this.page = page;

    this.countryLanguage =
      new CountryLanguageComponent(page);

    this.oneWayOption = page.getByText(
      /one way|solo ida/i
    );

    this.returnField = page.getByText(
      /return|regreso|vuelta/i
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

      console.log('Cookie banner accepted');
    } catch {
      console.log('Cookie banner not displayed');
    }
  }

  async configureUsdEnvironment(): Promise<void> {
    await this.acceptCookiesIfPresent();

    await this.page.waitForTimeout(2000);

    await this.countryLanguage.changeToUnitedStates();
  }

  /**
 * STEP 2
 * Select One Way
 */
async selectOneWay(): Promise<void> {

  console.log('Selecting One Way');

  await expect(
    this.oneWayOption
  ).toBeVisible();

  await this.oneWayOption.click();

  console.log('One Way clicked');

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

}