import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const srcDir = path.resolve(process.cwd(), 'scratch/all_240_frames');

// Copy frames around lightning strikes:
// Strike 1: Frame 3, 4
// Strike 2: Frame 29, 30
// Strike 3: Frame 58, 59
// Strike 4: Frame 93, 94
const sampleFrames = [4, 30, 59, 94];
for (const f of sampleFrames) {
  const num = String(f).padStart(3, '0');
  fs.copyFileSync(
    path.join(srcDir, `frame_${num}.jpg`),
    path.join(artifactDir, `lightning_frame_${num}.jpg`)
  );
}
console.log('Copied lightning frames to artifact dir.');
