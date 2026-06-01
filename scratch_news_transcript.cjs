const fs = require('fs');
const path = 'C:/Users/T plus Computer/.gemini/antigravity/brain/ae01ca96-50e4-4526-894b-d8b060cd2f77/.system_generated/logs/transcript.jsonl';
if (fs.existsSync(path)) {
  const lines = fs.readFileSync(path, 'utf8').split('\n');
  const modFiles = new Set();
  for (let line of lines) {
    if (!line) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'CODE_ACTION' || obj.type === 'TOOL_CALL') {
        const content = obj.content || JSON.stringify(obj.tool_calls);
        const m = content.match(/to: (.*?)\. If relevant|TargetFile":"(.*?)"/);
        if (m) modFiles.add((m[1] || m[2]).replace(/\\\\/g, '\\'));
      }
    } catch (e) {}
  }
  console.log('Modified in ae01ca96 (News):', Array.from(modFiles));
} else {
  console.log('Not found');
}
