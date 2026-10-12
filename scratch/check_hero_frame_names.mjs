import fs from 'fs';
import path from 'path';

const framesDir = path.resolve(process.cwd(), 'public/images/hero-frames');
const files = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp')).sort();

console.log('Total hero frames:', files.length);
// In previous test we saw:
// Frame 29 (avg=68.9), Frame 30 (avg=78.4).
// Let's verify files around 28-33:
console.log('Frames 27 to 33:', files.slice(26, 33));
