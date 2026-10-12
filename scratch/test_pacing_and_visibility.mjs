import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

(async () => {
  console.log('--- STARTING INTENSIVE VISUAL CARD VISIBILITY & PACING TEST ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const outputDir = path.join(process.cwd(), 'scratch', 'pacing_screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pagesToTest = [
    { name: 'home', path: '/', count: 5 },
    { name: 'services', path: '/services', count: 10 }
  ];

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

  for (const targetPage of pagesToTest) {
    console.log(`\n==================================================`);
    console.log(`Testing ${targetPage.name.toUpperCase()} page (${targetPage.count} services)...`);
    console.log(`==================================================`);

    // 1. Test Desktop Scroll Visibility & Progression at 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:3000${targetPage.path}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Get section offsets
    const sectionInfo = await page.evaluate(() => {
      const sec = document.querySelector('#services-showcase');
      if (!sec) return null;
      const rect = sec.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return {
        top: rect.top + scrollTop,
        height: sec.offsetHeight,
      };
    });

    if (!sectionInfo) {
      console.error(`ERROR: #services-showcase not found on ${targetPage.name}`);
      testPassed = false;
      continue;
    }

    console.log(`Section Top: ${sectionInfo.top}px, Section Height: ${sectionInfo.height}px`);

    // Scroll step by step through the section
    const startScroll = Math.max(0, sectionInfo.top - 100);
    const endScroll = sectionInfo.top + sectionInfo.height + 500;
    const stepSize = 80;

    let minActiveOpacity = 1;
    let maxBlankGapCount = 0;
    let currentMaxCardSeen = 0;

    for (let scrollY = startScroll; scrollY <= endScroll; scrollY += stepSize) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await new Promise(r => setTimeout(r, 40));

      const frameData = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('[data-service-card]'));
        if (cards.length === 0) return null;

        const viewportHeight = window.innerHeight;

        const visibleCards = cards.map((c, i) => {
          const rect = c.getBoundingClientRect();
          const style = window.getComputedStyle(c);
          const opacity = parseFloat(style.opacity);
          const transform = style.transform;
          const isVisible = rect.bottom > 0 && rect.top < viewportHeight && opacity > 0.5;
          return {
            index: i,
            id: c.getAttribute('data-service-card'),
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height,
            opacity,
            transform,
            isVisible
          };
        });

        const activeCard = visibleCards.reduce((prev, curr) => {
          if (!prev) return curr;
          return curr.opacity > prev.opacity ? curr : prev;
        }, null);

        return {
          viewportHeight,
          cards: visibleCards,
          activeCard,
        };
      });

      if (frameData && frameData.activeCard) {
        if (frameData.activeCard.opacity < minActiveOpacity) {
          minActiveOpacity = frameData.activeCard.opacity;
        }

        if (frameData.activeCard.index > currentMaxCardSeen) {
          currentMaxCardSeen = frameData.activeCard.index;
        }

        if (frameData.activeCard.opacity < 0.8) {
          maxBlankGapCount++;
          console.warn(`[LOW VISIBILITY WARNING] ScrollY: ${scrollY}px - Active Card Opacity: ${frameData.activeCard.opacity}`);
        }
      }
    }

    console.log(`Min Active Card Opacity seen: ${minActiveOpacity.toFixed(2)}`);
    console.log(`Max Card Index Reached: ${currentMaxCardSeen + 1} / ${targetPage.count}`);

    if (minActiveOpacity < 0.8) {
      console.error(`FAILED: Active card opacity dropped below 0.8 on ${targetPage.name}!`);
      testPassed = false;
    }

    if (currentMaxCardSeen + 1 < targetPage.count) {
      console.error(`FAILED: Did not progress through all ${targetPage.count} cards on ${targetPage.name}!`);
      testPassed = false;
    }

    // Reverse Scroll Test
    console.log(`Testing Reverse Scroll on ${targetPage.name}...`);
    for (let scrollY = endScroll; scrollY >= startScroll; scrollY -= stepSize * 2) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await new Promise(r => setTimeout(r, 30));
    }
    console.log(`Reverse Scroll finished cleanly.`);

    // 2. Test All Responsive Viewports
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:3000${targetPage.path}`, { waitUntil: 'networkidle0' });

      // Check horizontal overflow
      const overflow = await page.evaluate((vpWidth) => {
        return document.documentElement.scrollWidth > vpWidth + 1;
      }, vp.width);

      if (overflow) {
        console.error(`FAILED: Horizontal overflow on ${targetPage.name} at ${vp.name}!`);
        testPassed = false;
      } else {
        console.log(`✓ Viewport ${vp.name} (${targetPage.name}): No overflow.`);
      }
    }
  }

  await browser.close();

  if (testPassed) {
    console.log('\n==================================================');
    console.log('SUCCESS: ALL VISUAL VISIBILITY & PACING TESTS PASSED!');
    console.log('==================================================');
  } else {
    console.error('\nTEST FAILED! Check logs above.');
    process.exit(1);
  }
})();
