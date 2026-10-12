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

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('--- STARTING BRAND PHILOSOPHY QA ---');

  // 1. Check About page Brand Philosophy section
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle2' });

  // Scroll to Brand Philosophy section
  await page.evaluate(() => {
    const tag = Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('BRAND PHILOSOPHY'));
    if (tag) tag.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(scratchDir, 'brand_philosophy_1440.png') });

  // Test mobile viewport screenshot
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const tag = Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('BRAND PHILOSOPHY'));
    if (tag) tag.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(scratchDir, 'brand_philosophy_390_mobile.png') });

  // 2. Responsive overflow audit across all 9 viewports
  console.log('--- RUNNING RESPONSIVE OVERFLOW AUDIT ---');
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle2' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) {
      console.error(`FAIL: Overflow on About page ${vp.name} (${vp.width}px)`);
    } else {
      console.log(`PASS: No overflow on ${vp.name} (${vp.width}px)`);
    }
  }

  // 3. Verify other pages remain untouched
  console.log('--- VERIFYING OTHER PAGES ---');
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2' });
  const deliveryExists = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('How We Deliver'));
    return !!h;
  });
  console.log(`Services How We Deliver section intact: ${deliveryExists}`);

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const processExists = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('Our Process'));
    return !!h;
  });
  console.log(`Home Process section intact: ${processExists}`);

  console.log(`Total console errors: ${consoleErrors.length}`);
  await browser.close();
  console.log('--- ALL BRAND PHILOSOPHY QA AUDITS COMPLETED ---');
})();
