import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const artifactDir = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  // 1. Services: ProjectTypes
  await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const ptHandle = await page.evaluateHandle(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Roofing For Every Project'));
    return heading ? heading.closest('section') : null;
  });
  if (ptHandle) {
    const el = await ptHandle.asElement();
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 500));
      await el.screenshot({ path: path.join(artifactDir, 'project_types_qa.png') });
      console.log('✓ Captured element screenshot: project_types_qa.png');
    }
  }

  // 2. Services: ServiceDelivery
  const sdHandle = await page.evaluateHandle(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How We Deliver'));
    return heading ? heading.closest('section') : null;
  });
  if (sdHandle) {
    const el = await sdHandle.asElement();
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 500));
      await el.screenshot({ path: path.join(artifactDir, 'services_delivery_qa.png') });
      console.log('✓ Captured element screenshot: services_delivery_qa.png');
    }
  }

  // 3. About: AboutApproach
  await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const aaHandle = await page.evaluateHandle(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Built On Professional Delivery Principles'));
    return heading ? heading.closest('section') : null;
  });
  if (aaHandle) {
    const el = await aaHandle.asElement();
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 500));
      await el.screenshot({ path: path.join(artifactDir, 'about_approach_qa.png') });
      console.log('✓ Captured element screenshot: about_approach_qa.png');
    }
  }

  await browser.close();
  console.log('Done capturing element screenshots.');
})();
