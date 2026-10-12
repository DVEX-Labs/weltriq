import puppeteer from 'puppeteer';
import path from 'path';

const VIEWPORTS = [
  { width: 320, height: 600, name: 'mobile_320' },
  { width: 375, height: 667, name: 'mobile_375' },
  { width: 390, height: 844, name: 'mobile_390' },
  { width: 430, height: 932, name: 'mobile_430' },
  { width: 768, height: 1024, name: 'tablet_768' },
  { width: 1024, height: 768, name: 'desktop_1024' },
  { width: 1280, height: 800, name: 'desktop_1280' },
  { width: 1440, height: 900, name: 'desktop_1440' },
  { width: 1920, height: 1080, name: 'desktop_1920' },
];

const ARTIFACT_DIR = 'C:\\Users\\salah\\.gemini\\antigravity-ide\\brain\\0f362c2c-2744-4841-b713-62d83a39615a';

async function runQA() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('--- STARTING CONTACT PAGE BROWSER QA ---');

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });

    // 1. Overflow check
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    // 2. Desktop First Viewport check
    let heroFitsFirstViewport = false;
    if (vp.width >= 1280) {
      const heroBottom = await page.evaluate(() => {
        const hero = document.querySelector('section');
        return hero ? hero.getBoundingClientRect().bottom : 0;
      });
      heroFitsFirstViewport = heroBottom <= vp.height + 50; // allow small buffer
    }

    console.log(`[Viewport ${vp.width}x${vp.height} (${vp.name})] Overflow: ${hasHorizontalOverflow} ${vp.width >= 1280 ? `FirstViewportFit: ${heroFitsFirstViewport}` : ''}`);

    if (vp.width === 390 || vp.width === 768 || vp.width === 1440) {
      const screenshotPath = path.join(ARTIFACT_DIR, `contact_page_${vp.width}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`Captured screenshot: ${screenshotPath}`);
    }
  }

  // Check specific elements on desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle2' });

  // Verify H1 text
  const h1Text = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText.replace(/\n/g, ' ') : '';
  });
  console.log('H1 Text:', h1Text);

  // Verify aria-current on active navbar link
  const ariaCurrentLink = await page.evaluate(() => {
    const activeLink = document.querySelector('nav a[aria-current="page"]');
    return activeLink ? activeLink.textContent : null;
  });
  console.log('Navbar active link (aria-current="page"):', ariaCurrentLink);

  // Verify CTA click smooth scroll
  const enquirySectionInView = await page.evaluate(async () => {
    const cta = document.querySelector('a[href="#enquiry"]');
    if (!cta) return false;
    cta.click();
    await new Promise(r => setTimeout(r, 600));
    const enquiry = document.getElementById('enquiry');
    if (!enquiry) return false;
    const rect = enquiry.getBoundingClientRect();
    return rect.top >= -50 && rect.top <= window.innerHeight;
  });
  console.log('CTA #enquiry smooth scroll verification:', enquirySectionInView);

  // Verify Contact links
  const contactLinks = await page.evaluate(() => {
    const phone = document.querySelector('a[href^="tel:"]')?.getAttribute('href');
    const email = document.querySelector('a[href^="mailto:"]')?.getAttribute('href');
    const wa = document.querySelector('a[href*="wa.me"]')?.getAttribute('href');
    return { phone, email, wa };
  });
  console.log('Contact links:', contactLinks);

  // Verify Services options count
  const serviceOptionsCount = await page.evaluate(() => {
    const select = document.querySelector('select[name="requirement"]');
    return select ? select.options.length : 0;
  });
  console.log('Services select option count:', serviceOptionsCount);

  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console Errors:', consoleErrors);
  }

  await browser.close();
  console.log('--- QA COMPLETE ---');
}

runQA().catch(err => {
  console.error('QA Script Error:', err);
  process.exit(1);
});
