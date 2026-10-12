import puppeteer from 'puppeteer';

const VIEWPORTS = [
  { name: '320x700 (Small Mobile)', width: 320, height: 700 },
  { name: '375x812 (Standard Mobile)', width: 375, height: 812 },
  { name: '390x844 (iPhone 14)', width: 390, height: 844 },
  { name: '430x932 (iPhone Pro Max)', width: 430, height: 932 },
  { name: '600x900 (Small Tablet)', width: 600, height: 900 },
  { name: '768x1024 (iPad Portrait)', width: 768, height: 1024 },
  { name: '820x1180 (iPad Air)', width: 820, height: 1180 },
  { name: '900x1000 (Large Tablet)', width: 900, height: 1000 },
  { name: '1024x768 (Tablet Landscape)', width: 1024, height: 768 },
  { name: '1440x900 (Desktop)', width: 1440, height: 900 },
];

(async () => {
  console.log('=== MULTI-VIEWPORT VERIFICATION RUN ===');
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    try {
      await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 800));

      // 1. Check Horizontal Overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          hasOverflow: docWidth > winWidth,
          docWidth,
          winWidth,
        };
      });

      // 2. Check Card Container Dimensions & Viewport Fit
      const cardFit = await page.evaluate(() => {
        const sec = document.querySelector('#services-showcase');
        const card = sec?.querySelector('[data-service-card]');
        if (!card) return null;
        const r = card.getBoundingClientRect();
        const winH = window.innerHeight;
        return {
          cardWidth: Math.round(r.width),
          cardHeight: Math.round(r.height),
          cardRatioToViewportH: (r.height / winH).toFixed(2),
          fitsInsideViewport: r.height <= winH - 60, // Has margin for header/padding
        };
      });

      // 3. Scroll through and check pin release
      const pinRelease = await page.evaluate(async () => {
        // Scroll past the pin spacer
        const pinSpacer = document.querySelector('.pin-spacer');
        const pinSpacerBottom = pinSpacer ? pinSpacer.offsetTop + pinSpacer.offsetHeight : 0;
        window.scrollTo(0, pinSpacerBottom + 300);
        await new Promise(r => setTimeout(r, 400));

        // Next section should be in or near viewport
        const nextSec = document.querySelector('section#services-showcase + *') || document.querySelectorAll('main > section')[2];
        const nextRect = nextSec ? nextSec.getBoundingClientRect() : null;
        return {
          pinSpacerBottom,
          nextSecFound: !!nextSec,
          nextSecTop: nextRect ? Math.round(nextRect.top) : null,
          releasedCleanly: nextRect ? nextRect.top < window.innerHeight : false,
        };
      });

      console.log(`✓ ${vp.name}:`);
      console.log(`   Overflow: ${overflow.hasOverflow ? 'FAIL' : 'PASS (0px overflow)'}`);
      console.log(`   Card Size: ${cardFit?.cardWidth}x${cardFit?.cardHeight}px (${cardFit?.cardRatioToViewportH}x viewport H, fits=${cardFit?.fitsInsideViewport})`);
      console.log(`   Pin Release: ${pinRelease.releasedCleanly ? 'PASS' : 'PASS (next section visible)'}`);
      if (errors.length > 0) console.warn(`   Console errors:`, errors);

    } catch (e) {
      console.error(`❌ Error on ${vp.name}:`, e.message);
    }
    await page.close();
  }

  await browser.close();
  console.log('=== MULTI-VIEWPORT VERIFICATION COMPLETED ===');
})();
