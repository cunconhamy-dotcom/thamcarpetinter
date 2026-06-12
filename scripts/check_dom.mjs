import { chromium } from 'playwright';

async function checkPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const errors = [];
  const consoleLogs = [];
  const networkErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
    else consoleLogs.push('LOG: ' + msg.type() + ' ' + msg.text());
  });
  page.on('pageerror', error => errors.push('PAGE ERROR: ' + error.message));
  page.on('response', response => {
    if (!response.ok() && !response.url().includes('cdn.jsdelivr')) {
      networkErrors.push(`FAILED RESPONSE: ${response.status()} ${response.url()}`);
    }
  });
  
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(8000);
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    const title = await page.evaluate(() => document.title);
    const rootContent = await page.evaluate(() => document.getElementById('root')?.innerHTML.substring(0, 500));
    
    console.log('Title:', title);
    console.log('Body text length:', bodyText.length);
    console.log('First 300 chars of body:', bodyText.substring(0, 300));
    console.log('Root innerHTML (first 500):', rootContent);
    
    if (errors.length > 0) {
      console.log('\nERRORS FOUND:');
      errors.forEach(e => console.log(e));
    }
    if (networkErrors.length > 0) {
      console.log('\nNETWORK ERRORS:');
      networkErrors.forEach(e => console.log(e));
    }
    console.log('\nKey console logs:');
    consoleLogs.filter(l => !l.includes('[element-picker]') && !l.includes('[vite]')).forEach(l => console.log(l));
    
  } catch (error) {
    console.error('Script Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkPage();
