import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import path from 'path';

// Convert roof_renov_real3 (authentic Kerala Mangalore tile renovation with modern gutters and teak wood)
const sourcePng = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/roof_renov_real3_1791763272071.png';
const outWebp = path.resolve('public/images/refined/roof_renovation_card_real.webp');

const cmd = `"${ffmpeg}" -y -i "${sourcePng}" -vf "scale=1600:1000:force_original_aspect_ratio=increase,crop=1600:1000" -c:v libwebp -quality 90 "${outWebp}"`;
execSync(cmd, { stdio: 'inherit' });
console.log('Saved roof_renovation_card_real.webp');
