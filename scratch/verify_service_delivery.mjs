import puppeteer from 'puppeteer';

(async () => {
  console.log('--- VERIFYING UPGRADED SERVICE DELIVERY SECTION ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const viewports = [
    { width: 320, height: 680, name: '320px' },
    { width: 375, height: 812, name: '375px' },
    { width: 390, height: 844, name: '390px' },
    { width: 430, height: 932, name: '430px' },
    { width: 768, height: 1024, name: '768px' },
    { width: 1024, height: 768, name: '1024px' },
    { width: 1280, height: 800, name: '1280px' },
    { width: 1440, height: 900, name: '1440px' },
    { width: 1920, height: 1080, name: '1920px' },
  ];

  let testPassed = true;

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[CONSOLE ERROR]:', msg.text());
      testPassed = false;
    }
  });

  page.on('pageerror', err => {
    console.error('[PAGE ERROR]:', err.message);
    testPassed = false;
  });

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });

    const deliveryData = await page.evaluate(() => {
      const heading = document.querySelector('h2');
      const cards = Array.from(document.querySelectorAll('.group')).filter(el => el.textContent.includes('STEP'));
      return {
        cardsCount: cards.length,
        scrollW: document.documentElement.scrollWidth,
      };
    });

    if (deliveryData.scrollW > vp.width + 1) {
      console.error(`FAILED: Horizontal overflow at ${vp.name}! ScrollWidth: ${deliveryData.scrollW}px`);
      testPassed = false;
    } else {
      console.log(`✓ Viewport ${vp.name}: ${deliveryData.cardsCount} step cards rendered, 0 overflow.`);
    }
  }

  await browser.close();

  if (testPassed) {
    console.log('SUCCESS: Service Delivery section verification passed on all viewports!');
  } else {
    console.error('VERIFICATION FAILED!');
    process.exit(1);
  }
})();
