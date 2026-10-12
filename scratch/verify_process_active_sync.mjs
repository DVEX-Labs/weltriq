import puppeteer from 'puppeteer';

(async () => {
  console.log('--- STARTING INTENSIVE PROCESS ACTIVE CARD SYNC AUDIT ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

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

  const stagesToTest = [
    { name: 'Desktop (1440px)', width: 1440, height: 900 },
    { name: 'Mobile (390px)', width: 390, height: 844 },
  ];

  for (const stage of stagesToTest) {
    console.log(`\n==================================================`);
    console.log(`Testing ${stage.name}...`);
    console.log(`==================================================`);

    await page.setViewport({ width: stage.width, height: stage.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Get section top and height
    const sectionInfo = await page.evaluate(() => {
      const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process') || s.textContent.includes('OUR PROCESS'));
      if (!sec) return null;
      const rect = sec.getBoundingClientRect();
      return {
        top: rect.top + window.pageYOffset,
        height: sec.offsetHeight,
      };
    });

    if (!sectionInfo) {
      console.error(`ERROR: Process section not found!`);
      testPassed = false;
      continue;
    }

    console.log(`Process Section Top: ${sectionInfo.top}px, Height: ${sectionInfo.height}px`);

    const startScroll = Math.max(0, sectionInfo.top - 50);
    const endScroll = sectionInfo.top + sectionInfo.height + 400;
    const stepSize = 40;

    let maxActiveCountSeen = 0;
    const activeCardsSequence = [];

    for (let y = startScroll; y <= endScroll; y += stepSize) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await new Promise(r => setTimeout(r, 25));

      const frameStatus = await page.evaluate(() => {
        const processSection = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process'));
        if (!processSection) return null;

        // Query all card containers containing PHASE 0
        const cards = Array.from(processSection.querySelectorAll('div')).filter(c => {
          return c.textContent.includes('PHASE 0') && (c.classList.contains('rounded-2xl') || c.querySelector('.rounded-2xl'));
        });

        if (cards.length === 0) return null;

        // De-duplicate cards to 6 unique steps
        const uniqueCards = [];
        const seenPhases = new Set();
        cards.forEach(c => {
          const phaseMatch = c.textContent.match(/PHASE 0[1-6]/);
          if (phaseMatch && !seenPhases.has(phaseMatch[0])) {
            seenPhases.add(phaseMatch[0]);
            uniqueCards.push(c);
          }
        });

        const activeIndices = [];
        uniqueCards.forEach((c, idx) => {
          const innerCard = c.classList.contains('rounded-2xl') ? c : (c.querySelector('.rounded-2xl') || c);
          const inlineStyle = innerCard.getAttribute('style') || '';
          const iconBox = (c.querySelector('.h-8.w-8') || c.querySelector('.h-7.w-7'));
          const iconStyle = iconBox ? (iconBox.getAttribute('style') || '') : '';

          const isYellowBorder = inlineStyle.includes('255, 198, 39') || inlineStyle.includes('FFC627');
          const isYellowIcon = iconStyle.includes('255, 198, 39') || iconStyle.includes('FFC627');

          if (isYellowBorder || isYellowIcon) {
            activeIndices.push(idx);
          }
        });

        return { activeIndices, count: uniqueCards.length };
      });

      if (frameStatus && frameStatus.activeIndices.length > 0) {
        if (frameStatus.activeIndices.length > maxActiveCountSeen) {
          maxActiveCountSeen = frameStatus.activeIndices.length;
        }

        const currentActive = frameStatus.activeIndices[0];
        if (activeCardsSequence.length === 0 || activeCardsSequence[activeCardsSequence.length - 1] !== currentActive) {
          activeCardsSequence.push(currentActive);
        }
      }
    }

    console.log(`Active Step Sequence Progression:`, activeCardsSequence.map(i => `Step 0${i + 1}`).join(' -> '));
    console.log(`Max Simultaneously Active Cards Seen: ${maxActiveCountSeen}`);

    if (maxActiveCountSeen > 2) {
      console.error(`FAILED: More than 2 cards active simultaneously on ${stage.name}! (Seen: ${maxActiveCountSeen})`);
      testPassed = false;
    }

    if (activeCardsSequence.length < 5) {
      console.error(`FAILED: Did not progress through all process steps on ${stage.name}!`);
      testPassed = false;
    }

    // Reverse Scroll Audit
    console.log(`Auditing Reverse Scroll on ${stage.name}...`);
    const reverseSequence = [];
    for (let y = endScroll; y >= startScroll; y -= stepSize * 2) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await new Promise(r => setTimeout(r, 20));

      const revActive = await page.evaluate(() => {
        const processSection = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process'));
        if (!processSection) return null;

        const cards = Array.from(processSection.querySelectorAll('div')).filter(c => {
          return c.textContent.includes('PHASE 0') && (c.classList.contains('rounded-2xl') || c.querySelector('.rounded-2xl'));
        });

        const seenPhases = new Set();
        let idx = 0;
        for (const c of cards) {
          const phaseMatch = c.textContent.match(/PHASE 0[1-6]/);
          if (phaseMatch && !seenPhases.has(phaseMatch[0])) {
            seenPhases.add(phaseMatch[0]);
            const innerCard = c.classList.contains('rounded-2xl') ? c : (c.querySelector('.rounded-2xl') || c);
            const style = innerCard.getAttribute('style') || '';
            if (style.includes('255, 198, 39') || style.includes('FFC627')) {
              return idx;
            }
            idx++;
          }
        }
        return null;
      });

      if (revActive !== null && (reverseSequence.length === 0 || reverseSequence[reverseSequence.length - 1] !== revActive)) {
        reverseSequence.push(revActive);
      }
    }

    console.log(`Reverse Active Sequence:`, reverseSequence.map(i => `Step 0${i + 1}`).join(' -> '));
  }

  // Viewport Overflow Test
  const viewports = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
  for (const vp of viewports) {
    await page.setViewport({ width: vp, height: 800 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    const overflow = await page.evaluate((w) => document.documentElement.scrollWidth > w + 1, vp);
    if (overflow) {
      console.error(`FAILED: Horizontal overflow at ${vp}px!`);
      testPassed = false;
    } else {
      console.log(`✓ Viewport ${vp}px: No horizontal overflow.`);
    }
  }

  await browser.close();

  if (testPassed) {
    console.log('\n==================================================');
    console.log('SUCCESS: PROCESS ACTIVE CARD SYNC AUDIT PASSED 100%!');
    console.log('==================================================');
  } else {
    console.error('VERIFICATION FAILED!');
    process.exit(1);
  }
})();
