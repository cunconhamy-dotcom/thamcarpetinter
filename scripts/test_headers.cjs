const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('request', request => {
    if (request.url().includes('products') && request.method() === 'PATCH') {
      console.log('--- SUPABASE PATCH REQUEST ---');
      console.log('URL:', request.url());
      console.log('Headers:', request.headers()['authorization'] ? 'BEARER TOKEN PRESENT' : 'MISSING TOKEN');
      if (request.headers()['authorization']) {
        console.log('Token snippet:', request.headers()['authorization'].substring(0, 20) + '...');
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
    console.log('Logged in...');
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('Already logged in or form not found.');
  }

  await page.goto('http://localhost:5173/admin/products');
  await page.waitForTimeout(2000);

  const editButtons = page.locator('button[title="Sửa"]');
  if (await editButtons.count() > 0) {
    console.log('Clicking edit...');
    await editButtons.first().click();
    await page.waitForTimeout(1000);
    
    await page.fill('input[value]', 'Header Test'); 
    await page.click('button:has-text("Lưu Sản Phẩm")');
    console.log('Clicked save...');
    await page.waitForTimeout(2000);
  } else {
    console.log('No edit buttons found.');
  }

  await browser.close();
})();
