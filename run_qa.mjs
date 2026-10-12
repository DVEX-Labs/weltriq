import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const pages = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'contact', path: '/contact' },
];

const viewports = [
  { width: 320, height: 680, name: '320px' },
  { width: 375, height: 812, name: '375px' },
  { width: 390, height: 844, name: '390px' },
  { width: 430, height: 932, name: '430px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 1024, height: 768, name: '1024px' },
  { width: 1280, height: 800, name: '1280px' },
  { width: 1440, height: 900, name: '1440px' },
  { width: 1920, height: 1080, name: '1920px' },
];

(async () => {
  console.log('--- STARTING COMPREHENSIVE QA SUITE ---');
  const browser = await puppeteer.launch({ headless: true });
  const report = {
    consoleErrors: [],
    pageErrors: [],
    nextIssues: [],
    overflows: [],
  };

  const outputDir = path.join(process.cwd(), 'scratch', 'qa_screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const p of pages) {
    const page = await browser.newPage();

    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error' || text.toLowerCase().includes('error') || text.toLowerCase().includes('warning') || text.toLowerCase().includes('hydration')) {
        console.log(`[CONSOLE ${type.toUpperCase()}] (${p.name}):`, text);
        report.consoleErrors.push({ page: p.name, type, text });
      }
    });

    page.on('pageerror', err => {
      console.log(`[PAGE ERROR] (${p.name}):`, err.message);
      report.pageErrors.push({ page: p.name, error: err.message });
    });

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      try {
        await page.goto(`http://localhost:3000${p.path}`, { waitUntil: 'networkidle0', timeout: 20000 });
        await new Promise(r => setTimeout(r, 800));

        // Check horizontal overflow
        const overflowElements = await page.evaluate((vpWidth) => {
          const offending = [];
          const scrollW = document.documentElement.scrollWidth;
          if (scrollW > vpWidth + 1) {
            const all = document.querySelectorAll('*');
            all.forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.right > vpWidth + 2 || rect.left < -2) {
                offending.push({
                  tag: el.tagName,
                  id: el.id,
                  class: el.className ? el.className.toString().slice(0, 80) : '',
                  right: rect.right,
                  width: rect.width
                });
              }
            });
          }
          return { scrollW, offending: offending.slice(0, 10) };
        }, vp.width);

        if (overflowElements.scrollW > vp.width + 1) {
          console.log(`[OVERFLOW DETECTED] Page: ${p.name}, Viewport: ${vp.name}, ScrollWidth: ${overflowElements.scrollW}px (Max: ${vp.width}px)`);
          report.overflows.push({ page: p.name, viewport: vp.name, scrollW: overflowElements.scrollW, elements: overflowElements.offending });
        }

        // Check NextJS Dev Portal Issues Indicator
        const portalIssue = await page.evaluate(() => {
          const portal = document.querySelector('nextjs-portal');
          if (!portal || !portal.shadowRoot) return null;
          const root = portal.shadowRoot;
          const issueEl = root.querySelector('[data-next-badge]') || root.querySelector('[data-toast-pill]') || root.querySelector('[data-nextjs-toast]');
          return issueEl ? issueEl.textContent : null;
        });

        if (portalIssue) {
          console.log(`[NEXT DEV ISSUE] Page: ${p.name}, Viewport: ${vp.name}:`, portalIssue);
          report.nextIssues.push({ page: p.name, viewport: vp.name, issue: portalIssue });
        }

        // Take a screenshot at 1440px & 390px for visual check
        if (vp.name === '1440px' || vp.name === '390px') {
          await page.screenshot({ path: path.join(outputDir, `${p.name}_${vp.name}.png`), fullPage: true });
        }

      } catch (e) {
        console.error(`Failed loading ${p.name} at ${vp.name}:`, e.message);
      }
    }

    // Special test for /services page GSAP scroll animation
    if (p.name === 'services') {
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 1000));

      console.log('Testing GSAP ServiceStack scroll progression...');
      // Scroll down gradually
      for (let i = 0; i <= 10; i++) {
        await page.evaluate((step) => {
          window.scrollTo(0, step * 400);
        }, i);
        await new Promise(r => setTimeout(r, 200));
      }
      await page.screenshot({ path: path.join(outputDir, `services_scroll_mid.png`) });

      // Scroll back up
      for (let i = 10; i >= 0; i--) {
        await page.evaluate((step) => {
          window.scrollTo(0, step * 400);
        }, i);
        await new Promise(r => setTimeout(r, 150));
      }
      console.log('GSAP scroll test finished successfully.');
    }

    await page.close();
  }

  await browser.close();

  console.log('--- QA SUITE REPORT ---');
  console.log('Console Errors/Warnings:', report.consoleErrors.length);
  console.log('Page Errors:', report.pageErrors.length);
  console.log('Next.js Issues:', report.nextIssues.length);
  console.log('Overflows:', report.overflows.length);

  fs.writeFileSync(path.join(process.cwd(), 'scratch', 'qa_report.json'), JSON.stringify(report, null, 2));
  console.log('Report saved to scratch/qa_report.json');
})();
