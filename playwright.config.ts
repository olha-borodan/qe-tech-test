import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  reporter: 'html',

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://restful-booker.herokuapp.com' },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://demoqa.com',
      },
    },
  ],
});