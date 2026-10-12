import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const heroSection = await page.$('section');
  const desktopShot = path.join(SCRATCH_DIR, 'home_hero_new_img.png');
  await heroSection.screenshot({ path: desktopShot });
  fs.copyFileSync(desktopShot, path.join(ARTIFACTS_DIR, 'home_hero_new_img.png'));
  console.log('Saved home_hero_new_img.png');

  // Mobile 390
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const heroSectionMobile = await page.$('section');
  const mobileShot = path.join(SCRATCH_DIR, 'home_hero_new_img_390.png');
  await heroSectionMobile.screenshot({ path: mobileShot });
  fs.copyFileSync(mobileShot, path.join(ARTIFACTS_DIR, 'home_hero_new_img_390.png'));
  console.log('Saved home_hero_new_img_390.png');

  await browser.close();
})();
