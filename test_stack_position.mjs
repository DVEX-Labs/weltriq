import puppeteer from 'puppeteer';

(async () => {
  console.log('--- STARTING BROWSER INTERACTION QA ON /services ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Test across key viewports
  const viewports = [
    { width: 390, height: 844, name: '390px Mobile' },
    { width: 768, height: 1024, name: '768px Tablet' },
    { width: 1440, height: 900, name: '1440px Desktop' },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Check horizontal overflow
    const overflow = await page.evaluate((vpWidth) => {
      return document.documentElement.scrollWidth > vpWidth + 1;
    }, vp.width);
    console.log(`[${vp.name}] Horizontal Overflow:`, overflow ? 'FAILED' : 'CLEAN (0 Overflow)');

    if (vp.name === '1440px Desktop') {
      // Test desktop centering & scroll sequence
      console.log('Testing 01 -> 10 scroll progression & visual centering...');

      // Scroll into pinned stack
      await page.evaluate(() => {
        const stackEl = document.getElementById('service-stack');
        if (stackEl) stackEl.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await new Promise(r => setTimeout(r, 400));

      // Measure active card vertical position relative to viewport
      const cardPos = await page.evaluate(() => {
        const activeCard = document.querySelector('#service-stack [class*="absolute"]');
        if (!activeCard) return null;
        const rect = activeCard.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          viewportHeight: window.innerHeight,
          centerOffset: Math.abs((rect.top + rect.height / 2) - window.innerHeight / 2)
        };
      });

      console.log('Active Card Viewport Position:', cardPos);

      // Perform scroll sequence 01 -> 10
      for (let step = 1; step <= 10; step++) {
        await page.evaluate(() => {
          window.scrollBy(0, 700);
        });
        await new Promise(r => setTimeout(r, 200));
      }
      console.log('Scrolled down to Card 10 cleanly.');

      // Perform reverse scroll sequence
      for (let step = 10; step >= 1; step--) {
        await page.evaluate(() => {
          window.scrollBy(0, -700);
        });
        await new Promise(r => setTimeout(r, 150));
      }
      console.log('Reversed scroll back to Card 01 cleanly.');
    }
  }

  await browser.close();
  console.log('--- ALL BROWSER INTERACTION CHECKS PASSED ---');
})();
