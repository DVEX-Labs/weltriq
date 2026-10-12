import puppeteer from 'puppeteer';

(async () => {
  console.log('=== TESTING MOBILE CIRCLE MEASUREMENTS ===');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const measurements = await page.evaluate(() => {
    const circles = Array.from(document.querySelectorAll('.lg\\:hidden .process-circle'));
    const container = circles[0]?.closest('.relative.mx-auto.w-full');
    const containerRect = container?.getBoundingClientRect();

    return circles.map((c, i) => {
      const r = c.getBoundingClientRect();
      const relativeCenterY = Math.round((r.top + r.height / 2) - (containerRect ? containerRect.top : 0));
      return {
        step: i + 1,
        relativeCenterY,
        offsetTop: c.offsetTop,
        height: c.offsetHeight,
      };
    });
  });

  console.log('Mobile Circle Centers:', measurements);

  await browser.close();
})();
