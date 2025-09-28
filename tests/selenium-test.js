import { Builder, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

async function runTest() {
    let driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
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
