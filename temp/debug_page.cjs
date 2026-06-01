const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to debug http://localhost:5173/ ...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture page errors (uncaught exceptions in browser)
  page.on('pageerror', (err) => {
    console.error('BROWSER RUNTIME EXCEPTION:', err.stack || err.message);
  });

  // Capture ALL console logs
  page.on('console', (msg) => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });

  try {
    // Navigate to the local server, waiting only for DOM content
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('DOM Content Loaded successfully. Waiting 5 seconds for React rendering and async effects...');
    await page.waitForTimeout(5000);
    
    const content = await page.content();
    console.log('Page body length:', content.length);
    const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'ROOT ELEMENT NOT FOUND');
    console.log('Root element contents (first 500 chars):', rootHTML.substring(0, 500));
  } catch (err) {
    console.error('Failed to navigate or run test:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
