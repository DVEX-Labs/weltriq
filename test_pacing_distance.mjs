import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const viewports = [
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1280, height: 800, name: '1280x800' },
  { width: 390, height: 844, name: '390x844' },
  { width: 430, height: 932, name: '430x932' },
];

(async () => {
  console.log('=== STARTING PHYSICAL SCROLL PACING VERIFICATION ===');
  const browser = await puppeteer.launch({ headless: true });

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} ---`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    // Scroll until pinned interaction begins
    console.log('Scrolling to ServiceStack section...');
    await page.evaluate(() => {
      const el = document.getElementById('services-showcase');
      if (el) {
        const rect = el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + rect.top + 200);
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    // Simulate physical mouse wheel ticks (120px deltaY each step)
    console.log('Simulating physical wheel scrolling deltaY: 120px...');
    const cardVisits = [];
    let prevCard = '';
    let ticksOnCard = 0;

    for (let step = 0; step < 180; step++) {
      await page.mouse.wheel({ deltaY: 120 });
      await new Promise((r) => setTimeout(r, 40)); // realistic frame delay

      // Inspect active card in viewport (card closest to scale 1 / highest opacity/zIndex)
      const currentCard = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('#services-showcase [class*="group"]'));
        let topCardNumber = 'Unknown';
        let topZIndex = -1;
        cards.forEach((card) => {
          const style = window.getComputedStyle(card);
          const opacity = parseFloat(style.opacity);
          const numSpan = card.querySelector('span.font-display.text-4xl, span.font-display.text-5xl, span.font-display.text-7xl');
          if (opacity > 0.7 && numSpan) {
            const zIndex = parseInt(style.zIndex || '0', 10);
            if (zIndex > topZIndex) {
              topZIndex = zIndex;
              topCardNumber = numSpan.textContent.trim();
            }
          }
        });
        return topCardNumber;
      });

      if (currentCard !== prevCard) {
        if (prevCard) {
          cardVisits.push({ card: prevCard, wheelTicks: ticksOnCard });
        }
        prevCard = currentCard;
        ticksOnCard = 1;
      } else {
        ticksOnCard++;
      }
    }
    if (prevCard) {
      cardVisits.push({ card: prevCard, wheelTicks: ticksOnCard });
    }

    console.log('Card transition dwell duration (in wheel ticks of 120px):');
    cardVisits.forEach((v) => {
      console.log(`  Service Card ${v.card}: ${v.wheelTicks} physical wheel ticks (~${v.wheelTicks * 120}px scroll distance)`);
    });

    // Test Reverse Scrolling
    console.log('Testing REVERSE physical wheel scrolling deltaY: -120px...');
    let reverseSuccess = true;
    for (let step = 0; step < 120; step++) {
      await page.mouse.wheel({ deltaY: -120 });
      await new Promise((r) => setTimeout(r, 30));
    }
    const finalTopCard = await page.evaluate(() => {
      const card = document.querySelector('#services-showcase [class*="group"]');
      const numSpan = card ? card.querySelector('span.font-display') : null;
      return numSpan ? numSpan.textContent.trim() : 'Unknown';
    });
    console.log(`Reverse scroll completed. Top visible card returned to: ${finalTopCard}`);

    await page.close();
  }

  await browser.close();
  console.log('\n=== PHYSICAL SCROLL PACING VERIFICATION FINISHED ===');
})();
