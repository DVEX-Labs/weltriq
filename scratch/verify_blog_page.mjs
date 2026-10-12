import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const consoleMsgs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMsgs.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    consoleMsgs.push(`[pageerror] ${err.message}`);
  });

  const viewports = [
    { name: '320', width: 320, height: 800 },
    { name: '375', width: 375, height: 800 },
    { name: '390', width: 390, height: 844 },
    { name: '430', width: 430, height: 932 },
    { name: '768', width: 768, height: 1024 },
    { name: '1024', width: 1024, height: 768 },
    { name: '1280', width: 1280, height: 800 },
    { name: '1440', width: 1440, height: 900 },
    { name: '1920', width: 1920, height: 1080 },
  ];

  const artifactDir = 'C:/Users/salah/.gemini/antigravity-ide/brain/0f362c2c-2744-4841-b713-62d83a39615a';
  const overflowIssues = [];

  // Navigate once
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // Check navbar active state aria-current
  const ariaCurrentOnBlog = await page.evaluate(() => {
    const blogNav = Array.from(document.querySelectorAll('a[href="/blog"]')).find(el => el.getAttribute('aria-current') === 'page');
    return !!blogNav;
  });

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await new Promise(r => setTimeout(r, 200));

    // Check horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });

    if (hasOverflow) {
      overflowIssues.push(`Horizontal overflow detected at ${vp.width}px`);
    }

    // Take screenshot of Hero on 1440, 768, 390
    if (['1440', '768', '390'].includes(vp.name)) {
      await page.screenshot({
        path: path.join(artifactDir, `blog_page_refined_${vp.name}.png`),
      });
    }
  }

  console.log('=== BLOG PAGE QA REPORT ===');
  console.log('Target viewports tested: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920');
  console.log('Console errors:', consoleMsgs.length > 0 ? consoleMsgs : 'NONE');
  console.log('Horizontal overflow issues:', overflowIssues.length > 0 ? overflowIssues : 'NONE');
  console.log('Navbar aria-current="page" on Blog:', ariaCurrentOnBlog ? 'YES (PASS)' : 'NO');

  await browser.close();
})();
