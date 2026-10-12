import puppeteer from 'puppeteer';

const VIEWPORTS = [
  { name: '375x812 (Mobile)', width: 375, height: 812 },
  { name: '768x1024 (Tablet)', width: 768, height: 1024 },
  { name: '1024x768 (Tablet Landscape)', width: 1024, height: 768 },
  { name: '1440x900 (Desktop)', width: 1440, height: 900 },
];

(async () => {
  console.log('=== INSPECTING PROCESS SECTION ON ALL DEVICES ===');
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1200));

    const data = await page.evaluate(() => {
      // Find Process section
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
      const sec = heading?.closest('section');
      if (!sec) return { found: false };

      const desktopStage = sec.querySelector('.lg\\:flex');
      const mobileStage = sec.querySelector('.lg\\:hidden');
      const activeStage = window.innerWidth >= 1024 ? desktopStage : mobileStage;

      const stageRect = activeStage ? activeStage.getBoundingClientRect() : null;
      const secRect = sec.getBoundingClientRect();

      // Check all 6 cards
      const cards = Array.from(sec.querySelectorAll('.process-circle')).map(c => {
        const circleRect = c.getBoundingClientRect();
        const cardBox = c.closest('.flex')?.querySelector('.rounded-2xl') || c.parentElement?.nextElementSibling;
        return {
          id: c.textContent.trim(),
          top: Math.round(circleRect.top),
          bottom: Math.round(circleRect.bottom),
          height: Math.round(circleRect.height),
        };
      });

      return {
        found: true,
        winW: window.innerWidth,
        winH: window.innerHeight,
        secHeight: Math.round(secRect.height),
        stageHeight: stageRect ? Math.round(stageRect.height) : 0,
        activeStageIsDesktop: window.innerWidth >= 1024,
        cards,
      };
    });

    console.log(`\n[${vp.name}]`);
    console.log(`  Stage Height: ${data.stageHeight}px (Viewport H: ${data.winH}px)`);
    console.log(`  Stage > Viewport: ${data.stageHeight > data.winH ? 'YES (OVERFLOWS VIEWPORT WHEN PINNED!)' : 'NO'}`);
    console.log(`  Cards found: ${data.cards.length}`);

    // Scroll to process section and check pinning
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
      heading?.scrollIntoView({ block: 'start' });
    });
    await new Promise(r => setTimeout(r, 500));

    // Check which cards are within the viewport when pinned at start: "top 18%"
    const visibility = await page.evaluate(() => {
      const circles = Array.from(document.querySelectorAll('.process-circle'));
      const winH = window.innerHeight;
      return circles.map(c => {
        const r = c.getBoundingClientRect();
        return {
          id: c.textContent.trim(),
          top: Math.round(r.top),
          inViewport: r.top >= 0 && r.bottom <= winH,
          offscreenBottom: r.top > winH,
        };
      });
    });

    console.log(`  Card visibility when pinned:`);
    visibility.forEach(v => {
      console.log(`    Step ${v.id}: top=${v.top}px, inViewport=${v.inViewport}, offscreenBottom=${v.offscreenBottom}`);
    });

    await page.close();
  }

  await browser.close();
})();
