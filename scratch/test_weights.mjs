import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0' });

  const comparison = await page.evaluate(() => {
    // Let's create temporary elements on the actual page with the loaded Bakbak One font
    const container = document.createElement('div');
    container.innerHTML = `
      <div id="test-norm" class="font-display uppercase text-brand-navy" style="font-size: 40px;">EVERY PROJECT STARTS WITH PURPOSE</div>
      <div id="test-bold" class="font-display font-bold uppercase text-brand-navy" style="font-size: 40px;">EVERY PROJECT STARTS WITH PURPOSE</div>
      <div id="test-extrabold" class="font-display font-extrabold uppercase text-brand-navy" style="font-size: 40px;">EVERY PROJECT STARTS WITH PURPOSE</div>
    `;
    document.body.appendChild(container);

    const norm = document.getElementById('test-norm');
    const bold = document.getElementById('test-bold');
    const extra = document.getElementById('test-extrabold');

    return {
      norm: {
        fontWeight: window.getComputedStyle(norm).fontWeight,
        width: norm.getBoundingClientRect().width,
      },
      bold: {
        fontWeight: window.getComputedStyle(bold).fontWeight,
        width: bold.getBoundingClientRect().width,
      },
      extra: {
        fontWeight: window.getComputedStyle(extra).fontWeight,
        width: extra.getBoundingClientRect().width,
      },
    };
  });

  console.log('Font weight comparison on live page:', JSON.stringify(comparison, null, 2));
  await browser.close();
})();
