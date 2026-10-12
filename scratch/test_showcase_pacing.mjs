import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Scroll to services showcase
  await page.evaluate(() => {
    const sec = document.querySelector('#services-showcase');
    if (sec) sec.scrollIntoView({ block: 'center' });
  });

  await new Promise(r => setTimeout(r, 500));

  // Perform single small wheel scroll (100px delta)
  console.log('--- TESTING SINGLE WHEEL TICK (100px) ---');
  await page.mouse.wheel({ deltaY: 100 });
  await new Promise(r => setTimeout(r, 600));

  const activeCardInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#services-showcase [data-service-card]'));
    return cards.map((card, idx) => {
      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      return {
        idx,
        id: card.getAttribute('data-service-card'),
        top: Math.round(rect.top),
        opacity: parseFloat(style.opacity),
        zIndex: style.zIndex,
        transform: style.transform
      };
    });
  });

  console.log('Cards state after 100px wheel tick:', JSON.stringify(activeCardInfo, null, 2));

  await browser.close();
})();
