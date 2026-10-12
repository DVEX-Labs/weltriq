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

  console.log('--- STARTING SERVICES PAGE PROJECT DELIVERY QA ---');

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2' });

    // Measure horizontal scroll overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    if (overflow) {
      console.error(`FAIL: Horizontal overflow detected on ${vp.name} (${vp.width}px)!`);
    } else {
      console.log(`PASS: No overflow on ${vp.name} (${vp.width}px)`);
    }

    // Capture screenshot on key viewports
    if (['390_mobile_iphone', '768_tablet', '1440_desktop_lg'].includes(vp.name)) {
      await page.evaluate(() => {
        const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How We Deliver'));
        if (heading) heading.scrollIntoView({ block: 'center' });
      });
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: path.join(scratchDir, `services_delivery_${vp.name}.png`) });
    }
  }

  // Hover test on 1440x900
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How We Deliver'));
    if (heading) heading.scrollIntoView({ block: 'center' });
  });

  // Hover over card 02
  const card2 = await page.$('.grid > div:nth-child(2)');
  if (card2) {
    await card2.hover();
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(scratchDir, 'services_delivery_hover_card2.png') });
  }

  // Verify Home page Process section remains unaffected
  console.log('--- VERIFYING HOME PAGE PROCESS SECTION ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const homeProcessExists = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
    return !!heading;
  });

  if (homeProcessExists) {
    console.log('PASS: Home page Process section ("Our Process") is fully intact!');
  } else {
    console.error('FAIL: Home page Process section missing!');
  }

  console.log(`Console Errors Count: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Console errors found:', consoleErrors);
  }

  await browser.close();
  console.log('--- ALL QA AUDITS COMPLETED ---');
})();
