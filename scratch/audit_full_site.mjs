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
  { name: '1024x768 (Laptop / Tablet Landscape)', width: 1024, height: 768 },
  { name: '1280x800 (Laptop)', width: 1280, height: 800 },
  { name: '1440x900 (Desktop)', width: 1440, height: 900 },
  { name: '1920x1080 (Wide Desktop)', width: 1920, height: 1080 },
];

const ROUTES = [
  '/',
  '/services',
  '/about',
  '/blog',
  '/contact',
];

(async () => {
  console.log('=== COMMENCING SYSTEMATIC RESPONSIVE AUDIT ===');
  const browser = await puppeteer.launch({ headless: 'new' });
  const results = [];

  for (const route of ROUTES) {
    console.log(`\nTesting Route: ${route}`);
    const page = await browser.newPage();
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      try {
        await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await new Promise(r => setTimeout(r, 700));

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const bodyWidth = document.body.scrollWidth;
          const badEls = [];
          document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > window.innerWidth + 1) {
              badEls.push({
                tag: el.tagName,
                className: typeof el.className === 'string' ? el.className.slice(0, 60) : '',
                id: el.id,
                right: Math.round(r.right),
                excess: Math.round(r.right - window.innerWidth),
              });
            }
          });
          return {
            hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
            docWidth,
            winWidth,
            badElements: badEls.slice(0, 5),
          };
        });

        // Check ServicesShowcase status if on / or /services
        let servicesInfo = null;
        if (route === '/' || route === '/services') {
          servicesInfo = await page.evaluate(() => {
            const sec = document.querySelector('#services-showcase');
            if (!sec) return null;
            const cards = sec.querySelectorAll('[data-service-card]');
            const stackWrapper = sec.querySelector('.min-h-screen');
            return {
              sectionFound: true,
              cardCount: cards.length,
              firstCardHeight: cards[0]?.offsetHeight,
              firstCardWidth: cards[0]?.offsetWidth,
              stackWrapperHeight: stackWrapper?.offsetHeight,
            };
          });
        }

        results.push({
          route,
          viewport: vp.name,
          width: vp.width,
          overflow,
          servicesInfo,
          errors: [...errors],
        });

        if (overflow.hasOverflow) {
          console.warn(`  ⚠️ OVERFLOW detected at ${vp.name}: doc=${overflow.docWidth}px vs win=${overflow.winWidth}px`);
          console.warn('    Elements causing overflow:', overflow.badElements);
        } else {
          console.log(`  ✓ ${vp.name}: Clean (no overflow)`);
        }
      } catch (err) {
        console.error(`  ❌ Error testing ${vp.name}:`, err.message);
      }
    }
    await page.close();
  }

  await browser.close();
  console.log('\n=== AUDIT RUN COMPLETED ===');
})();
