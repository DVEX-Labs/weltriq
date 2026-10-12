import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const secInfo = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
    const sec = heading?.closest('section');
    const stage = document.querySelector('.lg\\:hidden');
    return {
      secTop: sec?.offsetTop,
      secH: sec?.offsetHeight,
      stageTop: stage?.getBoundingClientRect().top + window.scrollY,
      stageH: stage?.offsetHeight,
    };
  });

  console.log('Mobile section/stage:', secInfo);

  // Scroll through offsets 0 to 1800
  for (let offset = 0; offset <= 1800; offset += 300) {
    const scrollY = secInfo.stageTop - 400 + offset;
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise(r => setTimeout(r, 200));

    const activeInfo = await page.evaluate(() => {
      const circles = Array.from(document.querySelectorAll('.lg\\:hidden .process-circle'));
      return circles.map((c, i) => {
        const bg = window.getComputedStyle(c).backgroundColor;
        const isActive = bg.includes('12, 21, 51'); // NAVY
        return { step: i + 1, isActive };
      });
    });

    const activeSteps = activeInfo.filter(a => a.isActive).map(a => a.step);
    console.log(`Scroll pos ${Math.round(scrollY)}px (offset ${offset}px): Active circles: [${activeSteps.join(', ')}]`);
  }

  await browser.close();
})();
