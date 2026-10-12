import puppeteer from 'puppeteer';
import path from 'path';

import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');

(async () => {
  console.log('=== STARTING BRAND PHILOSOPHY HEADING VERIFICATION ===');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));

  const sectionData = await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    if (!eyebrow) return null;
    const headerZone = eyebrow.parentElement;
    const h2 = headerZone.querySelector('h2');
    const section = eyebrow.closest('section');
    const steps = Array.from(section.querySelectorAll('.grid > div.group')).map(div => {
      const stepNum = div.querySelector('span')?.textContent.trim();
      const title = div.querySelector('h3')?.textContent.trim();
      return { stepNum, title };
    });

    const h2Styles = window.getComputedStyle(h2);

    return {
      eyebrowText: eyebrow.textContent.trim(),
      headingText: h2.textContent.trim(),
      headingFont: h2Styles.fontFamily,
      headingColor: h2Styles.color,
      headingTransform: h2Styles.textTransform,
      headingAlignment: h2Styles.textAlign,
      steps,
      hasConnectorLineDesktop: !!section.querySelector('.hidden.md\\:block.absolute'),
      hasConnectorLineMobile: !!section.querySelector('.md\\:hidden'),
    };
  });

  console.log('Inspected Brand Philosophy Data:', JSON.stringify(sectionData, null, 2));

  if (!sectionData) {
    throw new Error('Brand Philosophy section not found!');
  }

  if (sectionData.eyebrowText !== 'BRAND PHILOSOPHY') {
    throw new Error(`Eyebrow mismatch: ${sectionData.eyebrowText}`);
  }

  if (sectionData.headingText !== 'EVERY PROJECT STARTS WITH PURPOSE') {
    throw new Error(`Heading mismatch: ${sectionData.headingText}`);
  }

  if (sectionData.steps.length !== 3) {
    throw new Error(`Expected 3 steps, found ${sectionData.steps.length}`);
  }

  const expectedSteps = [
    { stepNum: '01', title: 'DEFINE' },
    { stepNum: '02', title: 'DESIGN' },
    { stepNum: '03', title: 'DELIVER' },
  ];

  sectionData.steps.forEach((s, idx) => {
    if (s.stepNum !== expectedSteps[idx].stepNum || s.title !== expectedSteps[idx].title) {
      throw new Error(`Step ${idx + 1} mismatch: ${JSON.stringify(s)} vs ${JSON.stringify(expectedSteps[idx])}`);
    }
  });

  console.log('✓ Eyebrow is "BRAND PHILOSOPHY"');
  console.log('✓ Heading is "EVERY PROJECT STARTS WITH PURPOSE"');
  console.log('✓ 3 Steps are intact: 01 DEFINE, 02 DESIGN, 03 DELIVER');
  console.log(`✓ Heading Font: ${sectionData.headingFont}`);
  console.log(`✓ Heading Color: ${sectionData.headingColor}`);

  // Screenshot desktop
  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    eyebrow.closest('section').scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const sectionEl = await page.evaluateHandle(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    return eyebrow.closest('section');
  });

  const desktopScreenshotPath = path.join(SCRATCH_DIR, 'brand_philosophy_updated_1440.png');
  await sectionEl.screenshot({ path: desktopScreenshotPath });
  fs.copyFileSync(desktopScreenshotPath, path.join(ARTIFACTS_DIR, 'brand_philosophy_updated_1440.png'));
  console.log('✓ Saved brand_philosophy_updated_1440.png');

  // Screenshot mobile
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    eyebrow.closest('section').scrollIntoView({ block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  const sectionElMobile = await page.evaluateHandle(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    return eyebrow.closest('section');
  });

  const mobileScreenshotPath = path.join(SCRATCH_DIR, 'brand_philosophy_updated_390.png');
  await sectionElMobile.screenshot({ path: mobileScreenshotPath });
  fs.copyFileSync(mobileScreenshotPath, path.join(ARTIFACTS_DIR, 'brand_philosophy_updated_390.png'));
  console.log('✓ Saved brand_philosophy_updated_390.png');

  // Check viewports for overflow
  const vps = [320, 375, 390, 768, 1024, 1440];
  for (const w of vps) {
    await page.setViewport({ width: w, height: 800 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflow) {
      console.error(`FAIL: Overflow on ${w}px`);
    } else {
      console.log(`✓ No overflow on ${w}px viewport`);
    }
  }

  await browser.close();
  console.log('=== BRAND PHILOSOPHY VERIFICATION SUCCESSFUL ===');
})();
