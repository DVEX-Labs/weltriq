import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}]`, msg.text());
  });

  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
  });

  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  const info = await page.evaluate(() => {
    const portal = document.querySelector('nextjs-portal');
    if (!portal || !portal.shadowRoot) return { error: 'No nextjs-portal shadow root' };

    const shadow = portal.shadowRoot;
    // Look for error cards, toast text, issue badge, or dialog text
    const badgeText = shadow.querySelector('[data-next-badge]')?.textContent || shadow.querySelector('[data-toast-pill]')?.textContent;
    const allText = shadow.textContent;

    // Check if there are error containers
    const errorContainers = Array.from(shadow.querySelectorAll('[data-nextjs-dialog] *, [data-nextjs-toast] *, [data-next-badge] *'));
    const containerTexts = errorContainers.map(el => el.textContent.trim()).filter(Boolean);

    return {
      badgeText,
      containerTexts,
      shadowHtmlSnippet: shadow.innerHTML.slice(0, 3000),
      allTextSnippet: allText.slice(0, 2000)
    };
  });

  console.log('--- OVERLAY INFO ---');
  console.log(JSON.stringify(info, null, 2));

  await browser.close();
})();
