import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const stage = await page.evaluate(() => {
    const s = document.querySelector('.lg\\:hidden');
    const r = s?.getBoundingClientRect();
    return { top: r.top + window.scrollY, h: s.offsetHeight };
  });

  // Scroll to halfway through stage: stage.top + 500
  await page.evaluate((y) => window.scrollTo(0, y), stage.top + 500);
  await new Promise(r => setTimeout(r, 400));

  const debug = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.lg\\:hidden [class*="rounded-2xl"]'));
    return cards.map((c, i) => ({
      step: i + 1,
      style: c.getAttribute('style'),
      computedBorder: window.getComputedStyle(c).borderColor,
      computedTransform: window.getComputedStyle(c).transform,
    }));
  });

  console.log('Halfway Scroll (scrollY = ' + (stage.top + 500) + '):', debug);

  await browser.close();
})();
