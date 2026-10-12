import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const consoleMsgs = [];
  page.on('console', msg => {
    consoleMsgs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    consoleMsgs.push(`[pageerror] ${err.message}`);
  });

  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });

  console.log('Console logs on /services:');
  consoleMsgs.forEach(m => console.log(m));

  // Check next-route-announcer or dev overlay shadow root text if present
  const issueText = await page.evaluate(() => {
    const el = document.querySelector('nextjs-portal');
    if (el && el.shadowRoot) {
      return el.shadowRoot.textContent;
    }
    return null;
  });

  if (issueText) {
    console.log('Dev Overlay Portal content:', issueText);
  } else {
    console.log('No nextjs-portal shadow root issue content found.');
  }

  await browser.close();
})();
