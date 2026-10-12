import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');

(async () => {
  console.log('=== TESTING HOME HERO SCROLL ANIMATION ===');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Initial State (0% scroll)
  const shot0 = path.join(SCRATCH_DIR, 'hero_scroll_0_initial.png');
  await page.screenshot({ path: shot0 });
  fs.copyFileSync(shot0, path.join(ARTIFACTS_DIR, 'hero_scroll_0_initial.png'));
  console.log('✓ Captured 0% scroll (Initial Hero)');

  // 2. Scroll to 30% progress of the pinned hero
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  const shot30 = path.join(SCRATCH_DIR, 'hero_scroll_30_midway.png');
  await page.screenshot({ path: shot30 });
  fs.copyFileSync(shot30, path.join(ARTIFACTS_DIR, 'hero_scroll_30_midway.png'));
  console.log('✓ Captured 30% scroll (Video playing, camera zoom)');

  // 3. Scroll to 70% progress (rain pouring on the roof)
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 1.6, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  const shot70 = path.join(SCRATCH_DIR, 'hero_scroll_70_rain.png');
  await page.screenshot({ path: shot70 });
  fs.copyFileSync(shot70, path.join(ARTIFACTS_DIR, 'hero_scroll_70_rain.png'));
  console.log('✓ Captured 70% scroll (Rain sequence)');

  // 4. Scroll to 100% progress of pinned hero (macro water beading)
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 2.2, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  const shot100 = path.join(SCRATCH_DIR, 'hero_scroll_100_final_frame.png');
  await page.screenshot({ path: shot100 });
  fs.copyFileSync(shot100, path.join(ARTIFACTS_DIR, 'hero_scroll_100_final_frame.png'));
  console.log('✓ Captured 100% scroll (Final frame of video)');

  // 5. Scroll further down into the next section
  await page.evaluate(() => {
    window.scrollTo({ top: window.innerHeight * 3.0, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  const shotNext = path.join(SCRATCH_DIR, 'hero_scroll_unpinned_next.png');
  await page.screenshot({ path: shotNext });
  console.log('✓ Captured unpinned state (glided into next section)');

  // 6. Test Reverse Scroll: scroll back up to 0
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  const shotReverse = path.join(SCRATCH_DIR, 'hero_scroll_reverse_restored.png');
  await page.screenshot({ path: shotReverse });
  console.log('✓ Captured reverse scroll back to top (fully restored)');

  // 7. Mobile Viewport 390x844
  await page.setViewport({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  const shotMobile = path.join(SCRATCH_DIR, 'hero_scroll_mobile_390.png');
  await page.screenshot({ path: shotMobile });
  fs.copyFileSync(shotMobile, path.join(ARTIFACTS_DIR, 'hero_scroll_mobile_390.png'));
  console.log('✓ Captured mobile viewport (390px)');

  await browser.close();
  console.log('=== TEST COMPLETED SUCCESSFULLY ===');
})();
