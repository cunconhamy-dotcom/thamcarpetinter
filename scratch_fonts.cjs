const fs = require('fs');
let code = fs.readFileSync('src/PublicApp.tsx', 'utf8');

const heroEndIdx = code.indexOf('{/* COLLECTIONS SHOWCASE');
let header = code.substring(0, heroEndIdx);
let main = code.substring(heroEndIdx);

// Upscale sizes mapping
const replacements = [
  // Special case headers that are already big
  { from: /text-5xl/g, to: 'text-6xl' },
  { from: /text-4xl/g, to: 'text-5xl' },
  { from: /text-3xl/g, to: 'text-4xl' },
  { from: /text-2xl/g, to: 'text-3xl' },
  { from: /text-xl/g, to: 'text-2xl' },
  { from: /text-lg/g, to: 'text-xl' },
  { from: /text-base/g, to: 'text-lg' },
  { from: /text-sm/g, to: 'text-base' },
  { from: /text-xs/g, to: 'text-sm' },
  { from: /text-\[11px\]/g, to: 'text-xs' },
  { from: /text-\[10px\]/g, to: 'text-xs' }
];

replacements.forEach(({ from, to }) => {
  main = main.replace(from, to);
});

// We should also increase the size of icons, e.g. size={14} -> size={16}
const iconReplacements = [
  { from: /size=\{10\}/g, to: 'size={12}' },
  { from: /size=\{12\}/g, to: 'size={14}' },
  { from: /size=\{13\}/g, to: 'size={15}' },
  { from: /size=\{14\}/g, to: 'size={16}' },
  { from: /size=\{16\}/g, to: 'size={18}' },
  { from: /size=\{20\}/g, to: 'size={24}' }
];

iconReplacements.forEach(({ from, to }) => {
  main = main.replace(from, to);
});

code = header + main;
fs.writeFileSync('src/PublicApp.tsx', code, 'utf8');
console.log('Fonts upscaled successfully.');
