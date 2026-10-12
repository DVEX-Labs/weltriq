import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'public/images/hero-frames');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Clean any existing files in outDir
fs.readdirSync(outDir).forEach(f => fs.unlinkSync(path.join(outDir, f)));

console.log('Extracting frames from public/hero.mp4 at 12 FPS (120 frames) in 1080p WebP quality 80...');

const cmd = `"${ffmpeg}" -i "public/hero.mp4" -vf "fps=12" -c:v libwebp -quality 80 -an "${path.join(outDir, 'frame_%03d.webp')}"`;
console.log('Running:', cmd);

execSync(cmd, { stdio: 'inherit' });

const files = fs.readdirSync(outDir).filter(f => f.endsWith('.webp')).sort();
console.log(`✓ Extracted ${files.length} frames.`);

let totalBytes = 0;
files.forEach(f => {
  totalBytes += fs.statSync(path.join(outDir, f)).size;
});

const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
const avgKB = (totalBytes / files.length / 1024).toFixed(1);

console.log(`✓ Total folder size: ${totalMB} MB`);
console.log(`✓ Average frame size: ${avgKB} KB per frame`);
console.log(`First frame: ${files[0]}`);
console.log(`Last frame: ${files[files.length - 1]}`);
