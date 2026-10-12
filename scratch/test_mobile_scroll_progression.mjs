import puppeteer from 'puppeteer';

(async () => {
  console.log('=== TESTING MOBILE PROCESS SCROLL & PROGRESSION ===');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Find Process section and its cards
  const secInfo = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
    const sec = heading?.closest('section');
    return sec ? { top: sec.offsetTop, height: sec.offsetHeight } : null;
  });

  console.log('Process Section:', secInfo);

  // Check whether the mobile stage has a .pin-spacer wrapping it
  const isPinned = await page.evaluate(() => {
    const mobileStage = document.querySelector('.lg\\:hidden');
    return mobileStage ? !!mobileStage.closest('.pin-spacer') : false;
  });
  console.log(`Mobile Stage Pinned: ${isPinned} (Must be false for natural unpinned scrolling!)`);

  // Scroll through each card and verify it enters the viewport
  const scrollSteps = [0, 200, 400, 600, 800, 1000, 1200];
  const stepResults = [];

  for (const offset of scrollSteps) {
    const scrollY = secInfo.top + offset;
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise(r => setTimeout(r, 200));

    const frame = await page.evaluate(() => {
      const winH = window.innerHeight;
      const circles = Array.from(document.querySelectorAll('.lg\\:hidden .process-circle'));
      const cards = Array.from(document.querySelectorAll('.lg\\:hidden [class*="rounded-2xl"]'));

      return circles.map((c, i) => {
        const cRect = c.getBoundingClientRect();
        const cardRect = cards[i] ? cards[i].getBoundingClientRect() : null;
        const cStyle = window.getComputedStyle(c);
        const cardStyle = cards[i] ? window.getComputedStyle(cards[i]) : null;

        const isCircleActive = cStyle.backgroundColor.includes('12, 21, 51') && (cStyle.color.includes('255, 198, 39') || cStyle.borderColor.includes('12, 21, 51'));
        const isCardActive = cardStyle ? (cardStyle.borderColor.includes('255, 198, 39') || cardStyle.boxShadow.includes('rgba(12, 21, 51, 0.12)')) : false;

        return {
          step: i + 1,
          circleTop: Math.round(cRect.top),
          inViewport: cRect.top >= 0 && cRect.bottom <= winH,
          isCircleActive,
          isCardActive,
        };
      });
    });

    const activeSteps = frame.filter(f => f.isCircleActive || f.isCardActive).map(f => f.step);
    const visibleSteps = frame.filter(f => f.inViewport).map(f => f.step);
    console.log(`Scroll offset +${offset}px: Visible steps: [${visibleSteps.join(', ')}], Active steps: [${activeSteps.join(', ')}]`);
    stepResults.push({ offset, activeSteps, visibleSteps });
  }

  // Also check desktop clipping at 1024px
  await page.setViewport({ width: 1024, height: 768 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));

  const desktopClip = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.lg\\:flex [class*="left-"]')).filter(el => el.classList.contains('w-[240px]') || el.classList.contains('w-[275px]'));
    return cards.map((c, i) => {
      const r = c.getBoundingClientRect();
      return {
        step: i + 1,
        left: Math.round(r.left),
        right: Math.round(r.right),
        clippedLeft: r.left < 0,
        clippedRight: r.right > window.innerWidth,
      };
    });
  });

  console.log('\nDesktop 1024px Card Positions:');
  desktopClip.forEach(c => {
    console.log(`  Step ${c.step}: left=${c.left}px, right=${c.right}px, clippedLeft=${c.clippedLeft}, clippedRight=${c.clippedRight}`);
  });

  await browser.close();
})();
