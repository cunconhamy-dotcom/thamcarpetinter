const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console logs
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('Navigating to login...');
  await page.goto('http://localhost:5173/admin');

  try {
    // Fill login
    await page.fill('input[type="email"]', 'admin@carpetsinter.vn');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('Already logged in or login form not found.');
  }

  console.log('Navigating to products page...');
  await page.goto('http://localhost:5173/admin/products');
  await page.waitForTimeout(2000);

  // Click the first edit button
  console.log('Clicking the edit button...');
  const editButtons = page.locator('button[title="Sửa"]');
  if (await editButtons.count() > 0) {
    await editButtons.first().click();
    console.log('Edit modal opened.');
    await page.waitForTimeout(1000);
    
    // Attempt to modify something
    console.log('Changing product name...');
    await page.fill('input[value]', 'Test Name Change'); 
    
    console.log('Clicking save...');
    await page.click('button:has-text("Lưu Sản Phẩm")');
    await page.waitForTimeout(2000);
    
    console.log('Checking if modal is still open...');
    const isModalOpen = await page.locator('button:has-text("Lưu Sản Phẩm")').isVisible();
    console.log('Is modal open?', isModalOpen);
  } else {
    console.log('No edit buttons found.');
  }

  await browser.close();
})();
