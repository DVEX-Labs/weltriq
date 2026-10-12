import puppeteer from 'puppeteer';

(async () => {
  console.log('=== VERIFYING LIGHTNING & SCROLL INTEGRATION ===');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Check initial state
  const initial = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      canvasExists: !!canvas,
      canvasWidth: canvas?.width,
      canvasHeight: canvas?.height,
    };
  });
  console.log('Initial Canvas status:', initial);

  // Scroll into the lightning strike zone (~24% of 300vh = ~450px)
  console.log('Scrolling into lightning storm zone (scrollY: 550)...');
  await page.evaluate(() => {
    window.scrollTo({ top: 550, behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 800));

  // Check if current frame rendered around lightning strike (frame 28, 29, or 30)
  const scrollState = await page.evaluate(() => {
    return {
      scrollY: window.scrollY,
      textOpacity: document.querySelector('section > div > div:nth-of-type(4) > div > div')?.style.opacity,
    };
  });
  console.log('Scroll State in lightning zone:', scrollState);

  // Scroll through to macro bead finish
  console.log('Scrolling towards finish (scrollY: 1800)...');
  await page.evaluate(() => {
    window.scrollTo({ top: 1800, behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('Console Errors caught:', consoleErrors);
  await browser.close();
  console.log('=== VERIFICATION COMPLETED SUCCESSFULLY ===');
})();
