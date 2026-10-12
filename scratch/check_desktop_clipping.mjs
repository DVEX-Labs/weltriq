import puppeteer from 'puppeteer';

(async () => {
  console.log('=== CHECKING DESKTOP CARD POSITION & CLIPPING AT 1024PX - 1280PX ===');
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const width of [1024, 1100, 1150, 1280, 1440]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 800 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));

    const check = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
      const sec = heading?.closest('section');
      const desktopCards = Array.from(sec?.querySelectorAll('.lg\\:flex [class*="left-"]') || []).filter(el => el.classList.contains('w-[275px]'));

      return desktopCards.map((c, i) => {
        const r = c.getBoundingClientRect();
        return {
          step: i + 1,
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          clippedLeft: r.left < 0,
          clippedRight: r.right > window.innerWidth,
        };
      });
    });

    console.log(`\nWidth ${width}px:`);
    check.forEach(c => {
      console.log(`  Step ${c.step}: left=${c.left}px, right=${c.right}px, clippedLeft=${c.clippedLeft}, clippedRight=${c.clippedRight}`);
    });

    await page.close();
  }

  await browser.close();
})();
