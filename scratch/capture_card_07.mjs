import puppeteer from 'puppeteer';

(async () => {
  console.log('Capturing Card 07 (ROOF RENOVATION) on /services...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Find the card container or scroll to the 7th card
  // On desktop, the stack is pinned and driven by scroll.
  // services.length is 7, so pinDistance is 6 * 200vh = 1200vh!
  // To reach card 7 (index 6), we need to scroll through the pin.
  // Let's scroll in steps or scroll directly to the end of the stack:
  const stackTop = await page.evaluate(() => {
    const el = document.querySelector('section');
    return el ? el.offsetTop : 0;
  });

  // Card 7 is active near the end of the pinned section
  await page.evaluate(() => {
    // Scroll deep into the pinned stack so card 7 is fully active
    window.scrollTo(0, 8000);
  });
  await new Promise(r => setTimeout(r, 1000));

  const artifactPath = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/card_07_renovation_preview.png';
  await page.screenshot({ path: artifactPath });
  console.log('Saved card preview to:', artifactPath);

  await browser.close();
})();
