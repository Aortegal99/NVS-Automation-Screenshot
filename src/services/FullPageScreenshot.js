const puppeteer = require('puppeteer');
const path = require('path');
const config = require('../config');

class FullPageScreenshot {
  static async capture(page, url, suffix = '') {
    const sanitizedUrl = FullPageScreenshot.sanitizeUrl(url) + suffix;

    // Define the desktop and mobile viewports
    const desktopViewport = { width: 1440, height: 1080 };
    const mobileViewport = { width: 375, height: 667 };

    // Measure the total page height
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`Page height: ${pageHeight}px`);

    const viewportHeight = 14000; // Maximum viewport height for a single screenshot

    // Function to capture the full page for a given viewport
    async function captureForViewport(viewport, suffix = '') {
      await page.setViewport(viewport);
      if (pageHeight <= viewportHeight) {
        // Single screenshot for short pages
        const screenshotPath = path.join(config.screenshotPath, `${sanitizedUrl}${suffix}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Full-page screenshot saved at ${screenshotPath}`);
      } else {
        // Handle long pages with segmented screenshots
        console.log(`Page is taller than ${viewportHeight}px. Splitting into segments for ${viewport.width}x${viewport.height}.`);
        
        const numberOfParts = Math.ceil(pageHeight / viewportHeight);
        let offset = 0;
        const overlap = 2500; // Overlap between screenshots to avoid content loss

        for (let i = 0; i < numberOfParts; i++) {
          // Scroll to the appropriate position for each segment
          await page.evaluate((offset) => {
            window.scrollTo(0, offset);
          }, offset);

          // Wait for rendering (for smooth scroll and lazy loading)
          await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
          // Wait for lazy-loaded content

          // Take a screenshot of the current viewport portion
          const screenshotPath = path.join(config.screenshotPath, `${sanitizedUrl}${suffix}-part${i + 1}.png`);
          await page.screenshot({
            path: screenshotPath,
            clip: { x: 0, y: offset, width: viewport.width, height: viewportHeight }
          });
          console.log(`Saved part ${i + 1} at ${screenshotPath}`);

          // Move the scroll position down for the next part with overlap
          offset += viewportHeight - overlap; // Adjust the offset to create a slight overlap
        }
      }
    }

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    // Capture desktop screenshot
    await captureForViewport(desktopViewport, '-desktop');

    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

    // Capture mobile screenshot
    await captureForViewport(mobileViewport, '-mobile');
  }

  static sanitizeUrl(url) {
    let sanitizedPart = url.includes('@')
      ? url.split('@')[1]
      : url.replace(/https?:\/\//, '');

    // Replace '/' with '-' and remove any invalid filename characters
    sanitizedPart = sanitizedPart.replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '_');

    return sanitizedPart;
  }
}

module.exports = FullPageScreenshot;

