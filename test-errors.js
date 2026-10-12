import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log("BROWSER ERROR:", msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log("PAGE ERROR:", err.message);
  });

  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
