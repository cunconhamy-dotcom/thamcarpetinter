const fs = require('fs');

let content = fs.readFileSync('src/PublicApp.tsx', 'utf8');

// We have 3 target areas we need to replace:
// 1. COLLECTIONS SHOWCASE (lines 209 to 349 approximately)
// 2. NEWS SECTION (lines 433 to 528 approximately)

// First, extract the Collections section:
const collStart = content.indexOf('{/* COLLECTIONS SHOWCASE');
const collEnd = content.indexOf('</section>', collStart) + '</section>'.length;
let collectionsHtml = content.substring(collStart, collEnd);

// Restyle Collections back to Light (Warm Gray) Theme:
collectionsHtml = collectionsHtml
  .replace(/COLLECTIONS SHOWCASE \(Dark #1a1a1a\)/g, 'COLLECTIONS SHOWCASE (Warm Gray #f5f3f0)')
  .replace(/bg-\[#1a1a1a\]/g, 'bg-[#f5f3f0]')
  .replace(/border-white\/5/g, 'border-black/5')
  .replace(/border-white\/10/g, 'border-black/8')
  .replace(/bg-white\/5/g, 'bg-white')
  .replace(/bg-black\/20/g, 'bg-[#fafaf8]') // for images and bottom
  .replace(/text-white\/35/g, 'text-black/35')
  .replace(/text-white\/40/g, 'text-black/40')
  .replace(/text-white\/50/g, 'text-black/50')
  .replace(/text-white\/60/g, 'text-black/60')
  .replace(/text-white\/75/g, 'text-black/75')
  .replace(/text-white\/80/g, 'text-black/80')
  .replace(/text-white/g, 'text-[#1a1a1a]')
  .replace(/text-\[#ffd184\]/g, 'text-[#8a5829]')
  .replace(/shadow-\[0_8px_30px_rgba\(0,0,0,0\.1\)\]/g, 'shadow-[0_8px_30px_rgba(0,0,0,0.02)]')
  .replace(/shadow-\[0_8px_24px_rgba\(0,0,0,0\.1\)\]/g, 'shadow-[0_8px_24px_rgba(0,0,0,0.03)]')

// Next, extract the News section:
const newsStart = content.indexOf('{/* NEWS SECTION');
const newsEnd = content.indexOf('</section>', newsStart) + '</section>'.length;
let newsHtml = content.substring(newsStart, newsEnd);

// Restyle News to Dark Theme:
newsHtml = newsHtml
  .replace(/NEWS SECTION \(Warm Gray #f5f3f0\)/g, 'NEWS SECTION (Dark #1a1a1a)')
  .replace(/bg-\[#f5f3f0\]/g, 'bg-[#1a1a1a]')
  .replace(/border-black\/5/g, 'border-white/5')
  .replace(/border-black\/8/g, 'border-white/10')
  .replace(/bg-[#fafaf8]/g, 'bg-black/20')
  .replace(/bg-black\/5/g, 'bg-white/5')
  .replace(/bg-black\/3/g, 'bg-white/5')
  .replace(/bg-white/g, 'bg-white/5')
  .replace(/text-\[#1a1a1a\]/g, 'text-white')
  .replace(/text-black\/40/g, 'text-white/40')
  .replace(/text-black\/60/g, 'text-white/60')
  .replace(/text-black\/75/g, 'text-white/75')
  .replace(/text-\[#8a5829\]/g, 'text-[#ffd184]')
  .replace(/shadow-\[0_8px_30px_rgba\(0,0,0,0\.02\)\]/g, 'shadow-[0_8px_30px_rgba(0,0,0,0.1)]')
  .replace(/shadow-\[0_4px_16px_rgba\(0,0,0,0\.02\)\]/g, 'shadow-[0_8px_24px_rgba(0,0,0,0.1)]')

// Re-assemble the content
content = content.substring(0, collStart) + collectionsHtml + content.substring(collEnd, newsStart) + newsHtml + content.substring(newsEnd);

fs.writeFileSync('src/PublicApp.tsx', content, 'utf8');
console.log('Restyled successfully.');
