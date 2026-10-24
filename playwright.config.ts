import { defineConfig } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  fullyParallel: false,

  workers: 1,

  retries: 1,

  use: {
    headless: false,

    launchOptions: {
      slowMo: 200,
    },

    screenshot: 'only-on-failure',

    trace: 'retain-on-failure',
  },

  reporter: [
    ['html'],
    ['list'],
  ],

});