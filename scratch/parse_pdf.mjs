const { createRequire } = await import('module');
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
const fs = require('fs');

const parser = new PDFParse();
const buf = fs.readFileSync('references/Untitled document.pdf');
const data = await parser.parse(buf);
const text = data.pages.map(p => p.content.map(c => c.str || '').join(' ')).join('\n');
fs.writeFileSync('references/untitled_text.txt', text, 'utf8');
console.log(text);
