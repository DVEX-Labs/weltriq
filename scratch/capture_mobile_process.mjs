import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Find Process section
  const pos = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
    const sec = heading?.closest('section');
    return sec ? { top: sec.offsetTop, height: sec.offsetHeight } : null;
  });

  console.log('Process section pos:', pos);

  // Scroll to process top
  await page.evaluate((y) => window.scrollTo(0, y), pos.top);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'scratch/process_mobile_top.png' });

  // Scroll halfway into the process pin
  await page.evaluate((y) => window.scrollTo(0, y + 1000), pos.top);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'scratch/process_mobile_mid.png' });

  // Scroll near the end of process
  await page.evaluate((y) => window.scrollTo(0, y + 2000), pos.top);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'scratch/process_mobile_end.png' });

  await browser.close();
  console.log('Screenshots captured');
})();
