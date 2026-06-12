import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbWpkYXl4YXVkcmF2aWhsb2VpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ4NzA1NywiZXhwIjoyMDk0MDYzMDU3fQ.6XYn0NVz0lshP4LjL8J5aTQNOHTmPIhhkPRxelAb940';
const supabase = createClient(process.env.VITE_SUPABASE_URL, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const urls = [
  "https://carpetsinter.com/collection",
  "https://carpetsinter.com/foundation",
  "https://carpetsinter.com/groundwork/",
  "https://carpetsinter.com/aspekt-insight/",
  "https://carpetsinter.com/waterloo/",
  "https://carpetsinter.com/architexture-connect/",
  "https://carpetsinter.com/upstream/",
  "https://carpetsinter.com/discover/",
  "https://carpetsinter.com/flatlands/",
  "https://carpetsinter.com/aspekt-vue/"
];

const schema = `
{
  "name": "Collection Name",
  "slug": "url-slug",
  "tagline": "Short tagline",
  "summary": "Short description",
  "detail": "Longer detailed description",
  "hero_image": "main image url (ensure it's an absolute url starting with https://)",
  "highlights": ["highlight 1", "highlight 2"],
  "quick_facts": ["fact 1", "fact 2"],
  "value_points": ["value 1", "value 2"],
  "applications": ["application 1", "application 2"]
}
`;

async function scrapeUrl(page, url) {
  console.log('Navigating to', url);
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  } catch (e) {
    console.warn('Navigation timeout, proceeding anyway...', e.message);
  }
  
  await page.waitForTimeout(2000); // Give it a little time for images to load
  
  // Extract text and image URLs to give Gemini context
  const contentData = await page.evaluate(() => {
    // Remove unwanted elements
    document.querySelectorAll('script, style, noscript, nav, footer, header').forEach(el => el.remove());
    
    const texts = document.body.innerText;
    const imgs = Array.from(document.querySelectorAll('img'))
      .map(img => img.src)
      .filter(src => src.includes('wp-content') && !src.includes('logo') && !src.includes('icon'));
      
    return { 
      texts: texts.substring(0, 15000), 
      imgs: [...new Set(imgs)].slice(0, 20) 
    };
  });

  console.log(`Extracted ${contentData.texts.length} chars of text and ${contentData.imgs.length} images.`);

  if (contentData.texts.length < 50) {
    console.error('Page seems empty, skipping.');
    return null;
  }

  const prompt = `
You are a data extractor. Extract collection information from the following text and images found on a Carpet product page.
URL: ${url}

TEXT:
${contentData.texts}

IMAGES FOUND:
${contentData.imgs.join('\n')}

Please extract the collection details matching exactly this JSON schema. Return ONLY valid JSON:
${schema}

If some fields are not found, leave them as empty strings or empty arrays. 
For slug, generate a URL-friendly slug based on the name.
For hero_image, pick the most prominent carpet design image URL from the IMAGES FOUND list.
For quick_facts, look for specs like construction, pile height, yarn type, size, etc.
  `;

  console.log('Sending to Gemini...');
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: "application/json"
    }
  });

  try {
    let text = response.text;
    if (text.startsWith('\`\`\`json')) {
       text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    }
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON for', url, e);
    console.log('Raw response:', response.text);
    return null;
  }
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  for (const url of urls) {
    const data = await scrapeUrl(page, url);
    if (data) {
      console.log('Extracted Data:', data.name);
      data.status = 'published';
      
      const { error } = await supabase.from('collections').upsert(data, { onConflict: 'slug' });
      if (error) {
         console.error('Supabase Error:', error);
      } else {
         console.log('Saved to Supabase:', data.name);
      }
    }
  }
  
  await browser.close();
}

main().catch(console.error);
