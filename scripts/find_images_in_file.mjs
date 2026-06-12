import fs from 'fs';
import path from 'path';

function run() {
  const filePath = 'C:/Users/T plus Computer/.gemini/antigravity/brain/529fceb7-ae3c-4884-b701-3835bfcad69b/.system_generated/steps/2032/content.md';
  if (!fs.existsSync(filePath)) {
    console.error('File does not exist');
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /https:\/\/carpetsinter\.com\/wp-content\/uploads\/[^\s"'>]+/g;
  const matches = content.match(regex) || [];
  
  const uniqueMatches = [...new Set(matches)];
  console.log(`Found ${uniqueMatches.length} unique image URLs on Flatlands page:`);
  uniqueMatches.forEach(url => console.log(url));
}

run();
