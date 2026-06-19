const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.local' });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Navigating to login...');
  await page.goto('http://localhost:5173/admin/login');
  
  await page.fill('input[type="email"]', 'admin@carpetsinter.vn');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  console.log('Logged in...');

  await page.goto('http://localhost:5173/admin/products');
  await page.waitForTimeout(2000);
  
  console.log('Clicking edit button...');
  const btn = await page.$('button[title="Sửa"]');
  if (btn) {
    console.log('Button found, clicking...');
    await btn.click();
    await page.waitForTimeout(1000);
    const modalOpen = await page.$('.admin-modal') || await page.$('form');
    console.log('Modal state:', modalOpen ? 'OPEN' : 'CLOSED');
  } else {
    console.log('Button not found!');
  }

  await browser.close();
})();
