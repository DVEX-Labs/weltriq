import fs from 'fs';
import path from 'path';

// Let's inspect file sizes or do a quick diff. Sudden spikes in file size or frame differences indicate lightning flashes!
const dir = path.resolve(process.cwd(), 'scratch/all_240_frames');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();

const sizes = files.map((f, i) => {
  return { frame: i + 1, name: f, size: fs.statSync(path.join(dir, f)).size };
});

// Calculate delta in size between consecutive frames
for (let i = 1; i < sizes.length; i++) {
  sizes[i].delta = sizes[i].size - sizes[i - 1].size;
}

const largeDeltas = sizes.filter(s => s.delta && Math.abs(s.delta) > 1500).sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
console.log('Top frame size deltas (indicating flashes/lightning/scene shifts):', largeDeltas.slice(0, 15));
