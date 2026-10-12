import puppeteer from 'puppeteer';

const LANDSCAPE_SHORT = [
  { name: '700x320 (Short Landscape Mobile)', width: 700, height: 320 },
  { name: '844x390 (iPhone 14 Landscape)', width: 844, height: 390 },
  { name: '812x375 (iPhone X Landscape)', width: 812, height: 375 },
  { name: '932x430 (iPhone Pro Max Landscape)', width: 932, height: 430 },
  { name: '1024x600 (Netbook / Short Tablet)', width: 1024, height: 600 },
];

(async () => {
  console.log('=== SHORT SCREEN & LANDSCAPE AUDIT ===');
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const vp of LANDSCAPE_SHORT) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    try {
      await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 800));

      const metrics = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        const sec = document.querySelector('#services-showcase');
        const cardContainer = sec?.querySelector('.h-\\[74vh\\], [data-service-card]')?.parentElement?.parentElement;
        const card = sec?.querySelector('[data-service-card]');
        const h3 = card?.querySelector('h3');
        const img = card?.querySelector('img');

        const cardRect = card ? card.getBoundingClientRect() : null;
        const titleRect = h3 ? h3.getBoundingClientRect() : null;

        // Check if title or content overflows card or is clipped
        const isTitleClipped = cardRect && titleRect ? (titleRect.bottom > cardRect.bottom || titleRect.top < cardRect.top) : false;

        return {
          overflowX: docWidth > winWidth,
          docWidth,
          winWidth,
          winHeight,
          cardH: cardRect ? Math.round(cardRect.height) : 0,
          cardW: cardRect ? Math.round(cardRect.width) : 0,
          isTitleClipped,
          titleText: h3 ? h3.textContent.trim() : '',
          titleH: titleRect ? Math.round(titleRect.height) : 0,
        };
      });

      console.log(`[${vp.name}]`);
      console.log(`  Horizontal Overflow: ${metrics.overflowX ? 'FAIL' : 'PASS (0px)'}`);
      console.log(`  Card Size: ${metrics.cardW}x${metrics.cardH}px (Viewport H: ${metrics.winHeight}px)`);
      console.log(`  Title Clipped: ${metrics.isTitleClipped ? 'YES (DEFECT)' : 'NO (Clean)'} (Title H: ${metrics.titleH}px)`);

    } catch (e) {
      console.error(`Error on ${vp.name}:`, e.message);
    }
    await page.close();
  }

  await browser.close();
})();
