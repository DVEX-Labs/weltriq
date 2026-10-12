import puppeteer from 'puppeteer';

const VIEWPORTS = [
  { name: '375x812 (Mobile)', width: 375, height: 812 },
  { name: '768x1024 (Tablet Portrait)', width: 768, height: 1024 },
  { name: '1024x768 (Tablet Landscape)', width: 1024, height: 768 },
  { name: '1440x900 (Desktop)', width: 1440, height: 900 },
];

(async () => {
  console.log('=== VERIFYING SERVICES SHOWCASE PINNED STACK ACROSS VIEWPORTS ===');
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const vp of VIEWPORTS) {
    console.log(`\n--- TESTING ${vp.name} ---`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Verify ScrollTrigger is registered and active
    const stData = await page.evaluate(() => {
      const triggers = (window.ScrollTrigger ? window.ScrollTrigger.getAll() : []).map(t => ({
        trigger: t.trigger?.id || t.trigger?.className?.slice(0, 30),
        start: t.vars.start,
        end: t.vars.end,
        pin: !!t.vars.pin,
        scrub: t.vars.scrub,
      }));
      return {
        count: triggers.length,
        triggers,
      };
    });
    console.log(`ScrollTriggers at ${vp.name}:`, stData);

    // Scroll into Services Showcase
    const targetY = await page.evaluate(() => {
      const sec = document.querySelector('#services-showcase');
      return sec ? sec.offsetTop : 0;
    });

    // Advance through the stack by scrolling in steps
    const cardProgressions = [];
    for (let step = 0; step <= 5; step++) {
      const scrollPos = targetY + (step * (vp.width < 768 ? 800 : 1200));
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollPos);
      await new Promise(r => setTimeout(r, 350));

      const cardState = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('[data-service-card]'));
        return cards.map((c, idx) => {
          const r = c.getBoundingClientRect();
          const title = c.querySelector('h3')?.textContent?.trim();
          const style = window.getComputedStyle(c);
          return {
            index: idx,
            title,
            top: Math.round(r.top),
            opacity: Number(style.opacity).toFixed(2),
            transform: style.transform,
          };
        });
      });
      cardProgressions.push({ step, activeCards: cardState.filter(c => c.opacity > '0.5') });
    }

    console.log(`Step 0 (Start):`, cardProgressions[0].activeCards.map(c => `${c.index}: ${c.title}`));
    console.log(`Step 2 (Midway):`, cardProgressions[2].activeCards.map(c => `${c.index}: ${c.title}`));
    console.log(`Step 5 (Late):`, cardProgressions[5].activeCards.map(c => `${c.index}: ${c.title}`));

    // Test Reverse Scroll
    console.log('Testing reverse scroll back to start...');
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetY);
    await new Promise(r => setTimeout(r, 400));
    const reversedFirstCard = await page.evaluate(() => {
      const card0 = document.querySelectorAll('[data-service-card]')[0];
      return {
        title: card0?.querySelector('h3')?.textContent?.trim(),
        opacity: card0 ? window.getComputedStyle(card0).opacity : null,
      };
    });
    console.log('After reverse scroll, Card 0 state:', reversedFirstCard);

    // Capture screenshot at step 2
    await page.evaluate((y) => window.scrollTo({ top: y + 1600, behavior: 'instant' }), targetY);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: `C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/services_stack_live_${vp.width}.png` });

    console.log(`Console Errors at ${vp.name}:`, errors);
    await page.close();
  }

  await browser.close();
  console.log('=== VERIFICATION RUN COMPLETED ===');
})();
