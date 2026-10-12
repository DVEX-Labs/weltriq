import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

// Backup old image first
const oldPath = path.resolve('public/images/refined/metal_roofing_card.webp');
const backupPath = path.resolve('public/images/refined/metal_roofing_card_old.webp');
if (!fs.existsSync(backupPath) && fs.existsSync(oldPath)) {
  fs.copyFileSync(oldPath, backupPath);
  console.log('Backed up old metal image to:', backupPath);
}

// Convert new realistic image to 1600x1000 WebP (quality 90)
const sourcePng = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/metal_roof_real2_1791780082106.png';
const outWebp = path.resolve('public/images/refined/metal_roofing_card_real.webp');
const replaceOriginalWebp = path.resolve('public/images/refined/metal_roofing_card.webp');

const cmd = `"${ffmpeg}" -y -i "${sourcePng}" -vf "scale=1600:1000:force_original_aspect_ratio=increase,crop=1600:1000" -c:v libwebp -quality 90 "${outWebp}"`;
execSync(cmd, { stdio: 'inherit' });

// Also write to original path
fs.copyFileSync(outWebp, replaceOriginalWebp);

console.log('Successfully created metal_roofing_card_real.webp and updated metal_roofing_card.webp');
