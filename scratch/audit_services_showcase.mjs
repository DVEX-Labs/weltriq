import puppeteer from 'puppeteer';

const VIEWPORTS = [
  { name: '375x812 (Mobile)', width: 375, height: 812 },
  { name: '768x1024 (Tablet)', width: 768, height: 1024 },
  { name: '1440x900 (Desktop)', width: 1440, height: 900 },
];

(async () => {
  console.log('=== AUDITING SERVICES SHOWCASE BEHAVIOR ===');
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const vp of VIEWPORTS) {
    console.log(`\nTesting ${vp.name}...`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Inspect matchMedia and ScrollTrigger on page
    const stStatus = await page.evaluate(() => {
      const sec = document.querySelector('#services-showcase');
      const cards = Array.from(document.querySelectorAll('[data-service-card]'));
      const triggers = (window.ScrollTrigger ? window.ScrollTrigger.getAll() : []).map(t => ({
        trigger: t.trigger?.id || t.trigger?.className?.slice(0, 30),
        vars: {
          start: t.vars.start,
          end: t.vars.end,
          pin: !!t.vars.pin,
          scrub: t.vars.scrub,
        },
        isActive: t.isActive,
      }));

      return {
        cardPositions: cards.map((c, i) => {
          const style = window.getComputedStyle(c);
          const rect = c.getBoundingClientRect();
          return {
            index: i,
            position: style.position,
            top: rect.top,
            height: rect.height,
            opacity: style.opacity,
            transform: style.transform,
          };
        }),
        triggers,
      };
    });

    console.log(`Triggers at ${vp.name}:`, stStatus.triggers);
    console.log(`Cards at ${vp.name} (first 3):`, stStatus.cardPositions.slice(0, 3));

    // Capture screenshot at top of Services Showcase
    await page.evaluate(() => {
      const sec = document.querySelector('#services-showcase');
      if (sec) sec.scrollIntoView({ block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: `C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/services_showcase_${vp.width}.png` });

    await page.close();
  }

  await browser.close();
  console.log('=== SERVICES SHOWCASE AUDIT COMPLETED ===');
})();
