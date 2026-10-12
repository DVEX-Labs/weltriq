import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  for (const scrollY of [0, 80, 200, 500, 1000, 1500, 2000]) {
    await page.evaluate(y => window.scrollTo(0, y), scrollY);
    await new Promise(r => setTimeout(r, 200));
    const data = await page.evaluate(() => {
      const hero = document.querySelector('.pin-spacer > div') || document.querySelector('canvas')?.parentElement;
      const spacer = document.querySelector('.pin-spacer');
      const r = hero?.getBoundingClientRect();
      const sr = spacer?.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        heroStyle: hero?.getAttribute('style'),
        heroRect: r ? { top: r.top, bottom: r.bottom, height: r.height } : null,
        spacerRect: sr ? { top: sr.top, bottom: sr.bottom, height: sr.height } : null,
      };
    });
    console.log(`Scroll ${scrollY}:`, JSON.stringify(data));
  }

  await browser.close();
})();
