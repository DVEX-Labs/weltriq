import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const srcDir = path.resolve(process.cwd(), 'scratch/all_240_frames');

fs.copyFileSync(
  path.join(srcDir, `frame_093.jpg`),
  path.join(artifactDir, `lightning_strike_093.jpg`)
);
console.log('Copied frame 93.');
