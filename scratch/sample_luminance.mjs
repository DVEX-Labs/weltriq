import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

// Let's use ffprobe / ffmpeg to dump scene detection or description
// Or let's use ffmpeg to get mean luminance of every 10th frame:
const script = `"${ffmpeg}" -i "public/hero.mp4" -vf "fps=2,scale=320:180,format=gray" -f rawvideo - | node -e "
  let bufs = [];
  process.stdin.on('data', d => bufs.push(d));
  process.stdin.on('end', () => {
    const buf = Buffer.concat(bufs);
    const frameSize = 320 * 180;
    const numFrames = Math.floor(buf.length / frameSize);
    console.log('Sampled frames:', numFrames);
    for (let i = 0; i < numFrames; i++) {
      let sum = 0;
      const offset = i * frameSize;
      for (let j = 0; j < frameSize; j++) {
        sum += buf[offset + j];
      }
      const avg = (sum / frameSize).toFixed(1);
      console.log('Frame ' + (i * 12) + ' (~' + (i * 0.5).toFixed(1) + 's): avg luminance = ' + avg);
    }
  });
"`;

execSync(script, { shell: 'cmd.exe', stdio: 'inherit' });
