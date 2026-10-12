import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import path from 'path';

// Let's test scaling roof_renov_kerala with top-focused crop so the entire roof peak is visible:
const sourcePng = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/roof_renov_kerala_1791763134422.png';
const outWebp = path.resolve('public/images/refined/roof_renovation_card.webp');

// Scale to fit 1600 width, keep top of roof:
const cmd = `"${ffmpeg}" -y -i "${sourcePng}" -vf "scale=1600:-1,crop=1600:1000:0:0" -c:v libwebp -quality 88 "${outWebp}"`;
execSync(cmd, { stdio: 'inherit' });
console.log('Regenerated with top anchor crop.');
