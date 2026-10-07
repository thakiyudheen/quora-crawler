const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const path = require("path");

puppeteer.use(StealthPlugin());

async function extractQuoraHtml(targetUrl) {
  let browser;
  try {
    const isProduction = process.env.NODE_ENV === "production";

    browser = await puppeteer.launch({
      headless: isProduction ? true : false,
      userDataDir: path.join(__dirname, "..", "..", "chrome_session"),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--lang=en-US",
        "--window-size=1280,800",
        "--disable-blink-features=AutomationControlled",
        ...(isProduction
          ? ["--disable-dev-shm-usage", "--single-process", "--no-zygote"]
          : []),
      ],
      ignoreDefaultArgs: ["--enable-automation"],
    });

    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    await page.setViewport({ width: 1280, height: 800 });

    // Attempt to bypass some basic bot blocks
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    console.log(`Navigating to ${targetUrl}...`);
    // Timeout set to 60s
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log("Waiting briefly for page load...");
    await new Promise(r => setTimeout(r, 2000));

    // Extract the full HTML of the page
    const htmlContent = await page.evaluate(() => document.documentElement.outerHTML);

    return htmlContent;

  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed successfully.");
    }
  }
}

module.exports = {
  extractQuoraHtml
};
