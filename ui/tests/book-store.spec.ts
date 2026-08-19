import { test, expect } from '../fixtures/page-fixtures';
import { bookStoreData } from '../data/book-store-data';

test.describe('Book Store - Landing Page', () => {
  test.beforeEach(async ({ bookStorePage }) => {
    await bookStorePage.goto();
  });

  test('book list loads with books visible', async ({ bookStorePage }) => {
    await expect(
      bookStorePage.bookCells.first(),
      'book list should display books',
    ).toBeVisible();
  });

  test('main menu items are visible', async ({ bookStorePage }) => {
    for (const item of bookStoreData.menuItems) {
      await expect(
        bookStorePage.getMenuItemLocator(item),
        `menu item "${item}" should be visible`,
      ).toBeVisible();
    }
  });
});

test.describe('Book Store - Search', () => {
  test.beforeEach(async ({ bookStorePage }) => {
    await bookStorePage.goto();
  });

  test('search returns results for a valid term', async ({ bookStorePage }) => {
    await bookStorePage.search(bookStoreData.search.validTerm);

    await expect(
      bookStorePage.bookCells.first(),
      'search should return at least one result',
    ).toBeVisible();
    await expect(
      bookStorePage.getBookLink(bookStoreData.search.expectedResult),
      'expected book should appear in search results',
    ).toBeVisible();
  });

  test('search returns no results for an invalid term', async ({ bookStorePage }) => {
    await bookStorePage.search(bookStoreData.search.invalidTerm);

    await expect(
      bookStorePage.bookCells,
      'search should return no results for invalid term',
    ).toHaveCount(0);
  });

  test('clearing search restores the full book list', async ({ bookStorePage }) => {
    const initialCount = await bookStorePage.bookCells.count();

    await bookStorePage.search(bookStoreData.search.validTerm);
    await expect(bookStorePage.bookCells.first()).toBeVisible();
    const filteredCount = await bookStorePage.bookCells.count();

    await bookStorePage.clearSearch();
    await expect(bookStorePage.bookCells).toHaveCount(initialCount);
    const restoredCount = await bookStorePage.bookCells.count();

    expect(filteredCount, 'search should filter the list').toBeLessThan(initialCount);
    expect(restoredCount, 'clearing search should restore full list').toBe(initialCount);
  });
});