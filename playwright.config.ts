import { devices, PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const config: PlaywrightTestConfig = {
  testDir: './e2e/tests',
  timeout: 4 * 60 * 1000,
  expect: {
    timeout: 40 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : 1,
  retries: 0,
  reporter: process.env.CI ? [['junit', { outputFile: 'results.xml' }], ['html']] : [['html']],
  use: {
    baseURL: `${process.env.BAHMNI_URL_DEV}`,
    storageState: 'e2e/storageState.json',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chromium'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
};

export default config;
