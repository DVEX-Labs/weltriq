import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const info0 = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      scrollY: window.scrollY,
      canvasRect: canvas ? canvas.getBoundingClientRect() : null,
      canvasW: canvas?.width,
      canvasH: canvas?.height,
    };
  });
  console.log('Scroll 0:', info0);

  await page.evaluate(() => {
    window.scrollTo({ top: 500, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 500));

  const info500 = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const hero = document.querySelector('div.bg-brand-navy');
    return {
      scrollY: window.scrollY,
      canvasRect: canvas ? canvas.getBoundingClientRect() : null,
      heroRect: hero ? hero.getBoundingClientRect() : null,
      parentClass: hero?.parentElement?.className,
      heroStyle: hero ? hero.getAttribute('style') : null,
    };
  });
  console.log('Scroll 500:', info500);

  await browser.close();
})();
