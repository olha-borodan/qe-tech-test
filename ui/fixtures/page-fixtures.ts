import { test as base } from '@playwright/test';
import { BookDetailPage } from '../pages/book-detail-page';
import { BooksPage } from '../pages/books-page';
import { LoginPage } from '../pages/login-page';

type PageFixtures = {
  bookStorePage: BooksPage;
  bookDetailPage: BookDetailPage;
  loginPage: LoginPage;
};

export const test = base.extend<PageFixtures>({
  bookStorePage: async ({ page }, use) => {
    await use(new BooksPage(page));
  },
  bookDetailPage: async ({ page }, use) => {
    await use(new BookDetailPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';