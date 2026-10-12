import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const viewports = [
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1280, height: 800, name: '1280x800' },
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 390, height: 844, name: '390x844' },
  { width: 430, height: 932, name: '430x932' },
];

(async () => {
  console.log('--- STARTING MULTI-STATE VISUAL & COORDINATE QA ---');
  const browser = await puppeteer.launch({ headless: true });
  const outputDir = path.join(process.cwd(), 'scratch', 'stack_qa');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    if (vp.width >= 768) {
      console.log(`\n=== VIEWPORT: ${vp.name} ===`);

      // Scroll down gradually and test 5 scroll states: 01, 03, 05, 08, 10
      const steps = [
        { label: 'State_01', scrollAmount: 0 },
        { label: 'State_03', scrollAmount: 1800 },
        { label: 'State_05', scrollAmount: 3600 },
        { label: 'State_08', scrollAmount: 6300 },
        { label: 'State_10', scrollAmount: 8500 },
      ];

      for (const step of steps) {
        await page.evaluate((scrollPos) => {
          const stack = document.getElementById('service-stack');
          if (stack) {
            const top = stack.offsetTop;
            window.scrollTo(0, top + scrollPos);
          }
        }, step.scrollAmount);

        await new Promise(r => setTimeout(r, 300));

        // Measure Header vs Card Stack bounding boxes
        const measure = await page.evaluate(() => {
          const header = document.querySelector('#service-stack div.max-w-3xl');
          const cardsContainer = document.querySelector('#service-stack [class*="max-w-\\[1280px\\]"]');
          const firstCard = document.querySelector('#service-stack [class*="absolute"]');

          const headerRect = header ? header.getBoundingClientRect() : null;
          const containerRect = cardsContainer ? cardsContainer.getBoundingClientRect() : null;
          const firstCardRect = firstCard ? firstCard.getBoundingClientRect() : null;

          return {
            headerBottom: headerRect ? headerRect.bottom : null,
            cardTop: firstCardRect ? firstCardRect.top : null,
            containerTop: containerRect ? containerRect.top : null,
            clearance: (firstCardRect && headerRect) ? (firstCardRect.top - headerRect.bottom) : null,
          };
        });

        console.log(`  [${step.label}]: Header Bottom: ${measure.headerBottom?.toFixed(1)}px, Card Top: ${measure.cardTop?.toFixed(1)}px | Safety Clearance: ${measure.clearance?.toFixed(1)}px`);

        if (measure.clearance < 10) {
          console.error(`  ⚠️ OVERLAP WARNING at ${step.label}! Clearance is ${measure.clearance}px`);
        }

        if (vp.name === '1440x900') {
          await page.screenshot({ path: path.join(outputDir, `${vp.name}_${step.label}.png`) });
        }
      }
    } else {
      console.log(`\n=== MOBILE VIEWPORT: ${vp.name} ===`);
      const overflow = await page.evaluate((vpWidth) => {
        return document.documentElement.scrollWidth > vpWidth + 1;
      }, vp.width);
      console.log(`  Horizontal Overflow: ${overflow ? 'FAILED' : 'CLEAN (0 Overflow)'}`);
      await page.screenshot({ path: path.join(outputDir, `${vp.name}_mobile.png`) });
    }

    await page.close();
  }

  await browser.close();
  console.log('\n--- MULTI-STATE QA COMPLETE ---');
})();
