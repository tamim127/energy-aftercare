const fs = require('fs');
const html = fs.readFileSync('C:/Users/bdcalling/.gemini/antigravity/brain/9704a4f2-78c7-4709-9aa5-28222b74e9c6/.system_generated/steps/1389/output.txt', 'utf-8');

console.log('Length:', html.length);
console.log('Includes UGj9TbEVToR5996qXri9Zg:', html.includes('UGj9TbEVToR5996qXri9Zg'));

// Look for any mention of calculator, solar, battery, etc.
const keywords = ['calculator', 'Calculator', 'solar', 'battery', 'kWh', 'savings', 'cost'];
for (const kw of keywords) {
  const idx = html.indexOf(kw);
  if (idx !== -1) {
    console.log(`Found "${kw}" at index ${idx}:`, html.slice(idx - 50, idx + 100));
  } else {
    console.log(`Keyword "${kw}" not found in initial HTML`);
  }
}
