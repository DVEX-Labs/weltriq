import puppeteer from 'puppeteer';

(async () => {
  console.log('--- STARTING ACCURATE PROCESS AUDIT ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let testPassed = true;

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[CONSOLE ERROR]:', msg.text());
      testPassed = false;
    }
  });

  const stages = [
    { name: 'Desktop (1440px)', width: 1440, height: 900, isDesktop: true },
    { name: 'Mobile (390px)', width: 390, height: 844, isDesktop: false }
  ];

  for (const stage of stages) {
    console.log(`\n==================================================`);
    console.log(`Testing ${stage.name}...`);
    console.log(`==================================================`);

    await page.setViewport({ width: stage.width, height: stage.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const sectionInfo = await page.evaluate(() => {
      const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process'));
      if (!sec) return null;
      const rect = sec.getBoundingClientRect();
      return { top: rect.top + window.pageYOffset, height: sec.offsetHeight };
    });

    if (!sectionInfo) {
      console.error(`ERROR: Process section not found!`);
      testPassed = false;
      continue;
    }

    console.log(`Process Section Top: ${sectionInfo.top}px, Initial Height: ${sectionInfo.height}px`);

    const startScroll = Math.max(0, sectionInfo.top - 50);
    // Desktop pin spacer extends scroll duration by +=220% (~3200px total scroll distance)
    const endScroll = sectionInfo.top + (stage.isDesktop ? 3300 : sectionInfo.height + 400);
    const stepSize = 40;

    let maxActiveCount = 0;
    const activeSequence = [];

    for (let y = startScroll; y <= endScroll; y += stepSize) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await new Promise(r => setTimeout(r, 25));

      const activeState = await page.evaluate((isDesk) => {
        const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process'));
        if (!sec) return null;

        const stageDiv = isDesk
          ? sec.querySelector('.hidden.lg\\:flex')
          : sec.querySelector('.lg\\:hidden');
        if (!stageDiv) return null;

        const innerCards = Array.from(stageDiv.querySelectorAll('.rounded-2xl'));
        const activeIndices = [];

        innerCards.forEach((c, idx) => {
          const style = c.getAttribute('style') || '';
          if (style.includes('255, 198, 39') || style.includes('FFC627')) {
            activeIndices.push(idx);
          }
        });

        return { activeIndices, count: innerCards.length };
      }, stage.isDesktop);

      if (activeState && activeState.activeIndices.length > 0) {
        if (activeState.activeIndices.length > maxActiveCount) {
          maxActiveCount = activeState.activeIndices.length;
        }

        const current = activeState.activeIndices[0];
        if (activeSequence.length === 0 || activeSequence[activeSequence.length - 1] !== current) {
          activeSequence.push(current);
        }
      }
    }

    console.log(`Active Step Progression:`, activeSequence.map(i => `Step 0${i + 1}`).join(' -> '));
    console.log(`Max Active Cards Simultaneously: ${maxActiveCount}`);

    if (maxActiveCount > 2) {
      console.error(`FAILED: More than 2 active cards simultaneously! (Seen: ${maxActiveCount})`);
      testPassed = false;
    }

    if (activeSequence.length < 6) {
      console.error(`FAILED: Did not progress through all 6 steps! (Progressed: ${activeSequence.length})`);
      testPassed = false;
    }

    // Reverse Scroll Audit
    console.log(`Auditing Reverse Scroll on ${stage.name}...`);
    const reverseSequence = [];
    for (let y = endScroll; y >= startScroll; y -= stepSize * 2) {
      await page.evaluate((pos) => window.scrollTo(0, pos), y);
      await new Promise(r => setTimeout(r, 20));

      const revActive = await page.evaluate((isDesk) => {
        const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process'));
        if (!sec) return null;
        const stageDiv = isDesk
          ? sec.querySelector('.hidden.lg\\:flex')
          : sec.querySelector('.lg\\:hidden');
        if (!stageDiv) return null;
        const innerCards = Array.from(stageDiv.querySelectorAll('.rounded-2xl'));
        for (let idx = 0; idx < innerCards.length; idx++) {
          const style = innerCards[idx].getAttribute('style') || '';
          if (style.includes('255, 198, 39') || style.includes('FFC627')) {
            return idx;
          }
        }
        return null;
      }, stage.isDesktop);

      if (revActive !== null && (reverseSequence.length === 0 || reverseSequence[reverseSequence.length - 1] !== revActive)) {
        reverseSequence.push(revActive);
      }
    }

    console.log(`Reverse Active Sequence:`, reverseSequence.map(i => `Step 0${i + 1}`).join(' -> '));
  }

  await browser.close();

  if (testPassed) {
    console.log('\n==================================================');
    console.log('SUCCESS: PROCESS ACTIVE CARD SYNC PASSED 100%!');
    console.log('==================================================');
  } else {
    console.error('\nVERIFICATION FAILED!');
    process.exit(1);
  }
})();
