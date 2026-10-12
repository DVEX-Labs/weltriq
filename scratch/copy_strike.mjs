import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const srcDir = path.resolve(process.cwd(), 'scratch/all_240_frames');

for (let i = 55; i <= 62; i++) {
  const num = String(i).padStart(3, '0');
  fs.copyFileSync(
    path.join(srcDir, `frame_${num}.jpg`),
    path.join(artifactDir, `lightning_strike_${num}.jpg`)
  );
}
console.log('Copied strike sequence frames 55-62.');
