import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600 });
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    const d = document.createElement('div');
    d.id = 'visual-test';
    d.style.position = 'fixed';
    d.style.top = '0';
    d.style.left = '0';
    d.style.zIndex = '999999';
    d.style.background = '#ffffff';
    d.style.padding = '40px';
    d.style.display = 'flex';
    d.style.flexDirection = 'column';
    d.style.gap = '20px';
    d.innerHTML = `
      <div><span style="font-family: sans-serif; font-size: 14px; color: #888;">No weight class (font-display):</span><div class="text-4xl font-display uppercase text-brand-navy">EVERY PROJECT STARTS WITH PURPOSE</div></div>
      <div><span style="font-family: sans-serif; font-size: 14px; color: #888;">font-bold (font-display font-bold):</span><div class="text-4xl font-display font-bold uppercase text-brand-navy">EVERY PROJECT STARTS WITH PURPOSE</div></div>
      <div><span style="font-family: sans-serif; font-size: 14px; color: #888;">font-extrabold (font-display font-extrabold):</span><div class="text-4xl font-display font-extrabold uppercase text-brand-navy">EVERY PROJECT STARTS WITH PURPOSE</div></div>
    `;
    document.body.appendChild(d);
  });

  const testEl = await page.$('#visual-test');
  await testEl.screenshot({ path: path.resolve(process.cwd(), 'scratch/weight_compare.png') });
  console.log('Saved scratch/weight_compare.png');
  await browser.close();
})();
