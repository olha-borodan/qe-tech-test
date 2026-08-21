import { Page, Locator } from '@playwright/test';

export class BooksPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly bookCells: Locator;
  readonly leftMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Type to search');
    this.bookCells = page.getByRole('cell').filter({ has: page.getByRole('link') });
    this.leftMenu = page.locator('.left-pannel');
  }

  async goto() {
    await this.page.goto('/books');
    await this.bookCells.first().waitFor({ state: 'visible' });
  }

  async search(term: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(term);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async clickFirstBook() {
    await this.bookCells.first().getByRole('link').click();
  }

  async getBookCount() {
    return this.bookCells.count();
  }

  getBookLink(bookTitle: string): Locator {
    return this.page.getByRole('link', { name: bookTitle });
  }

  getMenuItemLocator(item: string): Locator {
    return this.leftMenu.getByText(item, { exact: true });
  }
}