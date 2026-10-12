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

  // Test 3 sequential 150px wheel ticks
  for (let step = 1; step <= 3; step++) {
    await page.mouse.wheel({ deltaY: 150 });
    await new Promise(r => setTimeout(r, 300));

    const state = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('#services-showcase [data-service-card]'));
      return cards.map((card, idx) => ({
        idx,
        id: card.getAttribute('data-service-card'),
        top: Math.round(card.getBoundingClientRect().top),
        transform: card.style.transform
      }));
    });
    console.log(`--- AFTER WHEEL TICK ${step} (150px) ---`);
    console.log(JSON.stringify(state, null, 2));
  }

  await browser.close();
})();
