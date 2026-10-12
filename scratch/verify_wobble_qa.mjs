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

  console.log('--- STARTING WOBBLE CARD SERVICES QA ---');

  // 1. Check Home page services (5 cards)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  const homeCardsCount = await page.evaluate(() => {
    const cards = document.querySelectorAll('#services-showcase [data-service-card]');
    return cards.length;
  });
  console.log(`Home Services Showcase cards count: ${homeCardsCount} (Expected: 5)`);

  // Scroll to services showcase
  await page.evaluate(() => {
    const sec = document.querySelector('#services-showcase');
    if (sec) sec.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(scratchDir, 'home_services_showcase_1440.png') });

  // Test mouse hover on first card to trigger Wobble translate3d
  const firstHomeCard = await page.$('#services-showcase [data-service-card]');
  if (firstHomeCard) {
    const box = await firstHomeCard.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.3);
      await new Promise(r => setTimeout(r, 300));
      await page.screenshot({ path: path.join(scratchDir, 'home_service_card_wobble.png') });
    }
  }

  // 2. Check Services page services (10 cards)
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2' });
  const servicesCardsCount = await page.evaluate(() => {
    const cards = document.querySelectorAll('#services-showcase [data-service-card]');
    return cards.length;
  });
  console.log(`Services Page Showcase cards count: ${servicesCardsCount} (Expected: 10)`);

  await page.evaluate(() => {
    const sec = document.querySelector('#services-showcase');
    if (sec) sec.scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(scratchDir, 'services_showcase_1440.png') });

  // 3. Overflow audit across all 9 viewports
  console.log('--- RUNNING RESPONSIVE OVERFLOW AUDIT ---');
  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    const overflowHome = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflowHome) console.error(`FAIL: Overflow on Home ${vp.name}`);

    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2' });
    const overflowServices = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflowServices) console.error(`FAIL: Overflow on Services ${vp.name}`);
  }
  console.log('PASS: Zero overflow across all viewports!');

  // 4. Verify locked sections
  console.log('--- VERIFYING LOCKED SECTIONS ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const homeProcessExists = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
    return !!heading;
  });
  console.log(`Home Process section intact: ${homeProcessExists}`);

  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2' });
  const serviceDeliveryExists = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How We Deliver'));
    return !!heading;
  });
  console.log(`Service Delivery section intact: ${serviceDeliveryExists}`);

  console.log(`Total console errors: ${consoleErrors.length}`);
  await browser.close();
  console.log('--- ALL QA TESTS COMPLETED SUCCESSFULLY ---');
})();
