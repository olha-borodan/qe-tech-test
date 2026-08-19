import { test, expect } from '../fixtures/page-fixtures';
import { bookStoreData } from '../data/book-store-data';

test.describe('Book Detail Page', () => {
  test.beforeEach(async ({ bookStorePage }) => {
    await bookStorePage.goto();
    await bookStorePage.clickFirstBook();
  });

  test('book detail labels are visible', async ({ bookDetailPage }) => {
    await expect(bookDetailPage.isbnLabel, 'ISBN label should be visible').toBeVisible();
    await expect(bookDetailPage.titleLabel, 'Title label should be visible').toBeVisible();
    await expect(bookDetailPage.authorLabel, 'Author label should be visible').toBeVisible();
    await expect(bookDetailPage.publisherLabel, 'Publisher label should be visible').toBeVisible();
    await expect(bookDetailPage.backToStoreButton, 'Back To Book Store button should be visible').toBeVisible();
  });

  test('book details contain the expected book', async ({ bookDetailPage }) => {
    await expect(
      bookDetailPage.getTitle(bookStoreData.book.title),
      'book title should be displayed',
    ).toBeVisible();
    await expect(
      bookDetailPage.getAuthor(bookStoreData.book.author),
      'book author should be displayed',
    ).toBeVisible();
  });

  test('back button returns to book store', async ({ bookDetailPage, bookStorePage }) => {
    await bookDetailPage.clickBackToStore();

    await expect(bookStorePage.page, 'should navigate back to book store')
      .toHaveURL(/.*\/books/);

    await expect(
      bookStorePage.bookCells.first(),
      'first book should be visible after navigating back',
    ).toBeVisible();

    const count = await bookStorePage.getBookCount();
    expect(count, 'book list should be visible after navigating back').toBeGreaterThan(0);
  });
});