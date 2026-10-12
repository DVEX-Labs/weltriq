import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 640, height: 360 });

  const framesDir = path.resolve(process.cwd(), 'public/images/hero-frames').replace(/\\/g, '/');

  const lumas = [];
  // Check the first 50 extracted webp frames (corresponding to first 4.16 seconds)
  for (let i = 1; i <= 50; i++) {
    const num = String(i).padStart(3, '0');
    const frameUrl = `file:///${framesDir}/frame_${num}.webp`;
    const res = await page.evaluate(async (url, idx) => {
      const img = new Image();
      img.src = url;
      await new Promise(r => img.onload = r);
      const c = document.createElement('canvas');
      c.width = 320;
      c.height = 180;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 320, 180);
      const data = ctx.getImageData(0, 0, 320, 180).data;
      let totalLuma = 0;
      let maxLuma = 0;
      for (let j = 0; j < data.length; j += 4) {
        const luma = 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2];
        totalLuma += luma;
        if (luma > maxLuma) maxLuma = luma;
      }
      return { frame: idx, avgLuma: totalLuma / (320 * 180), maxLuma };
    }, frameUrl, i);
    lumas.push(res);
  }

  console.log('WebP Frames Luminance (first 50 frames):');
  for (let i = 0; i < lumas.length; i++) {
    const prev = i > 0 ? lumas[i - 1].avgLuma : lumas[i].avgLuma;
    const diff = lumas[i].avgLuma - prev;
    if (diff > 5 || lumas[i].avgLuma > 55) {
      console.log(`Frame ${lumas[i].frame}: avg=${lumas[i].avgLuma.toFixed(1)} (diff=${diff.toFixed(1)}), max=${lumas[i].maxLuma}`);
    }
  }

  await browser.close();
})();
