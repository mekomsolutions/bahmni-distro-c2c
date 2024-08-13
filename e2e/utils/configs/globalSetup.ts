import * as dotenv from 'dotenv';
import {
  APIRequestContext,
  Page,
  PlaywrightWorkerArgs,
  WorkerFixture,
  request,
  test as base
}
  from '@playwright/test';

dotenv.config();

export const BAHMNI_URL = `${process.env.TEST_ENVIRONMENT}` == 'uat' ? `${process.env.BAHMNI_URL_UAT}` : `${process.env.BAHMNI_URL_DEV}`;
export const ODOO_URL = `${process.env.TEST_ENVIRONMENT}` == 'uat' ? `${process.env.ODOO_URL_UAT}` : `${process.env.ODOO_URL_DEV}`;

async function globalSetup() {
  const requestContext = await request.newContext();
  const token = Buffer.from(`${process.env.BAHMNI_USERNAME}:${process.env.BAHMNI_PASSWORD}`).toString(
    'base64',
  );
  await requestContext.post(`${process.env.BAHMNI_URL_DEV}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  });
  await requestContext.storageState({ path: 'tests/storageState.json' });
  await requestContext.dispose();
}

export const api: WorkerFixture<APIRequestContext, PlaywrightWorkerArgs> = async ({ playwright }, use) => {
  const ctx = await playwright.request.newContext({
    baseURL: `${process.env.BAHMNI_URL_DEV}/`,
    httpCredentials: {
      username: process.env.BAHMNI_USERNAME ?? "",
      password: process.env.BAHMNI_PASSWORD ?? "",
    },
  });

  await use(ctx);
};

export interface CustomTestFixtures {
  loginAsAdmin: Page;
}

export interface CustomWorkerFixtures {
  api: APIRequestContext;
}

export const test = base.extend<CustomTestFixtures, CustomWorkerFixtures>({
  api: [api, { scope: 'worker' }],
});

export default globalSetup;
