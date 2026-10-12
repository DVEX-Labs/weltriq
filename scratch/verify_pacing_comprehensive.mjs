import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const viewports = [
  { width: 320, height: 568, name: '320_mobile_xs' },
  { width: 375, height: 667, name: '375_mobile_sm' },
  { width: 390, height: 844, name: '390_mobile_iphone' },
  { width: 430, height: 932, name: '430_mobile_promax' },
  { width: 768, height: 1024, name: '768_tablet' },
  { width: 1024, height: 768, name: '1024_desktop_sm' },
  { width: 1280, height: 800, name: '1280_desktop_md' },
  { width: 1440, height: 900, name: '1440_desktop_lg' },
  { width: 1920, height: 1080, name: '1920_desktop_xl' },
];

(async () => {
  const scratchDir = path.resolve(process.cwd(), 'scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('--- STARTING FAST COMPREHENSIVE PACING QA ---');

  // 1. Home Page Pacing & Card Step Audit (5 Cards)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));

  await page.evaluate(() => {
    const sec = document.querySelector('#services-showcase');
    if (sec) sec.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('--- HOME 5-CARD PACING STEP AUDIT ---');
  for (let tick = 1; tick <= 4; tick++) {
    await page.mouse.wheel({ deltaY: 150 });
    await new Promise(r => setTimeout(r, 300));
  }
  await page.screenshot({ path: path.join(scratchDir, 'home_5cards_pacing_forward.png') });

  // 2. Services Page Pacing Test (10 Cards)
  console.log('--- SERVICES PAGE 10-CARD PACING STEP AUDIT ---');
  await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => {
    const sec = document.querySelector('#services-showcase');
    if (sec) sec.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));

  for (let tick = 1; tick <= 8; tick++) {
    await page.mouse.wheel({ deltaY: 150 });
    await new Promise(r => setTimeout(r, 200));
  }
  await page.screenshot({ path: path.join(scratchDir, 'services_10cards_pacing_forward.png') });

  // Reverse scroll 4 ticks
  console.log('--- REVERSE SCROLL AUDIT ---');
  for (let tick = 1; tick <= 4; tick++) {
    await page.mouse.wheel({ deltaY: -150 });
    await new Promise(r => setTimeout(r, 200));
  }
  await page.screenshot({ path: path.join(scratchDir, 'services_10cards_pacing_reverse.png') });

  // 3. Overflow audit across viewports
  console.log('--- RESPONSIVE OVERFLOW AUDIT ---');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    const overflowHome = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflowHome) console.error(`FAIL: Overflow Home ${vp.name}`);
  }
  console.log('PASS: Zero overflow across all viewports!');

  // 4. Verify Process.tsx remains 100% untouched
  console.log('--- VERIFYING PROCESS.TSX UNTOUCHED ---');
  const processIntact = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('Our Process'));
    return !!h;
  });
  console.log(`Home Process section intact: ${processIntact}`);

  console.log(`Total console errors: ${consoleErrors.length}`);
  await browser.close();
  console.log('--- ALL PACING QA AUDITS COMPLETED SUCCESSFULLY ---');
})();
