import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 640, height: 360 });

  const dir240 = path.resolve(process.cwd(), 'scratch/all_240_frames').replace(/\\/g, '/');

  const flashes240 = [];
  for (let i = 1; i <= 240; i++) {
    const num = String(i).padStart(3, '0');
    const url = `file:///${dir240}/frame_${num}.jpg`;
    const res = await page.evaluate(async (imgUrl, frameNum) => {
      const img = new Image();
      img.src = imgUrl;
      await new Promise(r => img.onload = r);
      const c = document.createElement('canvas');
      c.width = 320;
      c.height = 180;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 320, 180);
      const data = ctx.getImageData(0, 0, 320, 180).data;
      let totalLuma = 0;
      for (let j = 0; j < data.length; j += 4) {
        totalLuma += 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2];
      }
      return { frame: frameNum, avgLuma: totalLuma / (320 * 180) };
    }, url, i);
    flashes240.push(res);
  }

  console.log('--- 240 FRAMES: Lightning Flashes (avgLuma > 55 or spike > 10) ---');
  for (let i = 0; i < flashes240.length; i++) {
    const prev = i > 0 ? flashes240[i - 1].avgLuma : flashes240[i].avgLuma;
    const diff = flashes240[i].avgLuma - prev;
    if (flashes240[i].avgLuma > 50 || diff > 10) {
      console.log(`240-Set Frame ${flashes240[i].frame} (~${(flashes240[i].frame/24).toFixed(2)}s): avgLuma=${flashes240[i].avgLuma.toFixed(1)} (diff=${diff.toFixed(1)})`);
    }
  }

  await browser.close();
})();
