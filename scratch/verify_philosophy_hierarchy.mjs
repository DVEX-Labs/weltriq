import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');

(async () => {
  console.log('=== STARTING BRAND PHILOSOPHY FINAL FULL SCREENSHOT CAPTURE ===');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to Brand Philosophy
  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    if (eyebrow) {
      eyebrow.closest('section').scrollIntoView({ block: 'center' });
    }
  });

  // Wait 2.5 seconds for GSAP animations to complete fully
  await new Promise(r => setTimeout(r, 2500));

  const secDesktopHandle = await page.evaluateHandle(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    return eyebrow.closest('section');
  });
  const desktopShotPath = path.join(SCRATCH_DIR, 'brand_philosophy_final_1440.png');
  await secDesktopHandle.screenshot({ path: desktopShotPath });
  fs.copyFileSync(desktopShotPath, path.join(ARTIFACTS_DIR, 'brand_philosophy_final_1440.png'));
  console.log('✓ Saved brand_philosophy_final_1440.png');

  // Mobile 390x844
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    if (eyebrow) {
      eyebrow.closest('section').scrollIntoView({ block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 2500));

  const secMobileHandle = await page.evaluateHandle(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    return eyebrow.closest('section');
  });
  const mobileShotPath = path.join(SCRATCH_DIR, 'brand_philosophy_final_390.png');
  await secMobileHandle.screenshot({ path: mobileShotPath });
  fs.copyFileSync(mobileShotPath, path.join(ARTIFACTS_DIR, 'brand_philosophy_final_390.png'));
  console.log('✓ Saved brand_philosophy_final_390.png');

  await browser.close();
  console.log('=== CAPTURE COMPLETE ===');
})();
