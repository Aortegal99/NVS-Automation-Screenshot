const fs = require('fs');
const path = require('path');
const config = require('../config');

class FullPageScreenshot {
  static async capture(page, url) {
    const sanitizedUrl = this.sanitizeUrl(url);

    // Desktop full-page screenshot
    await page.setViewport({ width: 1440, height: 1080 });
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    const desktopFullPath = path.join(config.screenshotPath, `${sanitizedUrl}-desktop-fullpage.png`);
    await page.screenshot({ path: desktopFullPath, fullPage: true });
    console.log(`Desktop full-page screenshot saved at ${desktopFullPath}`);

    // Mobile full-page screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2500)));
    const mobileFullPath = path.join(config.screenshotPath, `${sanitizedUrl}-mobile-fullpage.png`);
    await page.screenshot({ path: mobileFullPath, fullPage: true });
    console.log(`Mobile full-page screenshot saved at ${mobileFullPath}`);
  }

  static sanitizeUrl(url) {
    return url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_');
  }
}

module.exports = FullPageScreenshot;
