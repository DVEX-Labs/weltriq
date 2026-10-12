import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

console.log('=== INSPECTING HERO.MP4 ===');
try {
  execSync(`"${ffmpeg}" -i "public/hero.mp4"`, { stdio: 'inherit' });
} catch (e) {
  // ffmpeg prints file info to stderr
}
