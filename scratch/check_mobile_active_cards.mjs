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

  console.log('Mobile Stage:', stage);

  // Check card activation as we scroll from stage.top to stage.top + stage.h
  for (let offset = -200; offset <= stage.h + 200; offset += 150) {
    const scrollY = stage.top + offset;
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise(r => setTimeout(r, 100));

    const activeCards = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.lg\\:hidden [class*="rounded-2xl"]'));
      return cards.map((c, i) => {
        const style = c.getAttribute('style') || '';
        const isYellow = style.includes('255, 198, 39') || style.includes('FFC627');
        return { step: i + 1, isYellow };
      }).filter(c => c.isYellow).map(c => c.step);
    });

    console.log(`Scroll offset ${offset}px: Active card(s): [${activeCards.join(', ')}]`);
  }

  await browser.close();
})();
