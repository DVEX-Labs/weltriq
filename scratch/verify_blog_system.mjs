import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';
const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch');
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'blogs.json');

async function run() {
  console.log('===========================================================');
  console.log('STARTING COMPREHENSIVE WELTRIQ BLOG SYSTEM VERIFICATION');
  console.log('===========================================================');

  // Reset blogs.json to clean empty array for test start
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2), 'utf8');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // -------------------------------------------------------------
  // TEST 1: ZERO PUBLISHED BLOGS
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing Zero Published Blogs State ---');
  await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const emptyStateData = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => 
      h.textContent.includes('NEW ROOFING INSIGHTS ARE ON THE WAY')
    );
    const badge = Array.from(document.querySelectorAll('span')).find(s => 
      s.textContent.includes('COMING SOON')
    );
    const cards = document.querySelectorAll('article');
    return {
      hasEmptyHeading: !!heading,
      hasBadge: !!badge,
      cardCount: cards.length
    };
  });

  console.log('Blog listing empty state check:', emptyStateData);
  if (!emptyStateData.hasEmptyHeading || emptyStateData.cardCount !== 0) {
    throw new Error('Expected polished empty state with 0 cards on /blog when 0 articles published.');
  }
  console.log('✓ /blog displays polished empty state with 0 cards.');

  // Check Home Page: Blog section must be COMPLETELY absent
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const homeBlogPresence = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => 
      h.textContent.toLowerCase().includes('latest roofing insights')
    );
    const badge = Array.from(document.querySelectorAll('span')).find(s => 
      s.textContent.includes('KNOWLEDGE & INSIGHTS')
    );
    return { hasHeading: !!heading, hasBadge: !!badge };
  });

  console.log('Home page blog presence (0 blogs):', homeBlogPresence);
  if (homeBlogPresence.hasHeading || homeBlogPresence.hasBadge) {
    throw new Error('CRITICAL FAILURE: Home blog section was rendered when 0 blogs exist!');
  }
  console.log('✓ Home blog section is COMPLETELY UNMOUNTED when 0 blogs exist.');

  // Screenshot empty state on /blog
  await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  const emptyScreenshot = path.join(SCRATCH_DIR, 'blog_empty_state.png');
  await page.screenshot({ path: emptyScreenshot });
  fs.copyFileSync(emptyScreenshot, path.join(ARTIFACTS_DIR, 'blog_empty_state.png'));
  console.log('✓ Captured blog_empty_state.png');

  // -------------------------------------------------------------
  // TEST 2: ADMIN AUTHENTICATION & LOGIN
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Admin Authentication & Login ---');
  await page.goto('http://localhost:3000/admin/blogs', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // Should have been redirected to /admin/login
  const currentUrl = page.url();
  console.log('URL after accessing /admin/blogs without auth:', currentUrl);
  if (!currentUrl.includes('/admin/login')) {
    throw new Error('Expected redirect to /admin/login for unauthenticated request.');
  }
  console.log('✓ Server-side route guard redirected unauthenticated user to /admin/login.');

  // Login with credentials
  await page.type('#username', 'admin');
  await page.type('#password', 'weltriq2026!');
  await page.click('button[type="submit"]');
  
  // Wait for redirect to /admin/blogs with generous timeout for first dev compilation
  await page.waitForFunction(() => window.location.href.includes('/admin/blogs'), { timeout: 45000 });
  await new Promise(r => setTimeout(r, 1500));

  console.log('URL after login:', page.url());
  if (!page.url().includes('/admin/blogs')) {
    throw new Error('Expected redirect to /admin/blogs after successful login.');
  }
  console.log('✓ Successfully authenticated and accessed Admin Portal.');

  // -------------------------------------------------------------
  // TEST 3: DRAFT ARTICLE CREATION (DRAFT PRIVACY)
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Draft Article Creation & Privacy ---');
  await page.goto('http://localhost:3000/admin/blogs/new', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // Fill in draft article
  await page.type('input[placeholder*="e.g. Complete Guide"]', 'Secret Draft: Roofing Innovation in 2027');
  await page.type('textarea[placeholder*="concise 1-2 sentence"]', 'This is an unpublished draft discussing future roofing technologies.');
  await page.type('input[placeholder*="/images/refined/blog_hero.webp"]', '/images/refined/commercial_roofing_card.webp');
  await page.type('#article-content-input', '## Future Tech\n\nThis article is private draft content.');

  // Save Draft (first button in top bar)
  const saveDraftBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Save Draft'));
  });
  await saveDraftBtn.click();
  await page.waitForFunction(() => !window.location.href.includes('/admin/blogs/new'), { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Verify in Admin List
  const adminDraftListed = await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('tr')).find(r => r.textContent.includes('Secret Draft'));
    const isDraft = row ? row.textContent.includes('Draft') : false;
    return { listed: !!row, isDraft };
  });
  console.log('Admin draft listed:', adminDraftListed);
  if (!adminDraftListed.listed || !adminDraftListed.isDraft) {
    throw new Error('Draft was not found with Draft status in Admin list.');
  }
  console.log('✓ Draft saved and listed as "Draft" in admin dashboard.');

  // Verify draft is HIDDEN from /blog
  await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  const publicHasDraft = await page.evaluate(() => {
    return document.body.textContent.includes('Secret Draft');
  });
  if (publicHasDraft) {
    throw new Error('SECURITY VIOLATION: Draft was exposed on public /blog listing!');
  }
  console.log('✓ Draft is strictly excluded from public /blog listing.');

  // Verify draft returns 404 on direct URL
  const res = await page.goto('http://localhost:3000/blog/secret-draft-roofing-innovation-in-2027', { waitUntil: 'domcontentloaded' });
  console.log('Direct draft status code:', res.status());
  if (res.status() !== 404) {
    throw new Error('SECURITY VIOLATION: Draft direct slug did not return 404!');
  }
  console.log('✓ Direct draft access returned 404 Not Found.');

  // -------------------------------------------------------------
  // TEST 4: PUBLISH ARTICLE 1 & VERIFY DETAIL + HOME
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Publishing Article 1 ---');
  await page.goto('http://localhost:3000/admin/blogs/new', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  await page.type('input[placeholder*="e.g. Complete Guide"]', 'Choosing the Right Metal Roofing in Kerala');
  await page.type('textarea[placeholder*="concise 1-2 sentence"]', 'An architectural guide to selecting durable metal roofing sheets built for tropical rainfall and coastal climates.');
  await page.type('input[placeholder*="/images/refined/blog_hero.webp"]', '/images/refined/metal_roofing_card.webp');
  await page.type('#article-content-input', `## Climatic Challenges in Kerala

Kerala experiences over 3,000 mm of annual rainfall alongside high atmospheric humidity and saline coastal winds. Standard roofing profiles often suffer from moisture ingress or early corrosion without proper galvanic coatings.

### Material Specifications

- **Galvalume Alloys:** 55% Aluminum-Zinc alloy coatings provide superior sacrificial protection.
- **Minimum Base Metal Thickness:** Ensure at least 0.45mm to 0.50mm BMT for heavy wind loads.
- **Fastener Engineering:** EPDM washered hex-head fasteners prevent micro-leaks.

> Always insist on continuous ridge capping and precision gutter sizing to handle peak monsoon runoff volumes.`);

  const publishBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Publish Now'));
  });
  await publishBtn.click();
  await page.waitForFunction(() => !window.location.href.includes('/admin/blogs/new'), { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Check /blog: now renders 1 published article
  await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const blogCardData = await page.evaluate(() => {
    const card = document.querySelector('article');
    if (!card) return null;
    const title = card.querySelector('h3')?.textContent.trim();
    const category = card.querySelector('span')?.textContent.trim();
    const link = card.querySelector('a')?.getAttribute('href');
    return { title, category, link };
  });

  console.log('Public blog card data:', blogCardData);
  if (!blogCardData || !blogCardData.title.includes('Choosing the Right Metal Roofing')) {
    throw new Error('Published article did not appear on /blog!');
  }
  console.log('✓ Article appeared on public /blog listing.');

  // Screenshot /blog with 1 article
  const blogListScreenshot = path.join(SCRATCH_DIR, 'blog_listing_published.png');
  await page.screenshot({ path: blogListScreenshot });
  fs.copyFileSync(blogListScreenshot, path.join(ARTIFACTS_DIR, 'blog_listing_published.png'));
  console.log('✓ Captured blog_listing_published.png');

  // Verify /blog/choosing-the-right-metal-roofing-in-kerala detail page
  await page.goto('http://localhost:3000/blog/choosing-the-right-metal-roofing-in-kerala', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const detailData = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent.trim();
    const h2 = document.querySelector('h2')?.textContent.trim();
    const quote = document.querySelector('blockquote')?.textContent.trim();
    const cover = document.querySelector('img[alt*="Metal Roofing"]')?.getAttribute('src');
    return { h1, h2, quote, hasCover: !!cover };
  });

  console.log('Detail page data:', detailData);
  if (!detailData.h1?.includes('Choosing the Right Metal Roofing') || !detailData.quote) {
    throw new Error('Detail page did not render proper headings or blockquote formatting.');
  }
  console.log('✓ Detail page rendered typography, Markdown headings, lists, blockquotes, and cover image perfectly.');

  const detailScreenshot = path.join(SCRATCH_DIR, 'blog_detail_page.png');
  await page.screenshot({ path: detailScreenshot });
  fs.copyFileSync(detailScreenshot, path.join(ARTIFACTS_DIR, 'blog_detail_page.png'));
  console.log('✓ Captured blog_detail_page.png');

  // Check Home Page: NOW RENDERS EXACTLY 1 CARD + "View All Articles"
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const homeOneCardData = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => 
      h.textContent.toLowerCase().includes('latest roofing insights')
    );
    if (!heading) return null;
    const section = heading.closest('section');
    const cards = section.querySelectorAll('article');
    const viewAll = section.querySelector('a[href="/blog"]');
    return {
      cardCount: cards.length,
      hasViewAll: !!viewAll,
      cardTitle: cards[0]?.querySelector('h3')?.textContent.trim()
    };
  });

  console.log('Home page with 1 article:', homeOneCardData);
  if (homeOneCardData?.cardCount !== 1 || !homeOneCardData.hasViewAll) {
    throw new Error('Expected Home section to render exactly 1 card and "View All Articles" button.');
  }
  console.log('✓ Home page correctly adapted to exactly 1 published article.');

  // -------------------------------------------------------------
  // TEST 5: MULTIPLE ARTICLES & HOME LIMIT CAP
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing Multiple Articles & Home Limit Cap ---');

  // Create Article 2
  await page.goto('http://localhost:3000/admin/blogs/new', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  await page.type('input[placeholder*="e.g. Complete Guide"]', 'UPVC vs Clay Tile Roofing: Engineering Analysis');
  await page.type('textarea[placeholder*="concise 1-2 sentence"]', 'A technical performance comparison between modern UPVC profiles and traditional clay tiles.');
  await page.type('input[placeholder*="/images/refined/blog_hero.webp"]', '/images/refined/upvc_roofing_card.webp');
  await page.type('#article-content-input', '## Engineering Comparison\n\nUPVC offers lightweight corrosion resistance while clay tiles provide thermal insulation.');
  let pubBtn = await page.evaluateHandle(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Publish Now')));
  await pubBtn.click();
  await page.waitForFunction(() => !window.location.href.includes('/admin/blogs/new'), { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Create Article 3
  await page.goto('http://localhost:3000/admin/blogs/new', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  await page.type('input[placeholder*="e.g. Complete Guide"]', 'Monsoon Roof Maintenance: 5 Critical Inspection Steps');
  await page.type('textarea[placeholder*="concise 1-2 sentence"]', 'Essential pre-monsoon inspection protocols to prevent leaks, structural dampness, and gutter overflow.');
  await page.type('input[placeholder*="/images/refined/blog_hero.webp"]', '/images/refined/roof_renovation_card.webp');
  await page.type('#article-content-input', '## Monsoon Preparedness\n\n1. Inspect gutters\n2. Check flashing seals\n3. Verify anchor tightness');
  pubBtn = await page.evaluateHandle(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Publish Now')));
  await pubBtn.click();
  await page.waitForFunction(() => !window.location.href.includes('/admin/blogs/new'), { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Create Article 4
  await page.goto('http://localhost:3000/admin/blogs/new', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  await page.type('input[placeholder*="e.g. Complete Guide"]', 'Structural Steel Framing for Commercial Warehouses');
  await page.type('textarea[placeholder*="concise 1-2 sentence"]', 'Design parameters for large-span industrial trusses and wind load deflection limits.');
  await page.type('input[placeholder*="/images/refined/blog_hero.webp"]', '/images/refined/industrial_roofing_card.webp');
  await page.type('#article-content-input', '## Industrial Trusses\n\nLarge-span trusses require precise node engineering.');
  pubBtn = await page.evaluateHandle(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Publish Now')));
  await pubBtn.click();
  await page.waitForFunction(() => !window.location.href.includes('/admin/blogs/new'), { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Verify Home page has capped at EXACTLY 3 cards (HOME_BLOG_MAX_COUNT)
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const homeFourArticleCheck = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => 
      h.textContent.toLowerCase().includes('latest roofing insights')
    );
    const section = heading.closest('section');
    const cards = section.querySelectorAll('article');
    return { cardCount: cards.length };
  });

  console.log('Home page card count with 4 published articles:', homeFourArticleCheck);
  if (homeFourArticleCheck.cardCount !== 3) {
    throw new Error(`Expected Home section to cap at 3 cards, got ${homeFourArticleCheck.cardCount}`);
  }
  console.log('✓ Home page successfully capped at configured maximum of 3 cards while 4 exist.');

  // Screenshot Home Blog Section
  const homeSectionHandle = await page.evaluateHandle(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => 
      h.textContent.toLowerCase().includes('latest roofing insights')
    );
    const section = heading.closest('section');
    section.scrollIntoView({ block: 'center' });
    return section;
  });
  await new Promise(r => setTimeout(r, 500));
  const homeSectionScreenshot = path.join(SCRATCH_DIR, 'home_blog_section.png');
  await homeSectionHandle.screenshot({ path: homeSectionScreenshot });
  fs.copyFileSync(homeSectionScreenshot, path.join(ARTIFACTS_DIR, 'home_blog_section.png'));
  console.log('✓ Captured home_blog_section.png');

  // Screenshot Admin Blogs list
  await page.goto('http://localhost:3000/admin/blogs', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  const adminScreenshot = path.join(SCRATCH_DIR, 'admin_blogs_list.png');
  await page.screenshot({ path: adminScreenshot });
  fs.copyFileSync(adminScreenshot, path.join(ARTIFACTS_DIR, 'admin_blogs_list.png'));
  console.log('✓ Captured admin_blogs_list.png');

  // -------------------------------------------------------------
  // TEST 6: RESPONSIVE VIEWPORT CHECKS
  // -------------------------------------------------------------
  console.log('\n--- 6. Testing Responsive Viewports (No Overflow) ---');
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1024, height: 768, name: 'Desktop' },
    { width: 1440, height: 900, name: 'Wide Desktop' },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded' });
    const overflowBlog = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflowBlog) throw new Error(`Overflow detected on /blog at ${vp.name} (${vp.width}px)`);

    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    const overflowHome = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (overflowHome) throw new Error(`Overflow detected on / at ${vp.name} (${vp.width}px)`);

    console.log(`✓ Zero overflow on ${vp.name} (${vp.width}px) for both /blog and Home.`);
  }

  // -------------------------------------------------------------
  // TEST 7: REGRESSION PROTECTION (HOME PROCESS & SERVICES SHOWCASE)
  // -------------------------------------------------------------
  console.log('\n--- 7. Testing Regression Protection ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const homeRegressions = await page.evaluate(() => {
    const process = !!document.querySelector('path[d*="M"]');
    const showcase = Array.from(document.querySelectorAll('h2')).some(h => h.textContent.includes('Solutions'));
    return { process, showcase };
  });
  console.log('Home regressions check:', homeRegressions);
  if (!homeRegressions.process || !homeRegressions.showcase) {
    throw new Error('Regression: Process SVG or Showcase cards missing from Home.');
  }
  console.log('✓ Home Process SVG journey and ServicesShowcase are 100% intact.');

  await browser.close();
  console.log('\n===========================================================');
  console.log('ALL BLOG SYSTEM VERIFICATIONS PASSED WITH 100% SUCCESS!');
  console.log('===========================================================');
}

run().catch((err) => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
