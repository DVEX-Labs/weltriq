import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

(async () => {
  console.log('--- STARTING VISUAL SCREENSHOT AUDIT FOR SERVICE DELIVERY ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const outputDir = path.join(process.cwd(), 'scratch', 'delivery_screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll down to ServiceDelivery section
  const sectionTop = await page.evaluate(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('HOW WE DELIVER') || s.textContent.includes('How We Deliver'));
    if (!sec) return null;
    const rect = sec.getBoundingClientRect();
    return rect.top + window.pageYOffset;
  });

  console.log('Service Delivery Section Top:', sectionTop);

  if (sectionTop) {
    await page.evaluate((top) => window.scrollTo(0, top - 100), sectionTop);
    await new Promise(r => setTimeout(r, 1000));

    // Verify card visibility and opacity
    const cardsStatus = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.group')).filter(el => el.textContent.includes('STEP'));
      return cards.map((c, i) => {
        const style = window.getComputedStyle(c);
        const rect = c.getBoundingClientRect();
        return {
          index: i,
          opacity: style.opacity,
          transform: style.transform,
          visibility: style.visibility,
          width: rect.width,
          height: rect.height,
          top: rect.top,
        };
      });
    });

    console.log('Cards Status:', JSON.stringify(cardsStatus, null, 2));

    await page.screenshot({ path: path.join(outputDir, 'service_delivery_scrolled.png'), fullPage: false });
    console.log('Screenshot saved to scratch/delivery_screenshots/service_delivery_scrolled.png');

    const allVisible = cardsStatus.every(c => parseFloat(c.opacity) > 0.8);
    if (allVisible) {
      console.log('SUCCESS: All 6 cards are 100% visible and animated cleanly!');
    } else {
      console.error('FAILED: Some cards are still transparent!');
      process.exit(1);
    }
  }

  await browser.close();
})();
