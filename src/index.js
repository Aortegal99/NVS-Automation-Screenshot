const ScreenshotManager = require('./screenshotManager');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Step 1: Get URLs from the command line
const inputUrls = process.argv.slice(2); // Skip the first two arguments (node and script name)

// Step 2: Format URLs
const basePart = 'https://uspadmin:bnG3iyY35zNXmcF@';

let urls = [];
if (inputUrls.length > 0) {
  // If command-line arguments are provided, use them
  urls = inputUrls.flatMap(arg => 
    arg.split(',').map(url => `${basePart}${url.replace(/^https?:\/\//, '')}`)
  );
} else {
  // Otherwise, fall back to urls.json
  try {
    const urlsPath = path.join(__dirname, '../urls.json');
    urls = require(urlsPath).map(url => `${basePart}${url.replace(/^https?:\/\//, '')}`);
    console.log('Using URLs from urls.json');
  } catch (error) {
    console.error('Failed to load urls.json. Please provide URLs via command-line or check your JSON file.');
    process.exit(1);
  }
}

console.log('Formatted URLs:', urls);

// Step 3: Initialize ScreenshotManager with URLs and start capturing screenshots
const screenshotManager = new ScreenshotManager(urls);
screenshotManager.captureScreenshots()
  .then(() => console.log('Screenshots captured successfully.'))
  .catch(error => console.error('Error capturing screenshots:', error));