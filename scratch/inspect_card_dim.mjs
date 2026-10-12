import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';

console.log('Inspecting original card image:');
try {
  execSync(`"${ffmpeg}" -i "public/images/refined/roof_renovation_card.webp"`, { stdio: 'inherit' });
} catch (e) {}
