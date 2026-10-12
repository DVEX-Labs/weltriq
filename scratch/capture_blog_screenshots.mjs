import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Home Blog Section
  console.log('Capturing home_blog_section.png...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => 
      h.textContent.toLowerCase().includes('latest roofing insights')
    );
    if (heading) {
      heading.closest('section')?.scrollIntoView({ block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const homePath = path.join(SCRATCH_DIR, 'home_blog_section.png');
  await page.screenshot({ path: homePath });
  fs.copyFileSync(homePath, path.join(ARTIFACTS_DIR, 'home_blog_section.png'));
  console.log('✓ Captured home_blog_section.png');

  // 2. Blog Listing Published
  console.log('Capturing blog_listing_published.png...');
  await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    window.scrollTo(0, 400);
  });
  await new Promise(r => setTimeout(r, 800));
  const blogListPath = path.join(SCRATCH_DIR, 'blog_listing_published.png');
  await page.screenshot({ path: blogListPath });
  fs.copyFileSync(blogListPath, path.join(ARTIFACTS_DIR, 'blog_listing_published.png'));
  console.log('✓ Captured blog_listing_published.png');

  // 3. Blog Detail Page
  console.log('Capturing blog_detail_page.png...');
  await page.goto('http://localhost:3000/blog/choosing-the-right-metal-roofing-in-kerala', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  const detailPath = path.join(SCRATCH_DIR, 'blog_detail_page.png');
  await page.screenshot({ path: detailPath });
  fs.copyFileSync(detailPath, path.join(ARTIFACTS_DIR, 'blog_detail_page.png'));
  console.log('✓ Captured blog_detail_page.png');

  // 4. Admin Blogs List
  console.log('Capturing admin_blogs_list.png...');
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'domcontentloaded' });
  await page.type('#username', 'admin');
  await page.type('#password', 'weltriq2026!');
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => window.location.href.includes('/admin/blogs'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));
  const adminPath = path.join(SCRATCH_DIR, 'admin_blogs_list.png');
  await page.screenshot({ path: adminPath });
  fs.copyFileSync(adminPath, path.join(ARTIFACTS_DIR, 'admin_blogs_list.png'));
  console.log('✓ Captured admin_blogs_list.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
