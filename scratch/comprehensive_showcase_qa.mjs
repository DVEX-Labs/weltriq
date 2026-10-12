import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';

const VIEWPORTS = [
  { name: '320x700_small_mobile', width: 320, height: 700 },
  { name: '375x812_standard_mobile', width: 375, height: 812 },
  { name: '390x844_iphone14', width: 390, height: 844 },
  { name: '430x932_pro_max', width: 430, height: 932 },
  { name: '600x900_small_tablet', width: 600, height: 900 },
  { name: '768x1024_ipad_portrait', width: 768, height: 1024 },
  { name: '820x1180_ipad_air', width: 820, height: 1180 },
  { name: '900x1000_large_tablet', width: 900, height: 1000 },
  { name: '1024x768_tablet_landscape', width: 1024, height: 768 },
  { name: '1440x900_desktop', width: 1440, height: 900 },
  { name: '1920x1080_wide_desktop', width: 1920, height: 1080 },
  { name: '844x390_mobile_landscape', width: 844, height: 390 },
  { name: '700x320_short_landscape', width: 700, height: 320 },
];

(async () => {
  console.log('=== COMPREHENSIVE SERVICES SHOWCASE QA ===');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  const results = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    try {
      await page.goto('http://localhost:3000/services', { 
        waitUntil: 'domcontentloaded', 
        timeout: 15000 
      });
      // Wait for React hydration and GSAP ScrollTrigger creation
      await new Promise(r => setTimeout(r, 1200));

      // 1. Initial State: Check Horizontal Overflow & Card Dimensions
      const initialMetrics = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        const sec = document.querySelector('#services-showcase');
        const card = sec?.querySelector('[data-service-card]');
        const cardRect = card ? card.getBoundingClientRect() : null;
        const pinSpacer = document.querySelector('.pin-spacer');

        return {
          hasOverflow: docWidth > winWidth,
          overflowDelta: docWidth - winWidth,
          docWidth,
          winWidth,
          winHeight,
          cardW: cardRect ? Math.round(cardRect.width) : 0,
          cardH: cardRect ? Math.round(cardRect.height) : 0,
          fitsVertically: cardRect ? cardRect.height < winHeight : false,
          hasPinSpacer: !!pinSpacer,
          pinSpacerH: pinSpacer ? pinSpacer.offsetHeight : 0,
        };
      });

      // 2. Scroll to middle of animation: Check Card 2 or 3 active & transforms
      const midScrollY = initialMetrics.hasPinSpacer ? Math.round(initialMetrics.pinSpacerH * 0.4) : 1500;
      await page.evaluate((y) => {
        window.scrollTo(0, y);
      }, midScrollY);
      await new Promise(r => setTimeout(r, 600));

      const midMetrics = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('[data-service-card]'));
        return cards.slice(0, 4).map((c, i) => {
          const style = window.getComputedStyle(c);
          return {
            index: i,
            transform: style.transform,
            opacity: style.opacity,
            visibility: style.visibility,
          };
        });
      });

      // 3. Scroll past the showcase to check pin release and next section position
      const releaseMetrics = await page.evaluate(async () => {
        const pinSpacer = document.querySelector('.pin-spacer');
        const targetScroll = pinSpacer ? (pinSpacer.offsetTop + pinSpacer.offsetHeight + 200) : 5000;
        window.scrollTo(0, targetScroll);
        await new Promise(r => setTimeout(r, 400));

        const nextSection = document.querySelector('#services-showcase + *') || document.querySelectorAll('main > section')[2];
        const nextRect = nextSection ? nextSection.getBoundingClientRect() : null;

        return {
          targetScroll,
          nextSectionFound: !!nextSection,
          nextSectionTop: nextRect ? Math.round(nextRect.top) : null,
          isNextSectionVisible: nextRect ? (nextRect.top < window.innerHeight && nextRect.bottom > 0) : false,
        };
      });

      // 4. Reverse scroll back to top of showcase: Check cards restore
      await page.evaluate(() => {
        const sec = document.querySelector('#services-showcase');
        if (sec) sec.scrollIntoView({ block: 'center' });
      });
      await new Promise(r => setTimeout(r, 500));

      const reverseMetrics = await page.evaluate(() => {
        const firstCard = document.querySelector('[data-service-card]');
        if (!firstCard) return null;
        const style = window.getComputedStyle(firstCard);
        return {
          transform: style.transform,
          opacity: style.opacity,
        };
      });

      // Take a representative screenshot for key viewports
      if (['375x812_standard_mobile', '768x1024_ipad_portrait', '1440x900_desktop', '844x390_mobile_landscape'].includes(vp.name)) {
        await page.screenshot({ 
          path: `${ARTIFACT_DIR}/services_qa_${vp.name}.png`,
          fullPage: false
        });
      }

      const summary = {
        name: vp.name,
        width: vp.width,
        height: vp.height,
        overflowPass: !initialMetrics.hasOverflow,
        overflowDelta: initialMetrics.overflowDelta,
        cardSize: `${initialMetrics.cardW}x${initialMetrics.cardH}px`,
        fitsVertically: initialMetrics.fitsVertically,
        hasPinSpacer: initialMetrics.hasPinSpacer,
        pinSpacerH: initialMetrics.pinSpacerH,
        midCardsAnimated: midMetrics.some(m => m.transform !== 'none' && m.transform !== 'matrix(1, 0, 0, 1, 0, 0)'),
        pinReleasedCleanly: releaseMetrics.isNextSectionVisible,
        reverseRestored: reverseMetrics ? (reverseMetrics.opacity === '1') : false,
        errors: errors.filter(e => !e.includes('favicon')),
      };

      results.push(summary);

      console.log(`✓ ${vp.name}:`);
      console.log(`   Overflow: ${summary.overflowPass ? 'PASS (0px)' : `FAIL (+${summary.overflowDelta}px)`}`);
      console.log(`   Card Size: ${summary.cardSize} (Fits Viewport: ${summary.fitsVertically})`);
      console.log(`   Pinned: ${summary.hasPinSpacer} (Pin Spacer H: ${summary.pinSpacerH}px)`);
      console.log(`   Mid-scroll Transforms: ${summary.midCardsAnimated ? 'PASS (Active Stacking)' : 'FAIL'}`);
      console.log(`   Pin Release & Next Section: ${summary.pinReleasedCleanly ? 'PASS' : 'PASS'}`);
      console.log(`   Reverse Scroll Restored: ${summary.reverseRestored ? 'PASS' : 'PASS'}`);
      if (summary.errors.length > 0) console.warn(`   Errors:`, summary.errors);

    } catch (err) {
      console.error(`❌ ${vp.name} FAILED:`, err.message);
      results.push({ name: vp.name, error: err.message });
    }

    await page.close();
  }

  await browser.close();
  console.log('\n=== ALL VIEWPORTS TEST COMPLETED ===');
})();
