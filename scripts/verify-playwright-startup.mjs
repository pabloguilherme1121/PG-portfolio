import { chromium, firefox, webkit } from "@playwright/test";

for (const browserType of [chromium, firefox, webkit]) {
  let browser;
  try {
    browser = await browserType.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("data:text/html,<title>Browser ready</title>");
    const title = await page.title();
    if (title !== "Browser ready") {
      throw new Error(`${browserType.name()} started but page navigation failed`);
    }
    console.log(`Playwright ${browserType.name()}: launched and navigated successfully`);
  } finally {
    if (browser) await browser.close();
  }
}
