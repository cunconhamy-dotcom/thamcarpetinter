const fs = require('fs');
let code = fs.readFileSync('src/PublicApp.tsx', 'utf8');

const startIdx = code.indexOf('id="collections"');
const endIdx = code.indexOf('</section>', startIdx);
let section = code.substring(startIdx, endIdx);

// Convert cards inside this section to dark
section = section
  .replace(/bg-\[#fafaf8\]/g, 'bg-[#262626]')
  .replace(/bg-\[#fafaf8\]\/10/g, 'bg-white/10')
  .replace(/border-black\/8/g, 'border-white/10')
  .replace(/border-black\/5/g, 'border-white/5')
  .replace(/text-\[#1a1a1a\]/g, 'text-white')
  .replace(/text-black\/35/g, 'text-white/35')
  .replace(/text-black\/40/g, 'text-white/40')
  .replace(/text-black\/50/g, 'text-white/50')
  .replace(/text-black\/60/g, 'text-white/60')
  .replace(/text-black\/75/g, 'text-white/75')
  .replace(/text-black\/80/g, 'text-white/80')
  .replace(/text-\[#8a5829\]/g, 'text-[#ffd184]')
  .replace(/hover:border-white\/25/g, 'hover:border-white/30')
  .replace(/shadow-\[0_8px_30px_rgba\(0,0,0,0\.02\)\]/g, 'shadow-[0_8px_30px_rgba(0,0,0,0.1)]')
  .replace(/shadow-\[0_8px_24px_rgba\(0,0,0,0\.03\)\]/g, 'shadow-[0_8px_24px_rgba(0,0,0,0.1)]');

// Also update the input placeholder focus
section = section.replace(/focus:border-\[#e8720c\]\/50/g, 'focus:border-[#e8720c]/80');

code = code.substring(0, startIdx) + section + code.substring(endIdx);
fs.writeFileSync('src/PublicApp.tsx', code, 'utf8');
console.log('Cards converted to dark mode successfully.');
