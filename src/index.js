const ScreenshotManager = require('./screenshotManager');
const urls = require('../urls.json');
const config = require('./config');

// Initialize ScreenshotManager with URLs and start capturing screenshots
const screenshotManager = new ScreenshotManager(urls);
screenshotManager.captureScreenshots()
  .then(() => console.log('Screenshots captured successfully.'))
  .catch(error => console.error('Error capturing screenshots:', error));

