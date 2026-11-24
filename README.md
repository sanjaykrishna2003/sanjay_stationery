# Sanjay Stationery - Checkout and Browser Test Suite

I built a small single-page checkout app for an Indian stationery store (**Sanjay Stationery**) using plain HTML, CSS, and vanilla JavaScript, along with three end-to-end Playwright tests.

## Requirements

- Node.js (v18 or newer recommended)
- npm

## Setup

1. Install the project dependencies:
   ```bash
   npm install
   ```
2. Install the Chromium browser used by Playwright:
   ```bash
   npx playwright install chromium
   ```

## Running the App

Start the local static server:

```bash
npm start
```

Then open `http://localhost:3000` in your browser. All state lives in memory, so refreshing the page clears the cart and order confirmation.

## Running the Tests

Playwright starts the local server on `http://localhost:3000` automatically via `webServer` in `playwright.config.js`.

- **Run all tests (headless):**
  ```bash
  npm test
  ```
- **Run tests in a visible browser window (headed):**
  ```bash
  npm run test:headed
  ```
- **Open the HTML test report:**
  ```bash
  npm run report
  ```

## Screenshots and Test Evidence

- Failure screenshots are saved automatically under `test-results/` when a test fails (`screenshot: 'only-on-failure'`).
- The HTML report is generated in `playwright-report/`.
- Manual test notes and run results go in `RESULTS.md`, and any bugs found can be logged using `DEFECT_REPORT.md`.
