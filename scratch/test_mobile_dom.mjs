import puppeteer from 'puppeteer';

(async () => {
  console.log('Testing mobile scroll behavior with pinned cards...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });

  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Let's inspect the DOM elements in ServicesShowcase
  const dom = await page.evaluate(() => {
    const sec = document.querySelector('#services-showcase');
    const header = sec?.querySelector('.mb-6');
    const wrapper = sec?.querySelector('.min-h-screen');
    const cards = Array.from(sec?.querySelectorAll('[data-service-card]') || []);
    return {
      secRect: sec?.getBoundingClientRect(),
      headerRect: header?.getBoundingClientRect(),
      wrapperRect: wrapper?.getBoundingClientRect(),
      cards: cards.map(c => ({
        tag: c.tagName,
        classes: c.className,
        rect: c.getBoundingClientRect(),
      })),
    };
  });
  console.log('DOM info at 375x812:', dom);

  await browser.close();
})();
