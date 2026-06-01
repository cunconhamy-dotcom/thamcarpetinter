const fs = require('fs');
let code = fs.readFileSync('src/PublicApp.tsx', 'utf8');

function processSection(startText, endText, mode) {
  let startIdx = code.indexOf(startText);
  if (startIdx === -1) return;
  let endIdx = code.indexOf(endText, startIdx) + endText.length;
  let section = code.substring(startIdx, endIdx);

  if (mode === 'light') {
    section = section
      .replace(/bg-white/g, 'bg-[#fafaf8]') // replace pure white with cream
      .replace(/bg-\[#1a1a1a\]/g, 'bg-[#f5f3f0]') // dark to light
      .replace(/border-white\/5/g, 'border-black/5')
      .replace(/border-white\/10/g, 'border-black/8')
      .replace(/bg-white\/5/g, 'bg-[#fafaf8]')
      .replace(/bg-black\/20/g, 'bg-[#fafaf8]')
      .replace(/text-white\/35/g, 'text-black/35')
      .replace(/text-white\/40/g, 'text-black/40')
      .replace(/text-white\/50/g, 'text-black/50')
      .replace(/text-white\/60/g, 'text-black/60')
      .replace(/text-white\/75/g, 'text-black/75')
      .replace(/text-white\/80/g, 'text-black/80')
      .replace(/text-white/g, 'text-[#1a1a1a]')
      .replace(/text-\[#ffd184\]/g, 'text-[#8a5829]');
  } else if (mode === 'dark') {
    section = section
      .replace(/bg-white/g, 'bg-white/5')
      .replace(/bg-\[#fafaf8\]/g, 'bg-white/5')
      .replace(/bg-\[#f5f3f0\]/g, 'bg-white/5')
      .replace(/bg-\[#e5e3de\]/g, 'bg-black/20')
      // fix section background specifically
      .replace(/className="w-full bg-white\/5/g, 'className="w-full bg-[#1a1a1a]')
      .replace(/border-black\/5/g, 'border-white/5')
      .replace(/border-black\/6/g, 'border-white/10')
      .replace(/border-black\/8/g, 'border-white/10')
      .replace(/border-black\/10/g, 'border-white/10')
      .replace(/text-\[#1a1a1a\]/g, 'text-white')
      .replace(/text-black\/40/g, 'text-white/40')
      .replace(/text-black\/50/g, 'text-white/50')
      .replace(/text-black\/60/g, 'text-white/60')
      .replace(/text-black\/65/g, 'text-white/60')
      .replace(/text-black\/70/g, 'text-white/70')
      .replace(/text-black\/75/g, 'text-white/75')
      .replace(/text-black\/80/g, 'text-white/80')
      .replace(/text-\[#8a5829\]/g, 'text-[#ffd184]');
  }

  code = code.substring(0, startIdx) + section + code.substring(endIdx);
}

// 1. Collections: already Light, but we must run 'light' to replace any bg-white with bg-[#fafaf8]
processSection('id="collections"', '</section>', 'light');

// 2. Value & Spec (starts around 352, the one right after collections): needs to be Dark
processSection('{/* VALUE & SPEC', '</section>', 'dark');

// 3. News (id="news"): needs to be Light
processSection('id="news"', '</section>', 'light');

// 4. Products Grid (starts around 531): needs to be Dark
processSection('{/* PRODUCTS GRID', '</section>', 'dark');

// 5. Brochures (id="tai-lieu"): needs to be Light
processSection('id="tai-lieu"', '</section>', 'light');

// 6. Gallery (starts around 580): needs to be Dark
processSection('{/* GALLERY', '</section>', 'dark');

// 7. Partners (starts around 639): needs to be Light
processSection('{/* PARTNERS', '</section>', 'light');

// Also fix ProductCard definition at the bottom which might have bg-white
// It is used inside Products Grid which is Dark, so ProductCard should be dark mode.
let pcStart = code.indexOf('function ProductCard');
if (pcStart > -1) {
  let pcEnd = code.indexOf('}', pcStart) + 1;
  let pcSection = code.substring(pcStart, pcEnd);
  pcSection = pcSection
    .replace(/bg-white/g, 'bg-black/20')
    .replace(/bg-\[#f5f3f0\]/g, 'bg-black/40')
    .replace(/border-black\/8/g, 'border-white/10')
    .replace(/border-black\/5/g, 'border-white/5')
    .replace(/text-black\/40/g, 'text-white/40')
    .replace(/text-\[#1a1a1a\]/g, 'text-white')
    .replace(/text-black\/75/g, 'text-white/75');
  code = code.substring(0, pcStart) + pcSection + code.substring(pcEnd);
}

fs.writeFileSync('src/PublicApp.tsx', code, 'utf8');
console.log('Alternating theme applied successfully.');
