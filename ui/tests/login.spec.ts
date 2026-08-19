import { test, expect } from '../fixtures/page-fixtures';

test.describe('Login Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login page displays username and password fields', async ({ loginPage }) => {
    await expect(loginPage.usernameInput, 'username input should be visible').toBeVisible();
    await expect(loginPage.passwordInput, 'password input should be visible').toBeVisible();
    await expect(loginPage.loginButton, 'login button should be visible').toBeVisible();
  });

  test('invalid credentials show an error message', async ({ loginPage }) => {
    await loginPage.login('invalidUser', 'invalidPass');

    await expect(
      loginPage.errorMessage,
      'error message should be displayed for invalid credentials',
    ).toBeVisible();
  });

  test('valid credentials open the profile page', async ({ loginPage, page }) => {
    const username = process.env.BOOKSTORE_USERNAME;
    const password = process.env.BOOKSTORE_PASSWORD;

    if (!username || !password) {
      test.skip(true, 'BOOKSTORE_USERNAME and BOOKSTORE_PASSWORD are not set');
      return;
    }

    await loginPage.login(username, password);
    await expect(page, 'should navigate to profile page after login')
      .toHaveURL(/.*\/profile/);
  });
});