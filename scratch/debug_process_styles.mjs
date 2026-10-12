import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  // Scroll to process section
  const info = await page.evaluate(() => {
    const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process'));
    if (!sec) return null;
    const rect = sec.getBoundingClientRect();
    return { top: rect.top + window.pageYOffset };
  });

  if (info) {
    await page.evaluate((top) => window.scrollTo(0, top + 500), info.top);
    await new Promise(r => setTimeout(r, 500));

    const cardDetails = await page.evaluate(() => {
      const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process'));
      const allDivs = Array.from(sec.querySelectorAll('div'));
      return allDivs.map((d, i) => {
        const text = d.textContent.slice(0, 40);
        const style = d.getAttribute('style') || '';
        const comp = window.getComputedStyle(d);
        return {
          i,
          class: d.className ? d.className.toString().slice(0, 50) : '',
          style,
          borderTopColor: comp.borderTopColor,
          transform: comp.transform,
          text
        };
      }).filter(d => d.style.includes('border') || d.style.includes('transform') || d.text.includes('PHASE'));
    });

    console.log('Diagnostic Card Details:', JSON.stringify(cardDetails.slice(0, 10), null, 2));
  }

  await browser.close();
})();
