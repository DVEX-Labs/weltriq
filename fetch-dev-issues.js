import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log('[CONSOLE]', msg.type(), msg.text());
  });

  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const toastInfo = await page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal');
    if (!portal || !portal.shadowRoot) return 'NO PORTAL';
    const root = portal.shadowRoot;

    // Search for toast, badge, error-card, issue-card elements
    const badge = root.querySelector('[data-next-badge]') || root.querySelector('[data-toast-pill]');
    if (badge) {
      badge.click();
    }
    return root.innerHTML;
  });

  console.log('--- PORTAL INNERHTML ---');
  console.log(toastInfo);

  await browser.close();
})();
