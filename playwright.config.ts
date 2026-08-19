import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'api',
      testDir: './api/tests',
      use: { baseURL: 'https://restful-booker.herokuapp.com' },
    },
    {
      name: 'ui',
      testDir: './ui/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://demoqa.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
});