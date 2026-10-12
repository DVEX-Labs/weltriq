import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    if (eyebrow) {
      eyebrow.closest('section').scrollIntoView({ block: 'center' });
    }
  });

  const sectionEl = await page.evaluateHandle(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    return eyebrow.closest('section');
  });

  // Test Option A: text-xl sm:text-2xl lg:text-3xl font-display font-bold
  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    const sec = eyebrow.closest('section');
    const h2 = sec.querySelector('h2');
    if (h2) {
      h2.className = 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase leading-[1.08] text-brand-navy tracking-wide';
    }
    const h3s = sec.querySelectorAll('h3');
    h3s.forEach(h3 => {
      h3.className = 'text-xl sm:text-2xl lg:text-3xl font-display font-bold uppercase text-brand-navy tracking-wider group-hover:translate-x-1.5 transition-transform duration-300 leading-tight';
    });
  });
  await new Promise(r => setTimeout(r, 600));
  await sectionEl.screenshot({ path: path.resolve(process.cwd(), 'scratch/test_option_a_1440.png') });

  // Test Option B: text-lg sm:text-xl lg:text-2xl font-display font-bold
  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    const sec = eyebrow.closest('section');
    const h3s = sec.querySelectorAll('h3');
    h3s.forEach(h3 => {
      h3.className = 'text-lg sm:text-xl lg:text-2xl font-display font-bold uppercase text-brand-navy tracking-wider group-hover:translate-x-1.5 transition-transform duration-300 leading-tight';
    });
  });
  await new Promise(r => setTimeout(r, 600));
  await sectionEl.screenshot({ path: path.resolve(process.cwd(), 'scratch/test_option_b_1440.png') });

  // Test Option A on mobile 390
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    const sec = eyebrow.closest('section');
    const h3s = sec.querySelectorAll('h3');
    h3s.forEach(h3 => {
      h3.className = 'text-xl sm:text-2xl lg:text-3xl font-display font-bold uppercase text-brand-navy tracking-wider group-hover:translate-x-1.5 transition-transform duration-300 leading-tight';
    });
  });
  await new Promise(r => setTimeout(r, 600));
  await sectionEl.screenshot({ path: path.resolve(process.cwd(), 'scratch/test_option_a_390.png') });

  // Test Option B on mobile 390
  await page.evaluate(() => {
    const eyebrow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'BRAND PHILOSOPHY');
    const sec = eyebrow.closest('section');
    const h3s = sec.querySelectorAll('h3');
    h3s.forEach(h3 => {
      h3.className = 'text-lg sm:text-xl lg:text-2xl font-display font-bold uppercase text-brand-navy tracking-wider group-hover:translate-x-1.5 transition-transform duration-300 leading-tight';
    });
  });
  await new Promise(r => setTimeout(r, 600));
  await sectionEl.screenshot({ path: path.resolve(process.cwd(), 'scratch/test_option_b_390.png') });

  console.log('Saved option A and B screenshots');
  await browser.close();
})();
