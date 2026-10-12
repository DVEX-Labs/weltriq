import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'scratch/all_240_frames');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

console.log('Extracting all 240 frames of public/hero.mp4 to scratch/all_240_frames as small jpegs...');
const cmd = `"${ffmpeg}" -i "public/hero.mp4" -vf "scale=480:-1" -q:v 4 "${path.join(outDir, 'frame_%03d.jpg')}"`;
execSync(cmd, { stdio: 'inherit' });

const files = fs.readdirSync(outDir).filter(f => f.endsWith('.jpg'));
console.log(`Extracted ${files.length} frames.`);
