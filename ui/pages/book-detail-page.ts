import { Locator, Page } from '@playwright/test';

export class BookDetailPage {
  readonly page: Page;
  readonly isbnLabel: Locator;
  readonly titleLabel: Locator;
  readonly subTitleLabel: Locator;
  readonly authorLabel: Locator;
  readonly publisherLabel: Locator;
  readonly totalPagesLabel: Locator;
  readonly descriptionLabel: Locator;
  readonly websiteLabel: Locator;
  readonly backToStoreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.isbnLabel = page.getByText('ISBN:', { exact: true });
    this.titleLabel = page.getByText('Title :', { exact: true });
    this.subTitleLabel = page.getByText('Sub Title :', { exact: true });
    this.authorLabel = page.getByText('Author :', { exact: true });
    this.publisherLabel = page.getByText('Publisher :', { exact: true });
    this.totalPagesLabel = page.getByText('Total Pages :', { exact: true });
    this.descriptionLabel = page.getByText('Description :', { exact: true });
    this.websiteLabel = page.getByText('Website :', { exact: true });
    this.backToStoreButton = page.getByRole('button', {
      name: 'Back To Book Store',
    });
  }

  getTitle(title: string): Locator {
    return this.page.getByText(title, { exact: true });
  }

  getAuthor(author: string): Locator {
    return this.page.getByText(author, { exact: true });
  }

  async clickBackToStore() {
    await this.backToStoreButton.click();
  }
}