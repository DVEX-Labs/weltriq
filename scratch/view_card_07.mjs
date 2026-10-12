import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Find all cards
  const cardsInfo = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3'));
    const renoH3 = headings.find(h => h.textContent?.toLowerCase().includes('roof renovation'));
    if (!renoH3) return { found: false };

    // Find the enclosing card container
    let p = renoH3;
    while (p && !p.className?.includes('group')) {
      p = p.parentElement;
    }
    // Make card 7 top-most / visible for the screenshot
    if (p) {
      p.scrollIntoView({ block: 'center' });
    }
    return {
      found: !!renoH3,
      parentTag: p?.tagName,
      className: p?.className,
    };
  });
  console.log('Card 07 found:', cardsInfo);
  await new Promise(r => setTimeout(r, 600));

  const artifactPath = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/card_07_renovation_verified.png';
  await page.screenshot({ path: artifactPath });
  console.log('Saved screenshot to:', artifactPath);

  await browser.close();
})();
