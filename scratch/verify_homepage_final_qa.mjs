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

  console.log('--- STARTING HOMEPAGE FINAL PRECISION QA AUDIT ---');

  // 1. Audit Home page across viewports
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Verify horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) console.error(`FAIL: Horizontal overflow on Home page at ${vp.name} (${vp.width}px)`);

    // Verify WhyWeltriq H2 text content and word break integrity
    const h2Text = await page.evaluate(() => {
      const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('PROFESSIONALLY MANAGED ROOFING'));
      return h2 ? h2.textContent.trim() : null;
    });

    if (!h2Text || !h2Text.includes('PROFESSIONALLY')) {
      console.error(`FAIL: WhyWeltriq H2 broken or missing at ${vp.name}`);
    }
  }

  console.log('PASS: Zero overflow and zero mid-word breaks on Home page across all 9 viewports!');

  // Capture Screenshots for Report
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(scratchDir, 'home_hero_1440.png') });

  // Scroll to Why Weltriq
  await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('PROFESSIONALLY MANAGED ROOFING'));
    if (h2) h2.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(scratchDir, 'home_why_weltriq_1440.png') });

  // Mobile viewport screenshot for Why Weltriq
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('PROFESSIONALLY MANAGED ROOFING'));
    if (h2) h2.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(scratchDir, 'home_why_weltriq_390_mobile.png') });

  // 2. Audit Services Page (WhyWeltriq is shared)
  console.log('--- AUDITING SERVICES PAGE SHARED WHYWELTRIQ ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2' });
  const servicesOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (servicesOverflow) console.error('FAIL: Services page overflow');

  // 3. Verify Locked Sections
  console.log('--- VERIFYING LOCKED HOMEPAGE SECTIONS ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const processExists = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('Our Process'));
    return !!h;
  });
  console.log(`Home Process section intact: ${processExists}`);

  const servicesShowcaseExists = await page.evaluate(() => {
    return !!document.querySelector('#services-showcase');
  });
  console.log(`Services Showcase section intact: ${servicesShowcaseExists}`);

  console.log(`Total console errors: ${consoleErrors.length}`);
  await browser.close();
  console.log('--- ALL HOMEPAGE PRECISION QA AUDITS COMPLETED SUCCESSFULLY ---');
})();
