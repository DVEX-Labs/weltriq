import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'scratch/all_frames');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Extract all 240 frames at low res or check signalstats
console.log('Extracting brightness stats per frame using ffmpeg signalstats...');
try {
  const statsCmd = `"${ffmpeg}" -i "public/hero.mp4" -vf "signalstats" -f null - 2> scratch/stats.txt`;
  execSync(statsCmd, { shell: 'cmd.exe' });
} catch (e) {
  // ffmpeg outputs to stderr which is captured in scratch/stats.txt
}

const stats = fs.readFileSync('scratch/stats.txt', 'utf8');
const lines = stats.split('\n');
const ymaxList = [];
for (const line of lines) {
  const match = line.match(/YMAX:(\d+)/i) || line.match(/YAVG:([0-9.]+)/i);
  if (line.includes('YMAX') || line.includes('YAVG')) {
    ymaxList.push(line.trim());
  }
}
console.log('Total stat lines found:', ymaxList.length);
console.log('Sample lines:', ymaxList.slice(0, 10));
