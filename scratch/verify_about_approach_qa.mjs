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

  console.log('--- STARTING ABOUT PAGE OUR APPROACH QA ---');

  // 1. Check About page Our Approach cards count (5 cards)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle2' });

  const cardsCount = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const approachHeading = headings.find(h => h.textContent.includes('Built On Professional Delivery Principles'));
    if (!approachHeading) return 0;
    const sec = approachHeading.closest('section');
    return sec ? sec.querySelectorAll('.grid > div').length : 0;
  });
  console.log(`About Approach cards count: ${cardsCount} (Expected: 5)`);

  // Scroll to Our Approach section
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const approachHeading = headings.find(h => h.textContent.includes('Built On Professional Delivery Principles'));
    if (approachHeading) approachHeading.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(scratchDir, 'about_approach_1440.png') });

  // Test mouse hover on Card 02 to verify HoverEffect
  const card2 = await page.$('.grid > div:nth-child(2)');
  if (card2) {
    await card2.hover();
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(scratchDir, 'about_approach_hover_card2.png') });
  }

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

  // 3. Verify Home and Services pages remain unchanged
  console.log('--- VERIFYING HOME AND SERVICES PAGES ---');
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
  console.log('--- ALL ABOUT APPROACH QA AUDITS COMPLETED ---');
})();
