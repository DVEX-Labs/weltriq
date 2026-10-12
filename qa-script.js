import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  const viewports = [
    { width: 320, height: 800 },
    { width: 375, height: 800 },
    { width: 390, height: 800 },
    { width: 430, height: 800 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 }
  ];

  try {
    for (const vp of viewports) {
      await page.setViewport(vp);
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      if (hasOverflow) {
        errors.push(`Horizontal overflow detected at width ${vp.width}px`);
      }
    }
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length > 0) {
    console.error("QA Errors Found:");
    errors.forEach(e => console.error("- " + e));
    process.exit(1);
  } else {
    console.log("No console errors, hydration warnings, or horizontal overflow detected across all breakpoints.");
  }

  await browser.close();
})();
