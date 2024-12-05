const puppeteer = require('puppeteer');
const FullPageScreenshot = require('./services/FullPageScreenshot');
const VisibleScreenshot = require('./services/VisibleScreenshot');
const ScrollHelper = require('./utils/ScrollHelper');
const AccordionHelper = require('./utils/AccordionHelper');
const config = require('./config');

class ScreenshotManager {
  constructor(urls, accordionSelector = ".accordion__box-toggle") {
    this.urls = urls;
    this.accordionSelector = accordionSelector; 
  }

  async captureScreenshots() {
    const browser = await puppeteer.launch({
      headless: false,  // Set to true for headless mode
      args: ['--start-maximized'], // Start browser maximized
    });

    for (const url of this.urls) {
      console.log(`Processing URL: ${url}`);

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      console.log('Page loaded.');

      await this.closeCookieBanner(page);

      // Capture visible screenshots for both mobile and desktop views
      await VisibleScreenshot.capture(page, url);

      // Full-page screenshot with accordions closed
      console.log('Capturing full-page screenshot with accordions closed...');
      await ScrollHelper.scrollToEndOfPage(page);
      await FullPageScreenshot.capture(page, url);

      // Check if the page has accordions
      const accordions = await page.$$(this.accordionSelector);
      if (accordions.length > 0) {
        console.log('Expanding all accordions...');
        await AccordionHelper.openAllAccordions(page, this.accordionSelector);
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2500)));
        await ScrollHelper.scrollToEndOfPage(page); // Ensure all content is loaded
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1500)));

        // Full-page screenshot with accordions open
        console.log('Capturing full-page screenshot with accordions open...');
        await FullPageScreenshot.capture(page, `${url}-open`);
      } else {
        console.log('No accordions found on this page.');
      }

      await page.close();
    }

    await browser.close();
    console.log('All screenshots captured.');
  }

  // Function to hide the cookie banner using CSS injection
  async closeCookieBanner(page) {
    console.log("entro a cookie banner");
    try {
      const cookieButtonSelector = '#onetrust-accept-btn-handler';
      const button = await page.$(cookieButtonSelector);
      if (button) {
        await button.click();
        console.log('Cookie banner closed');
      }
    } catch (error) {
      console.log('No cookie banner or failed to close it:', error);
    }
  }


}

module.exports = ScreenshotManager;


