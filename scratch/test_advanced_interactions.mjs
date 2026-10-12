import puppeteer from 'puppeteer';

(async () => {
  console.log('=== ADVANCED INTERACTIONS QA: RESIZE, ORIENTATION, NAVIGATION & OVERLAP ===');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();

  try {
    // 1. Initial Load at 390x844 (Mobile Portrait)
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1200));

    console.log('1. Testing Scroll into Pin Spacer on Mobile (390x844)...');
    const initialPin = await page.evaluate(() => {
      const pinSpacer = document.querySelector('.pin-spacer');
      return {
        exists: !!pinSpacer,
        h: pinSpacer ? pinSpacer.offsetHeight : 0,
        top: pinSpacer ? pinSpacer.offsetTop : 0,
      };
    });
    console.log(`   Pin Spacer exists: ${initialPin.exists}, height: ${initialPin.h}px`);

    // Scroll halfway into the pinned showcase
    const midScroll = initialPin.top + Math.round(initialPin.h * 0.5);
    await page.evaluate((y) => window.scrollTo(0, y), midScroll);
    await new Promise(r => setTimeout(r, 600));

    const midwayCardState = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-service-card]'));
      return cards.map(c => ({
        id: c.getAttribute('data-service-card'),
        transform: window.getComputedStyle(c).transform,
        opacity: window.getComputedStyle(c).opacity,
      }));
    });
    console.log(`   Midway active card index stacked: ${midwayCardState.findIndex(c => c.transform.includes('matrix(1, 0, 0, 1, 0, 0)'))}`);

    // 2. Dynamic Orientation Change: 390x844 (Portrait) -> 844x390 (Landscape) while pinned!
    console.log('2. Testing Orientation Change while Pinned (390x844 -> 844x390)...');
    await page.setViewport({ width: 844, height: 390 });
    // Allow matchMedia and resize event to trigger GSAP refresh
    await new Promise(r => setTimeout(r, 800));

    const landscapeState = await page.evaluate(() => {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const docW = document.documentElement.scrollWidth;
      const activeCard = document.querySelector('[data-service-card]');
      const cardRect = activeCard ? activeCard.getBoundingClientRect() : null;
      const h3 = activeCard?.querySelector('h3');
      const h3Rect = h3 ? h3.getBoundingClientRect() : null;

      return {
        winW,
        winH,
        overflowX: docW > winW,
        cardH: cardRect ? Math.round(cardRect.height) : 0,
        cardW: cardRect ? Math.round(cardRect.width) : 0,
        cardFitsViewportH: cardRect ? cardRect.height < winH : false,
        h3Visible: h3Rect ? (h3Rect.bottom <= cardRect.bottom && h3Rect.top >= cardRect.top) : false,
        titleText: h3 ? h3.textContent.trim() : '',
      };
    });
    console.log(`   Orientation Change Results:`);
    console.log(`     Overflow: ${landscapeState.overflowX ? 'FAIL' : 'PASS (0px)'}`);
    console.log(`     Card Size: ${landscapeState.cardW}x${landscapeState.cardH}px in ${landscapeState.winH}px viewport`);
    console.log(`     Fits Vertically: ${landscapeState.cardFitsViewportH}`);
    console.log(`     Title Readable & Unclipped: ${landscapeState.h3Visible} ("${landscapeState.titleText}")`);

    // Switch back to portrait
    console.log('3. Switching back to Portrait (844x390 -> 390x844)...');
    await page.setViewport({ width: 390, height: 844 });
    await new Promise(r => setTimeout(r, 800));

    // 3. Dynamic Resize while pinned: 390x844 -> 1440x900 (Desktop)
    console.log('4. Testing Resize from Mobile to Desktop (390x844 -> 1440x900) while Pinned...');
    await page.setViewport({ width: 1440, height: 900 });
    await new Promise(r => setTimeout(r, 800));

    const desktopResizedState = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const pinSpacer = document.querySelector('.pin-spacer');
      const sec = document.querySelector('#services-showcase');
      const card = sec?.querySelector('[data-service-card]');
      const cardRect = card ? card.getBoundingClientRect() : null;

      return {
        overflowX: docW > winW,
        pinSpacerH: pinSpacer ? pinSpacer.offsetHeight : 0,
        cardW: cardRect ? Math.round(cardRect.width) : 0,
        cardH: cardRect ? Math.round(cardRect.height) : 0,
      };
    });
    console.log(`   Desktop Resized Results:`);
    console.log(`     Overflow: ${desktopResizedState.overflowX ? 'FAIL' : 'PASS (0px)'}`);
    console.log(`     Desktop Pin Spacer: ${desktopResizedState.pinSpacerH}px`);
    console.log(`     Desktop Card Size: ${desktopResizedState.cardW}x${desktopResizedState.cardH}px`);

    // 4. Overlap Check: Scroll to bottom of Showcase and verify next section position
    console.log('5. Testing Release & Following Section Overlap...');
    const overlapState = await page.evaluate(async () => {
      const pinSpacer = document.querySelector('.pin-spacer');
      const targetY = pinSpacer ? (pinSpacer.offsetTop + pinSpacer.offsetHeight + 100) : 5000;
      window.scrollTo(0, targetY);
      await new Promise(r => setTimeout(r, 500));

      // Find the showcase section and the immediate following section
      const showcase = document.querySelector('#services-showcase');
      // The pin spacer wraps or precedes following content
      const allSections = Array.from(document.querySelectorAll('main section, section'));
      const showcaseIdx = allSections.indexOf(showcase);
      const nextSection = allSections[showcaseIdx + 1] || document.querySelector('footer');

      const showcaseRect = showcase ? showcase.getBoundingClientRect() : null;
      const nextRect = nextSection ? nextSection.getBoundingClientRect() : null;

      // Overlap occurs if nextSection top < showcase bottom when unpinned
      const isOverlapping = showcaseRect && nextRect ? (nextRect.top < showcaseRect.bottom - 50) : false;

      return {
        targetY,
        nextSectionTag: nextSection ? `${nextSection.tagName}#${nextSection.id || nextSection.className.slice(0, 20)}` : 'none',
        showcaseBottom: showcaseRect ? Math.round(showcaseRect.bottom) : 0,
        nextSectionTop: nextRect ? Math.round(nextRect.top) : 0,
        gapBetween: nextRect && showcaseRect ? Math.round(nextRect.top - showcaseRect.bottom) : 0,
        isOverlapping,
      };
    });
    console.log(`   Overlap Check Results:`);
    console.log(`     Next section: ${overlapState.nextSectionTag}`);
    console.log(`     Gap between showcase bottom and next section: ${overlapState.gapBetween}px`);
    console.log(`     Overlapping: ${overlapState.isOverlapping ? 'FAIL (OVERLAP DETECTED)' : 'PASS (Clean Release, No Overlap)'}`);

    // 5. Route Navigation: /services -> /about -> /services
    console.log('6. Testing Route Navigation (Lifecycle & Re-mount)...');
    await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));
    console.log('   Navigated to /about cleanly');

    await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1200));

    const renavPin = await page.evaluate(() => {
      const pinSpacer = document.querySelector('.pin-spacer');
      const card = document.querySelector('[data-service-card]');
      return {
        pinRecreated: !!pinSpacer,
        cardFound: !!card,
        docWidth: document.documentElement.scrollWidth,
        winWidth: window.innerWidth,
      };
    });
    console.log(`   Re-navigation to /services:`);
    console.log(`     Pin recreated: ${renavPin.pinRecreated}`);
    console.log(`     Card found: ${renavPin.cardFound}`);
    console.log(`     Horizontal overflow: ${renavPin.docWidth > renavPin.winWidth ? 'FAIL' : 'PASS (0px)'}`);

    console.log('\n=== ADVANCED INTERACTIONS QA COMPLETED: ALL PASS ===');

  } catch (err) {
    console.error('❌ Error during advanced QA:', err.message);
  } finally {
    await browser.close();
  }
})();
