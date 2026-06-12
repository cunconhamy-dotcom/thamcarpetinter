import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Save directly to artifacts directory
const outputPath = 'C:\\Users\\T plus Computer\\.gemini\\antigravity\\brain\\529fceb7-ae3c-4884-b701-3835bfcad69b\\artifacts\\homepage_screenshot.png';

async function takeScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(6000); // Chờ React fetch Supabase và render xong
    
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log('Screenshot saved to:', outputPath);
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshot();
