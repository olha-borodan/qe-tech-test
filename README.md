# corto-qe-assessment

Playwright test suite covering:

- **API** — [Restful-Booker](https://restful-booker.herokuapp.com), a public
  demo booking API.
- **UI** — [DemoQA](https://demoqa.com), a public demo site (book store and
  login flows).

Both projects are configured in [playwright.config.ts](playwright.config.ts)
and run against live, publicly hosted targets — no local server needed.

## Project structure

```
api/
  clients/     thin wrappers around each API endpoint
  data/        request payloads and test credentials
  fixtures/    Playwright fixtures (authClient, bookingClient, ...)
  types/       TypeScript types for API models
  tests/       *.spec.ts test files

ui/
  data/        test data for UI flows
  fixtures/    Playwright fixtures for page objects
  pages/       page object models
  tests/       *.spec.ts test files

docs/
  manual-testing.md               Postman exploration + API quirks found
  ai-assisted-testing-notes.md    notes on reviewing AI-drafted tests
```

## Setup

```
npm install
npx playwright install
```

## Running tests

```
npm test              # everything (api + ui)
npm run test:api      # api project only
npm run test:ui       # ui project only
```

Other useful Playwright flags, appended to any of the above via `--`:

```
npx playwright test --headed             # watch the browser (ui project)
npx playwright test booking-create       # run a single file by name
npx playwright test --debug              # step through interactively
```

## Reports

Every run produces an HTML report:

```
npx playwright show-report
```

Traces are captured on first retry, and UI runs additionally keep a
screenshot and video for failed tests — all under `playwright-report/` and
`test-results/`.

## CI

There's no CI pipeline wired up in this repo yet. If adding one (e.g.
GitHub Actions), a minimal workflow looks like:

```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Further reading

- [docs/manual-testing.md](docs/manual-testing.md) — Postman exploration
  done before automating, and the API quirks/inconsistencies it surfaced.
- [docs/ai-assisted-testing-notes.md](docs/ai-assisted-testing-notes.md) —
  what an AI-drafted test got wrong and how it was reviewed.
