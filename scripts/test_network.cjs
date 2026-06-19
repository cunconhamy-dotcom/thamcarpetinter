const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to network responses
  page.on('response', async response => {
    if (response.url().includes('products') && response.request().method() === 'PATCH') {
      console.log('--- SUPABASE UPDATE RESPONSE ---');
      console.log('Status:', response.status());
      try {
         const body = await response.json();
         console.log('Body:', JSON.stringify(body, null, 2));
      } catch(e) {
         console.log('Body:', await response.text());
      }
    }
  });

  console.log('Navigating to login...');
  await page.goto('http://localhost:5173/admin');
  await page.waitForTimeout(1000);

  try {
    await page.fill('input[type="email"]', 'admin@carpetsinter.vn');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('Already logged in or form not found.');
  }

  await page.goto('http://localhost:5173/admin/products');
  await page.waitForTimeout(2000);

  const editButtons = page.locator('button[title="Sửa"]');
  if (await editButtons.count() > 0) {
    await editButtons.first().click();
    await page.waitForTimeout(1000);
    
    await page.fill('input[value]', 'Network Test Name'); 
    await page.click('button:has-text("Lưu Sản Phẩm")');
    await page.waitForTimeout(2000);
  } else {
    console.log('No edit buttons found.');
  }

  await browser.close();
})();
