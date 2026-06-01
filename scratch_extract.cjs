const fs = require('fs');

function extractLatestFullFile(logPath, fileName) {
  if (!fs.existsSync(logPath)) return null;
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  let latestContent = null;
  
  for (let line of lines) {
    if (!line) continue;
    try {
      const obj = JSON.parse(line);
      // If the model reads the file via VIEW_FILE, the full content is in TOOL_RESPONSE
      if (obj.type === 'TOOL_RESPONSE' && obj.content && obj.content.includes(fileName) && obj.content.includes('Showing lines')) {
        // Extract the lines
        const match = obj.content.match(/The following code has been modified to include a line number[^\n]*\n([\s\S]*)/);
        if (match) {
          const rawLines = match[1].split('\n').filter(l => l.trim() !== '');
          if (rawLines.some(l => l.includes('The above content does NOT show the entire file contents'))) {
            // It's a partial view, skip or handle
            continue;
          }
          const cleanCode = rawLines
            .filter(l => !l.includes('The above content shows the entire'))
            .map(l => l.replace(/^\d+:\s?/, ''))
            .join('\n');
          latestContent = cleanCode;
        }
      }
      
      // If the user replaces the file fully in CODE_ACTION
      if (obj.type === 'CODE_ACTION' && obj.content.includes(fileName) && obj.content.includes('@@ -1,')) {
        const match = obj.content.match(/\[diff_block_start\]\n@@.*?@@\n([\s\S]*?)\[diff_block_end\]/);
        if (match) {
          const diffLines = match[1].split('\n');
          // If it's a full replacement, all lines start with +
          if (diffLines.every(l => l.startsWith('+') || l.trim() === '')) {
            const cleanCode = diffLines.map(l => l.startsWith('+') ? l.slice(1) : l).join('\n');
            latestContent = cleanCode;
          }
        }
      }
    } catch (e) {}
  }
  return latestContent;
}

const c1 = extractLatestFullFile('C:/Users/T plus Computer/.gemini/antigravity/brain/ae01ca96-50e4-4526-894b-d8b060cd2f77/.system_generated/logs/transcript.jsonl', 'PublicApp.tsx');
if (c1) {
  fs.writeFileSync('D:/Thiết kế website thảm sàn carpet/scratch_PublicApp_from_ae01ca96.tsx', c1);
  console.log('Found full PublicApp.tsx in ae01ca96!');
} else {
  console.log('Not found full in ae01ca96');
}

const c2 = extractLatestFullFile('C:/Users/T plus Computer/.gemini/antigravity/brain/98ebb6ea-243c-46c4-ac7c-fdcf97bae761/.system_generated/logs/transcript.jsonl', 'PublicApp.tsx');
if (c2) {
  fs.writeFileSync('D:/Thiết kế website thảm sàn carpet/scratch_PublicApp_from_98ebb6ea.tsx', c2);
  console.log('Found full PublicApp.tsx in 98ebb6ea!');
} else {
  console.log('Not found full in 98ebb6ea');
}
