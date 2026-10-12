import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

// Let's use ffprobe / ffmpeg signalstats to find brightness spikes (lightning!)
console.log('Detecting scene changes / brightness spikes in public/hero.mp4...');
try {
  // Use select filter or metadata to find frames with high max/average luminance or scene change
  const testDir = path.resolve(process.cwd(), 'scratch/lightning_test');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  // Extract all 240 frames or inspect frames where brightness changes rapidly
  const cmd = `"${ffmpeg}" -i "public/hero.mp4" -vf "select='gt(scene,0.1)+eq(pict_type,I)',metadata=print:file=scratch/scene_changes.txt" -vsync vfr -f null -`;
  // Or even better: extract frames 1 to 240 as thumbnails to check where lightning is
} catch (e) {
  console.error(e);
}
