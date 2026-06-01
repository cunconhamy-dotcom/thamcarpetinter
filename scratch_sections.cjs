const fs = require('fs');
const code = fs.readFileSync('src/PublicApp.tsx', 'utf8');
const lines = code.split('\n');
lines.forEach((line, index) => {
  if (line.includes('<section') || line.includes('</section>')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
