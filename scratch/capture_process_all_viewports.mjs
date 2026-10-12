import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const vp of [
    { name: 'process_mobile_375', width: 375, height: 812 },
    { name: 'process_tablet_768', width: 768, height: 1024 },
    { name: 'process_desktop_1024', width: 1024, height: 768 },
    { name: 'process_desktop_1440', width: 1440, height: 900 },
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1200));

    // Scroll to Process section
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
      heading?.scrollIntoView({ block: 'start' });
    });
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({ path: `scratch/${vp.name}.png` });
    await page.close();
  }

  await browser.close();
  console.log('Screenshots captured');
})();
