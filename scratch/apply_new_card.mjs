import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

// Backup old image first
const oldPath = path.resolve('public/images/refined/roof_renovation_card.webp');
const backupPath = path.resolve('public/images/refined/roof_renovation_card_old_tudor.webp');
if (!fs.existsSync(backupPath) && fs.existsSync(oldPath)) {
  fs.copyFileSync(oldPath, backupPath);
  console.log('Backed up old tudor image to:', backupPath);
}

// Convert new realistic Kerala renovation image to 1600x1000 WebP (quality 85)
const sourcePng = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/roof_renov_kerala_1791763134422.png';
const outWebp = path.resolve('public/images/refined/roof_renovation_card.webp');

const cmd = `"${ffmpeg}" -y -i "${sourcePng}" -vf "scale=1600:1000:force_original_aspect_ratio=increase,crop=1600:1000" -c:v libwebp -quality 85 "${outWebp}"`;
execSync(cmd, { stdio: 'inherit' });

console.log('Successfully replaced roof_renovation_card.webp with new realistic image!');
const newSize = fs.statSync(outWebp).size;
console.log('New image size:', (newSize / 1024).toFixed(1), 'KB');
