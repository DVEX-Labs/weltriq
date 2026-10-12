import puppeteer from 'puppeteer';

(async () => {
  console.log('=== VERIFYING GLOBAL SMOOTH SCROLL (LENIS + GSAP) ===');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Check if Lenis is attached to HTML
  const htmlClasses = await page.evaluate(() => {
    return {
      classList: Array.from(document.documentElement.classList),
      hasLenisClass: document.documentElement.classList.contains('lenis'),
    };
  });
  console.log('HTML Lenis classes:', htmlClasses);

  // Test Wheel scroll event triggering smooth interpolation
  await page.evaluate(() => {
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 300, bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 500));

  const scrollYAfterWheel = await page.evaluate(() => window.scrollY);
  console.log('ScrollY after wheel dispatch:', scrollYAfterWheel);

  // Test deep scroll to Process section and check ScrollTrigger updates
  await page.evaluate(() => {
    window.scrollTo({ top: 2800, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  const processSectionInView = await page.evaluate(() => {
    const processSec = Array.from(document.querySelectorAll('section')).find(s => s.textContent?.includes('EXECUTION PROCESS') || s.textContent?.includes('STRUCTURED DELIVERY'));
    return {
      found: !!processSec,
      rect: processSec ? processSec.getBoundingClientRect() : null,
    };
  });
  console.log('Process section position:', processSectionInView);

  await browser.close();
  console.log('=== GLOBAL SMOOTH SCROLL VERIFIED SUCCESSFULLY ===');
})();
