import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // The stack container has 6 steps (step 0 to 5)
  // Let's scroll in steps of 600px to find when Card 07 is visible
  for (let y = 1000; y <= 6000; y += 800) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await new Promise(r => setTimeout(r, 400));
    const activeText = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      return cards.map(c => c.textContent?.trim()).filter(Boolean);
    });
    console.log(`Scroll ${y}:`, activeText);
    const has07 = await page.evaluate(() => {
      return document.body.innerText.includes('ROOF RENOVATION');
    });
    if (has07) {
      // Check if the card with ROOF RENOVATION is in viewport
      const cardRect = await page.evaluate(() => {
        const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent?.includes('ROOF RENOVATION'));
        if (!h3) return null;
        const card = h3.closest('.group');
        return card ? card.getBoundingClientRect() : null;
      });
      console.log('Card 07 rect:', cardRect);
      if (cardRect && cardRect.top >= 0 && cardRect.top <= 200) {
        await page.screenshot({ path: 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/card_07_perfect_shot.png' });
        console.log('Captured perfect shot at scroll', y);
        break;
      }
    }
  }

  await browser.close();
})();
