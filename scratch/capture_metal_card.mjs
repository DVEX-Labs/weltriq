import puppeteer from 'puppeteer';

(async () => {
  console.log('Capturing Card 01 (METAL ROOFING) on Home page...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Find the metal roofing card on Home
  const cardFound = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h3'));
    const metalH3 = headings.find(h => h.textContent?.toLowerCase().includes('metal roofing'));
    if (!metalH3) return false;
    let p = metalH3;
    while (p && !p.className?.includes('group')) {
      p = p.parentElement;
    }
    if (p) p.scrollIntoView({ block: 'center' });
    return true;
  });
  console.log('Metal card found on home:', cardFound);
  await new Promise(r => setTimeout(r, 600));

  const artifactPath = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/card_01_metal_roofing_verified.png';
  await page.screenshot({ path: artifactPath });
  console.log('Saved screenshot to:', artifactPath);

  await browser.close();
})();
