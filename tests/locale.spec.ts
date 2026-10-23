import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Country and Language Configuration', () => {
  test('Should switch to USD and English', async ({
  page,
}) => {
  const homePage = new HomePage(page);

  await homePage.goto();

  await homePage.acceptCookiesIfPresent();

  await homePage.countryLanguage.changeToUnitedStates();

  const ariaLabel =
    await homePage.countryLanguage.selectorButton.getAttribute(
      'aria-label'
    );

  console.log('Current configuration:', ariaLabel);

  expect(ariaLabel).toContain('USD');
  expect(ariaLabel).toContain('EN');
});
});