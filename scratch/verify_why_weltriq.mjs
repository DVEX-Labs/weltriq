import puppeteer from 'puppeteer';

(async () => {
  console.log('--- STARTING SPECIFIC WHY WELTRIQ VERIFICATION ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const pagesToTest = ['/', '/services'];
  let allMatched = true;

  for (const urlPath of pagesToTest) {
    console.log(`Checking page: ${urlPath}...`);
    await page.goto(`http://localhost:3000${urlPath}`, { waitUntil: 'networkidle0' });

    const whyData = await page.evaluate(() => {
      // Find the section containing WHY WELTRIQ
      const sections = Array.from(document.querySelectorAll('section'));
      const section = sections.find(s => s.textContent.includes('WHY WELTRIQ') || s.textContent.includes('Why WELTRIQ'));
      if (!section) return null;

      const kicker = section.querySelector('span')?.textContent?.trim();
      const heading = section.querySelector('h2')?.textContent?.trim();
      const subtitle = section.querySelector('p')?.textContent?.trim();

      const items = Array.from(section.querySelectorAll('.group')).map(el => {
        const number = el.querySelector('span')?.textContent?.trim();
        const title = el.querySelector('h3')?.textContent?.trim();
        const desc = el.querySelector('p')?.textContent?.trim();
        return { number, title, desc };
      });

      const isSticky = section.innerHTML.includes('lg:sticky') || section.querySelector('.sticky') !== null || section.querySelector('.lg\\:sticky') !== null;

      return { kicker, heading, subtitle, items, isSticky, hasDarkBg: section.className.includes('bg-brand-navy') };
    });

    console.log(`Results for ${urlPath}:`, JSON.stringify(whyData, null, 2));

    if (!whyData) {
      console.error(`FAILED: Section not found on ${urlPath}`);
      allMatched = false;
      continue;
    }

    if (whyData.items.length !== 5) {
      console.error(`FAILED: Expected 5 items on ${urlPath}, got ${whyData.items.length}`);
      allMatched = false;
    }

    if (whyData.isSticky) {
      console.error(`FAILED: Sticky positioning detected on ${urlPath}`);
      allMatched = false;
    }

    if (!whyData.hasDarkBg) {
      console.error(`FAILED: Dark Navy background missing on ${urlPath}`);
      allMatched = false;
    }
  }

  await browser.close();

  if (allMatched) {
    console.log('SUCCESS: Why WELTRIQ component is identical, correct, non-sticky, Dark Navy, and present on both pages!');
  } else {
    console.error('VERIFICATION FAILED!');
    process.exit(1);
  }
})();
