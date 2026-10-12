import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const scratchDir = path.resolve(process.cwd(), 'scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to 1440x900 (standard desktop)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Scroll to process section
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const processHeading = headings.find(h => h.textContent.includes('Our Process'));
    if (processHeading) {
      processHeading.scrollIntoView({ block: 'start' });
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(scratchDir, 'process_start_1440.png') });

  // Measure bounding rects
  const data = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const processHeading = headings.find(h => h.textContent.includes('Our Process'));
    const section = processHeading ? processHeading.closest('section') : null;
    if (!section) return null;

    const sectionRect = section.getBoundingClientRect();
    const desktopStage = section.querySelector('.hidden.lg\\:flex');
    const stageRect = desktopStage ? desktopStage.getBoundingClientRect() : null;
    
    return {
      windowHeight: window.innerHeight,
      sectionTotalHeight: section.offsetHeight,
      sectionRectTop: sectionRect.top,
      sectionRectBottom: sectionRect.bottom,
      headingRectTop: processHeading.getBoundingClientRect().top,
      headingRectBottom: processHeading.getBoundingClientRect().bottom,
      stageRectTop: stageRect ? stageRect.top : null,
      stageRectBottom: stageRect ? stageRect.bottom : null,
      stageHeight: desktopStage ? desktopStage.offsetHeight : null
    };
  });

  console.log('MEASUREMENTS:', JSON.stringify(data, null, 2));

  await browser.close();
})();
