import puppeteer from 'puppeteer';

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

(async () => {
  console.log('=== STARTING DUAL-PAGE UNIFIED SERVICES SHOWCASE QA ===');
  const browser = await puppeteer.launch({ headless: true });

  for (const pageInfo of [
    { url: 'http://localhost:3000/', name: 'Home Page', expectedCards: 5, expectedFifthTitle: 'ROOF RENOVATION' },
    { url: 'http://localhost:3000/services', name: 'Services Page', expectedCards: 10, expectedFifthTitle: 'CLAY TILE ROOFING' },
  ]) {
    console.log(`\n========================================`);
    console.log(`VERIFYING PAGE: ${pageInfo.name} (${pageInfo.url})`);
    console.log(`========================================`);

    const page = await browser.newPage();

    // Check errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    // Test across viewports
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(pageInfo.url, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 400));

      const cardCount = await page.evaluate(() => {
        return document.querySelectorAll('#services-showcase [data-service-card]').length;
      });

      const fifthCardTitle = await page.evaluate(() => {
        const cards = document.querySelectorAll('#services-showcase [data-service-card]');
        if (cards.length >= 5) {
          const titleEl = cards[4].querySelector('h3');
          return titleEl ? titleEl.textContent.trim() : '';
        }
        return '';
      });

      console.log(`[Viewport ${vp.name}] Card Count: ${cardCount}, 5th Card: "${fifthCardTitle}"`);

      if (cardCount !== pageInfo.expectedCards) {
        console.error(`❌ Mismatch! Expected ${pageInfo.expectedCards} cards, found ${cardCount}`);
      }
    }

    // Perform desktop physical wheel pacing test on 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(pageInfo.url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Scroll to section
    await page.evaluate(() => {
      const el = document.getElementById('services-showcase');
      if (el) {
        const rect = el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + rect.top + 200);
      }
    });
    await new Promise(r => setTimeout(r, 500));

    console.log(`\nSimulating physical mouse wheel scrolling on ${pageInfo.name}...`);
    const cardVisits = [];
    let prevTitle = '';
    let ticks = 0;

    const totalWheelSteps = pageInfo.expectedCards === 5 ? 80 : 160;

    for (let step = 0; step < totalWheelSteps; step++) {
      await page.mouse.wheel({ deltaY: 100 });
      await new Promise(r => setTimeout(r, 35));

      const activeCard = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#services-showcase [data-service-card]'));
        let topTitle = '';
        let topZIndex = -1;
        cards.forEach((card) => {
          const style = window.getComputedStyle(card);
          const opacity = parseFloat(style.opacity);
          const title = card.querySelector('h3');
          if (opacity > 0.7 && title) {
            const zIndex = parseInt(style.zIndex || '0', 10);
            if (zIndex > topZIndex) {
              topZIndex = zIndex;
              topTitle = title.textContent.trim();
            }
          }
        });
        return topTitle;
      });

      if (activeCard && activeCard !== prevTitle) {
        if (prevTitle) {
          cardVisits.push({ card: prevTitle, ticks });
        }
        prevTitle = activeCard;
        ticks = 1;
      } else {
        ticks++;
      }
    }
    if (prevTitle) {
      cardVisits.push({ card: prevTitle, ticks });
    }

    console.log(`Card progression observed on ${pageInfo.name}:`);
    cardVisits.forEach((v) => console.log(`  Card "${v.card}": ${v.ticks} wheel ticks (~${v.ticks * 100}px scroll)`));

    console.log(`Console Errors count: ${errors.length}`);
    await page.close();
  }

  await browser.close();
  console.log('\n=== DUAL-PAGE UNIFIED SERVICES SHOWCASE QA FINISHED ===');
})();
