import { expect, Locator, Page } from '@playwright/test';

export class CountryLanguageComponent {
  readonly page: Page;
  readonly selectorButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.selectorButton = page.getByRole(
      'button',
      {
        name: /seleccionar país e idioma|select country and language/i
      }
    );
  }

  async waitForSelectorButton(): Promise<void> {
    await this.selectorButton.waitFor({
      state: 'visible',
      timeout: 15000
    });
  }

  async open(): Promise<void> {
    await this.waitForSelectorButton();

    await this.selectorButton.click();
  }

  async getCurrentConfiguration(): Promise<string> {
    await this.waitForSelectorButton();

    return (
      await this.selectorButton.getAttribute(
        'aria-label'
      )
    ) ?? '';
  }

  async isUsdEnglishEnvironment(): Promise<boolean> {
    const currentUrl = this.page.url();

    const ariaLabel =
      await this.getCurrentConfiguration();

    console.log(`Current URL: ${currentUrl}`);
    console.log(`Current locale: ${ariaLabel}`);

    return (
      ariaLabel.includes('USD') &&
      ariaLabel.includes('EN')
    );
  }

  async selectCountry(country: string): Promise<void> {
    await this.page
      .getByText(country, {
        exact: true
      })
      .click();
  }

  async selectLanguage(language: string): Promise<void> {
    await this.page
      .getByText(language, {
        exact: true
      })
      .click();
  }

  async clickConfirm(): Promise<void> {
    const confirmButton =
      this.page.getByRole('button', {
        name: /^confirm$/i
      });

    await expect(confirmButton).toBeVisible({
      timeout: 10000
    });

    await confirmButton.click();
  }

  async handleCountryPopup(): Promise<void> {
    const continueButton =
      this.page.getByText(
        /continuar en estados unidos|continue in united states/i
      );

    try {
      await continueButton.waitFor({
        state: 'visible',
        timeout: 10000
      });

      await continueButton.click();

      await this.page.waitForLoadState(
        'networkidle'
      );

      console.log(
        'United States confirmation popup handled'
      );

    } catch {
      console.log(
        'United States popup not displayed'
      );
    }
  }

  async validateUsdEnglishConfiguration(): Promise<void> {
    const ariaLabel =
      await this.getCurrentConfiguration();

    expect(ariaLabel).toContain('USD');
    expect(ariaLabel).toContain('EN');
  }

  async changeToUnitedStates(): Promise<void> {

    const alreadyConfigured =
      await this.isUsdEnglishEnvironment();

    if (alreadyConfigured) {

      console.log(
        'Site already configured as USD / EN'
      );

      return;
    }

    await this.open();

    await this.selectCountry(
      'United States'
    );

    await this.selectLanguage(
      'English'
    );

    await this.clickConfirm();

    await this.handleCountryPopup();

    await this.validateUsdEnglishConfiguration();
  }
}