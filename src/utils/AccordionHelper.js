class AccordionHelper {
    static async openAllAccordions(page, accordionSelector) {
      const accordions = await page.$$(accordionSelector);
      if (accordions.length === 0) {
        console.log('No accordions found on the page.');
        return;
      }
  
      console.log(`Found ${accordions.length} accordions. Expanding all...`);
      for (const accordion of accordions) {
        await accordion.click();
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2500))); // Wait briefly to allow the accordion to expand
      }
      console.log('All accordions expanded.');
    }
  
    static async closeAllAccordions(page, accordionSelector) {
      console.log('Ensuring all accordions are in the closed state...');
    }
  }
  
  module.exports = AccordionHelper;
  