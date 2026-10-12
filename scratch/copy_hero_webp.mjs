import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const srcDir = path.resolve(process.cwd(), 'public/images/hero-frames');

fs.copyFileSync(
  path.join(srcDir, 'frame_029.webp'),
  path.join(artifactDir, 'hero_frame_029.webp')
);
fs.copyFileSync(
  path.join(srcDir, 'frame_030.webp'),
  path.join(artifactDir, 'hero_frame_030.webp')
);
console.log('Copied frame 29 and 30 to artifact directory.');
