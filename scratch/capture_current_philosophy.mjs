import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');

(async () => {
  console.log('Capturing current About page Brand Philosophy section...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Desktop 1440
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    if (eyebrow) {
      eyebrow.closest('section').scrollIntoView({ block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const sectionEl = await page.evaluateHandle(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    return eyebrow.closest('section');
  });

  const desktopShot = path.join(SCRATCH_DIR, 'brand_philosophy_current_1440.png');
  await sectionEl.screenshot({ path: desktopShot });
  console.log('Saved brand_philosophy_current_1440.png');

  // Mobile 390
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    if (eyebrow) {
      eyebrow.closest('section').scrollIntoView({ block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const sectionMobileEl = await page.evaluateHandle(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    return eyebrow.closest('section');
  });

  const mobileShot = path.join(SCRATCH_DIR, 'brand_philosophy_current_390.png');
  await sectionMobileEl.screenshot({ path: mobileShot });
  console.log('Saved brand_philosophy_current_390.png');

  await browser.close();
})();
