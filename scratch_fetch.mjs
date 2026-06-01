import https from 'https';

https.get('https://hh-junk-removal-y4cp.arcada.app/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // Extract background colors (bg-*, hex codes, rgb)
    const bgMatches = data.match(/bg-\[[#a-zA-Z0-9]+\]/g) || [];
    const hexMatches = data.match(/#[a-fA-F0-9]{3,6}/g) || [];
    
    console.log("Background classes:", Array.from(new Set(bgMatches)));
    console.log("Hex codes:", Array.from(new Set(hexMatches)));
    
    // Also print first 2000 chars of the body to see structure
    const bodyStart = data.indexOf('<body');
    if (bodyStart !== -1) {
        console.log("Body snippet:", data.substring(bodyStart, bodyStart + 2000));
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
