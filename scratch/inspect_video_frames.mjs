import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 640, height: 360 });

  const videoPath = path.resolve(process.cwd(), 'public/hero.mp4').replace(/\\/g, '/');

  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <video id="v" src="file:///${videoPath}" muted preload="auto" playsinline width="640" height="360"></video>
        <canvas id="c" width="320" height="180"></canvas>
      </body>
    </html>
  `;
  await page.setContent(html);

  const videoInfo = await page.evaluate(async () => {
    const v = document.getElementById('v');
    await new Promise((res) => {
      v.onloadedmetadata = res;
      if (v.readyState >= 1) res();
    });
    return { duration: v.duration, width: v.videoWidth, height: v.videoHeight };
  });

  console.log('Video Info:', videoInfo);

  // Sample every 0.1s (100 samples across the 10s video)
  const samples = [];
  for (let t = 0; t <= videoInfo.duration; t += 0.05) {
    const res = await page.evaluate(async (time) => {
      const v = document.getElementById('v');
      const c = document.getElementById('c');
      const ctx = c.getContext('2d');
      v.currentTime = time;
      await new Promise((r) => {
        v.onseeked = r;
      });
      ctx.drawImage(v, 0, 0, 320, 180);
      const imgData = ctx.getImageData(0, 0, 320, 180).data;
      let totalLuma = 0;
      let maxLuma = 0;
      for (let i = 0; i < imgData.length; i += 4) {
        const luma = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
        totalLuma += luma;
        if (luma > maxLuma) maxLuma = luma;
      }
      return {
        time,
        avgLuma: totalLuma / (320 * 180),
        maxLuma,
      };
    }, t);
    samples.push(res);
  }

  // Find lightning flashes (sharp peaks in avgLuma or maxLuma)
  console.log('Luminance scan completed. Total samples:', samples.length);
  for (let i = 1; i < samples.length; i++) {
    const diff = samples[i].avgLuma - samples[i - 1].avgLuma;
    if (diff > 10 || samples[i].avgLuma > 80) {
      console.log(`Flash/Lightning spike at t=${samples[i].time.toFixed(2)}s: avgLuma=${samples[i].avgLuma.toFixed(1)} (diff=${diff.toFixed(1)}), maxLuma=${samples[i].maxLuma}`);
    }
  }

  await browser.close();
})();
