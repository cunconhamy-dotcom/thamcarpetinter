const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://hh-junk-removal-y4cp.arcada.app/', { waitUntil: 'networkidle' });
  
  // Extract background colors of main sections
  const colors = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section, header, footer, div'));
    const bgColors = sections.map(s => window.getComputedStyle(s).backgroundColor);
    return Array.from(new Set(bgColors)).filter(c => c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent');
  });
  
  console.log('Background colors found:');
  console.log(colors);
  
  await browser.close();
})();
