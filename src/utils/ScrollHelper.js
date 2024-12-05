class ScrollHelper {
  static async scrollToEndOfPage(page) {
    await page.evaluate(async () => {
      const distance = 100; // Scroll by 100 pixels each step
      const delay = 100; // Delay between scrolls (100ms)

      while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
        document.scrollingElement.scrollBy(0, distance);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    });
    console.log('Finished scrolling to load lazy-loaded elements.');
  }
}

module.exports = ScrollHelper;
