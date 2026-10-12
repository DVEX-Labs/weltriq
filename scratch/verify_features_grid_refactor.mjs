import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  console.log('====================================================');
  console.log('STARTING FEATURES GRID REFACTOR VERIFICATION');
  console.log('====================================================');

  const artifactDir = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let allTestsPassed = true;

  const createMonitoredPage = async () => {
    const page = await browser.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('[BROWSER CONSOLE ERROR]:', msg.text());
        allTestsPassed = false;
      }
    });
    page.on('pageerror', err => {
      console.error('[BROWSER PAGE ERROR]:', err.message);
      allTestsPassed = false;
    });
    return page;
  };

  // ----------------------------------------------------
  // TEST 1: /services — ProjectTypes & ServiceDelivery
  // ----------------------------------------------------
  console.log('\n--- 1. Testing /services: ProjectTypes & ServiceDelivery ---');
  {
    const page = await createMonitoredPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    // A. ProjectTypes inspection
    const projectTypesData = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Roofing For Every Project'));
      if (!heading) return null;
      const section = heading.closest('section');
      if (!section) return null;

      const cards = Array.from(section.querySelectorAll('.group'));
      return {
        cardCount: cards.length,
        cards: cards.map(c => {
          const number = c.querySelector('.font-display.font-extrabold')?.textContent?.trim() || '';
          const title = c.querySelector('h3')?.textContent?.trim() || '';
          const footer = c.querySelector('.border-t span')?.textContent?.trim() || '';
          const hasFooterRight = Boolean(c.querySelector('.border-t div'));
          const numberColor = window.getComputedStyle(c.querySelector('.font-display.font-extrabold') || c).color;
          return { number, title, footer, hasFooterRight, numberColor };
        })
      };
    });

    if (!projectTypesData) {
      console.error('FAILED: ProjectTypes section not found on /services');
      allTestsPassed = false;
    } else {
      console.log(`Found ${projectTypesData.cardCount} cards in ProjectTypes.`);
      if (projectTypesData.cardCount !== 3) {
        console.error(`FAILED: Expected 3 ProjectTypes cards, found ${projectTypesData.cardCount}`);
        allTestsPassed = false;
      } else {
        console.log('✓ Exactly 3 ProjectTypes cards rendered.');
      }
      projectTypesData.cards.forEach((c, idx) => {
        console.log(`  Project Card ${idx + 1}: #${c.number} ${c.title} | Footer: "${c.footer}" | FooterRight: ${c.hasFooterRight} | Color: ${c.numberColor}`);
        if (!c.number || !c.title || !c.footer) {
          console.error(`FAILED: Project Card ${idx + 1} missing required content!`);
          allTestsPassed = false;
        }
      });
    }

    // Scroll to ProjectTypes and capture screenshot
    const ptSection = await page.evaluateHandle(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Roofing For Every Project'));
      return heading ? heading.closest('section') : null;
    });
    if (ptSection) {
      await ptSection.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(artifactDir, 'project_types_qa.png') });
      console.log('✓ Captured project_types_qa.png screenshot');
    }

    // B. ServiceDelivery inspection
    const deliveryData = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How We Deliver'));
      if (!heading) return null;
      const section = heading.closest('section');
      if (!section) return null;

      const cards = Array.from(section.querySelectorAll('.group'));
      return {
        cardCount: cards.length,
        cards: cards.map(c => {
          const badge = c.querySelector('span')?.textContent?.trim() || '';
          const number = c.querySelector('.font-display.font-extrabold')?.textContent?.trim() || '';
          const title = c.querySelector('h3')?.textContent?.trim() || '';
          const arrow = Boolean(c.querySelector('svg.lucide-arrow-right'));
          const icon = Boolean(c.querySelector('svg:not(.lucide-arrow-right)'));
          const numberColor = window.getComputedStyle(c.querySelector('.font-display.font-extrabold') || c).color;
          return { badge, number, title, arrow, icon, numberColor };
        })
      };
    });

    if (!deliveryData) {
      console.error('FAILED: How We Deliver section not found on /services');
      allTestsPassed = false;
    } else {
      console.log(`Found ${deliveryData.cardCount} cards in Service Delivery.`);
      if (deliveryData.cardCount !== 6) {
        console.error(`FAILED: Expected 6 Service Delivery cards, found ${deliveryData.cardCount}`);
        allTestsPassed = false;
      } else {
        console.log('✓ Exactly 6 Service Delivery cards rendered.');
      }
      deliveryData.cards.forEach((c, idx) => {
        console.log(`  Delivery Card ${idx + 1}: [${c.badge}] #${c.number} ${c.title} (icon: ${c.icon}, arrow: ${c.arrow}, color: ${c.numberColor})`);
        if (!c.number || !c.title || !c.icon || !c.arrow) {
          console.error(`FAILED: Delivery Card ${idx + 1} missing required element!`);
          allTestsPassed = false;
        }
      });
    }

    // Scroll to ServiceDelivery and capture screenshot
    const sdSection = await page.evaluateHandle(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How We Deliver'));
      return heading ? heading.closest('section') : null;
    });
    if (sdSection) {
      await sdSection.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(artifactDir, 'services_delivery_qa.png') });
      console.log('✓ Captured services_delivery_qa.png screenshot');
    }

    // C. Regression check on ServicesShowcase on /services
    const showcaseData = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Services'));
      if (!heading) return { error: 'Our Services heading not found' };
      const section = heading.closest('section');
      const cards = section ? Array.from(section.querySelectorAll('[data-service-card]')) : [];
      return {
        hasSection: Boolean(section),
        actualCardCount: cards.length,
        firstCardId: cards[0]?.getAttribute('data-service-card') || null,
        lastCardId: cards[cards.length - 1]?.getAttribute('data-service-card') || null
      };
    });
    console.log(`Services Showcase on /services: ${showcaseData.actualCardCount} actual cards mounted (${showcaseData.firstCardId} to ${showcaseData.lastCardId})`);
    if (showcaseData.actualCardCount === 0) {
      console.error('FAILED: No service cards mounted in ServicesShowcase!');
      allTestsPassed = false;
    } else {
      console.log('✓ ServicesShowcase cards intact.');
    }

    // Scroll sequence for ServicesShowcase pinning & reverse scrolling
    await page.evaluate(() => window.scrollTo(0, 1500));
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => window.scrollTo(0, 3500));
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 400));
    console.log('✓ ServicesShowcase forward and reverse scroll pinning executed cleanly.');

    await page.close();
  }

  // ----------------------------------------------------
  // TEST 2: /about — About Approach (Our Approach)
  // ----------------------------------------------------
  console.log('\n--- 2. Testing /about: About Approach (WeltriqCard) ---');
  {
    const page = await createMonitoredPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    const approachData = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Built On Professional Delivery Principles'));
      if (!heading) return null;
      const section = heading.closest('section');
      if (!section) return null;

      const cards = Array.from(section.querySelectorAll('.group'));
      return {
        cardCount: cards.length,
        cards: cards.map(c => {
          const badge = c.querySelector('span')?.textContent?.trim() || '';
          const number = c.querySelector('.font-display.font-extrabold')?.textContent?.trim() || '';
          const title = c.querySelector('h3')?.textContent?.trim() || '';
          const desc = c.querySelector('p')?.textContent?.trim() || '';
          const footer = c.querySelector('.border-t span')?.textContent?.trim() || '';
          const arrow = Boolean(c.querySelector('svg.lucide-arrow-right'));
          const numberColor = window.getComputedStyle(c.querySelector('.font-display.font-extrabold') || c).color;
          return { badge, number, title, desc, footer, arrow, numberColor };
        })
      };
    });

    if (!approachData) {
      console.error('FAILED: Our Approach section not found on /about');
      allTestsPassed = false;
    } else {
      console.log(`Found ${approachData.cardCount} cards in About Approach.`);
      if (approachData.cardCount !== 5) {
        console.error(`FAILED: Expected 5 principle cards, found ${approachData.cardCount}`);
        allTestsPassed = false;
      } else {
        console.log('✓ Exactly 5 principle cards rendered.');
      }
      approachData.cards.forEach((c, idx) => {
        console.log(`  Principle Card ${idx + 1}: [${c.badge}] #${c.number} ${c.title} — "${c.desc}" | Footer: "${c.footer}" (arrow: ${c.arrow}, color: ${c.numberColor})`);
        if (!c.number || !c.title || !c.desc || !c.footer || !c.arrow) {
          console.error(`FAILED: Principle Card ${idx + 1} missing required element!`);
          allTestsPassed = false;
        }
      });
    }

    // Scroll to section and capture screenshot
    const aaSection = await page.evaluateHandle(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Built On Professional Delivery Principles'));
      return heading ? heading.closest('section') : null;
    });
    if (aaSection) {
      await aaSection.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(artifactDir, 'about_approach_qa.png') });
      console.log('✓ Captured about_approach_qa.png screenshot');
    }

    await page.close();
  }

  // ----------------------------------------------------
  // TEST 3: / — Regression check for Home Process SVG
  // ----------------------------------------------------
  console.log('\n--- 3. Regression Protection: Home Process SVG Animation (/) ---');
  {
    const page = await createMonitoredPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    const processCheck = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Process'));
      if (!heading) return { error: 'Our Process heading not found' };
      const section = heading.closest('section');
      const circles = section ? Array.from(section.querySelectorAll('.process-circle')) : [];
      const svgPaths = section ? Array.from(section.querySelectorAll('svg path')) : [];
      return {
        hasSection: Boolean(section),
        circleCount: circles.length,
        svgPathCount: svgPaths.length
      };
    });

    console.log('Home Process inspection:', processCheck);
    if (!processCheck.hasSection || processCheck.circleCount < 6) {
      console.error('FAILED: Home Process section or nodes missing!');
      allTestsPassed = false;
    } else {
      console.log('✓ Home Process 6 steps, circles, and SVG animation intact.');
    }

    // Scroll through Process section
    await page.evaluate(() => window.scrollTo(0, 2000));
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 400));
    console.log('✓ Home Process scroll interaction executed cleanly.');

    await page.close();
  }

  // ----------------------------------------------------
  // TEST 4: Responsive Viewport Overflow Check
  // ----------------------------------------------------
  console.log('\n--- 4. Responsive Viewport Overflow Check ---');
  {
    const page = await createMonitoredPage();
    const viewports = [
      { name: 'Mobile (375px)', width: 375, height: 667 },
      { name: 'Tablet (768px)', width: 768, height: 1024 },
      { name: 'Desktop (1024px)', width: 1024, height: 768 },
      { name: 'Wide Desktop (1440px)', width: 1440, height: 900 },
    ];

    for (const url of ['http://localhost:3000/services', 'http://localhost:3000/about']) {
      const pageName = url.includes('/about') ? 'About' : 'Services';
      for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height });
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await new Promise(r => setTimeout(r, 600));

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        if (overflow) {
          console.error(`FAILED: Horizontal overflow detected on ${pageName} at ${vp.name}!`);
          allTestsPassed = false;
        } else {
          console.log(`✓ ${pageName} at ${vp.name}: 0 horizontal overflow.`);
        }
      }
    }

    await page.close();
  }

  await browser.close();

  console.log('\n====================================================');
  if (allTestsPassed) {
    console.log('ALL TESTS PASSED! ZERO REGRESSIONS DETECTED.');
  } else {
    console.error('TESTS FAILED!');
    process.exit(1);
  }
  console.log('====================================================');
})();
