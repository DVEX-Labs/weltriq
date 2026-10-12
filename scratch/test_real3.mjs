import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import path from 'path';

const sourcePng = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/roof_renov_real3_1791763272071.png';
const outWebp = path.resolve('public/images/refined/roof_renovation_card.webp');

// Scale and convert to WebP
const cmd = `"${ffmpeg}" -y -i "${sourcePng}" -vf "scale=1200:1200" -c:v libwebp -quality 88 "${outWebp}"`;
execSync(cmd, { stdio: 'inherit' });
console.log('Applied roof_renov_real3 to card.');
