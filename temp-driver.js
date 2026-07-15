const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("file:///E:/mistora/project/%E5%AE%98%E7%BD%911/index.html");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "screenshot.png", fullPage: true });
  console.log("Screenshot saved to screenshot.png");
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.waitForTimeout(500);
  if (errors.length > 0) {
    console.log("Console errors:", errors);
  } else {
    console.log("No console errors");
  }
  await browser.close();
})();
