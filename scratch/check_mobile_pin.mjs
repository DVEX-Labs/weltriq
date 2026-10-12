import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });

  await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const pinInfo = await page.evaluate(() => {
    const pinSpacer = document.querySelector('.pin-spacer');
    const stackWrapper = document.querySelector('#services-showcase .min-h-screen');
    const cards = Array.from(document.querySelectorAll('[data-service-card]'));
    return {
      hasPinSpacer: !!pinSpacer,
      pinSpacerHeight: pinSpacer ? pinSpacer.offsetHeight : null,
      parentOfStack: stackWrapper?.parentElement?.className,
      cardsCount: cards.length,
      firstCardTop: cards[0]?.getBoundingClientRect().top,
      firstCardTransform: cards[0] ? window.getComputedStyle(cards[0]).transform : null,
      secondCardTransform: cards[1] ? window.getComputedStyle(cards[1]).transform : null,
    };
  });
  console.log('Mobile 375x812 Pin & Stack status:', pinInfo);

  // Now scroll down into the pin spacer and observe card transforms
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 500));

  const afterScroll = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[data-service-card]'));
    return cards.map((c, i) => ({
      index: i,
      transform: window.getComputedStyle(c).transform,
      opacity: window.getComputedStyle(c).opacity,
    }));
  });
  console.log('Mobile 375x812 Cards at scrollY 1500:', afterScroll);

  // Take screenshot at scrollY 1500
  await page.screenshot({ path: 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/mobile_pin_scroll_1500.png' });

  await browser.close();
})();
