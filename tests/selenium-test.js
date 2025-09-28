import { Builder, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function runTest() {
    // Create Chrome options
    const options = new chrome.Options();
    options.addArguments('--headless');      // <-- enable headless
    options.addArguments('--no-sandbox');    // optional for CI environments
    options.addArguments('--disable-dev-shm-usage'); // optional for Docker

    // Build driver
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('http://localhost:3000/health');
        const body = await driver.findElement(By.tagName('body')).getText();
        if (!body.includes('ok')) throw new Error('Health endpoint test failed');
        console.log('Selenium test passed: /health endpoint working');
    } finally {
        await driver.quit();
    }
}

runTest();
