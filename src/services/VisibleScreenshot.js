const fs = require('fs');
const path = require('path');
const config = require('../config');

class VisibleScreenshot {
  static async capture(page, url) {
    const sanitizedUrl = this.sanitizeUrl(url);

    // Desktop visible screenshot
    await page.setViewport({ width: 1440, height: 1080 });
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    const desktopVisiblePath = path.join(config.screenshotPath, `${sanitizedUrl}-desktop-visible.png`);
    await page.screenshot({ path: desktopVisiblePath });
    console.log(`Desktop visible screenshot saved at ${desktopVisiblePath}`);

    // Mobile visible screenshot
    await page.setViewport({ width: 375, height: 667 });
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    const mobileVisiblePath = path.join(config.screenshotPath, `${sanitizedUrl}-mobile-visible.png`);
    await page.screenshot({ path: mobileVisiblePath });
    console.log(`Mobile visible screenshot saved at ${mobileVisiblePath}`);
  }

  static sanitizeUrl(url) {
    return url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_');
  }
}

module.exports = VisibleScreenshot;