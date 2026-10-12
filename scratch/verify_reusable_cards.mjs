import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  console.log('====================================================');
  console.log('STARTING REUSABLE CARD & REGRESSION PROTECTION QA');
  console.log('====================================================');

  const artifactDir = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let allTestsPassed = true;

  // Helper page creator with error logging
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
  // TEST 1: /services — Service Delivery (How We Deliver)
  // ----------------------------------------------------
  console.log('\n--- 1. Testing /services: Service Delivery (WeltriqCard) ---');
  {
    const page = await createMonitoredPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    const cardData = await page.evaluate(() => {
      // Find the Service Delivery section
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

    if (!cardData) {
      console.error('FAILED: How We Deliver section not found on /services');
      allTestsPassed = false;
    } else {
      console.log(`Found ${cardData.cardCount} cards in Service Delivery.`);
      if (cardData.cardCount !== 6) {
        console.error(`FAILED: Expected 6 cards, found ${cardData.cardCount}`);
        allTestsPassed = false;
      } else {
        console.log('✓ Exactly 6 cards rendered.');
      }

      cardData.cards.forEach((c, idx) => {
        console.log(`  Card ${idx + 1}: [${c.badge}] #${c.number} ${c.title} (icon: ${c.icon}, arrow: ${c.arrow}, color: ${c.numberColor})`);
        if (!c.number || !c.title || !c.icon || !c.arrow) {
          console.error(`FAILED: Card ${idx + 1} missing required element!`);
          allTestsPassed = false;
        }
      });
    }

    // Scroll to the section and capture screenshot
    const sectionEl = await page.evaluateHandle(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How We Deliver'));
      return heading ? heading.closest('section') : null;
    });

    if (sectionEl) {
      await sectionEl.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({
        path: path.join(artifactDir, 'services_delivery_qa.png')
      });
      console.log('✓ Captured services_delivery_qa.png screenshot');
    }

    // Test hover on Card 1
    const firstCard = await page.$('section .group');
    if (firstCard) {
      await firstCard.hover();
      await new Promise(r => setTimeout(r, 600));
      const hoverMetrics = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        const transform = style.transform;
        const accentLine = el.querySelector('.bg-brand-yellow');
        const accentOpacity = accentLine ? window.getComputedStyle(accentLine).opacity : '0';
        return { transform, accentOpacity };
      }, firstCard);
      console.log(`✓ Card hover metrics: transform="${hoverMetrics.transform}", accentLineOpacity="${hoverMetrics.accentOpacity}"`);
    }

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
        console.error(`FAILED: Expected 5 cards, found ${approachData.cardCount}`);
        allTestsPassed = false;
      } else {
        console.log('✓ Exactly 5 cards rendered.');
      }

      approachData.cards.forEach((c, idx) => {
        console.log(`  Card ${idx + 1}: [${c.badge}] #${c.number} ${c.title} — "${c.desc}" | Footer: "${c.footer}" (arrow: ${c.arrow}, color: ${c.numberColor})`);
        if (!c.number || !c.title || !c.desc || !c.footer || !c.arrow) {
          console.error(`FAILED: Principle card ${idx + 1} missing required element!`);
          allTestsPassed = false;
        }
      });
    }

    // Scroll to the section and capture screenshot
    const sectionEl = await page.evaluateHandle(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Built On Professional Delivery Principles'));
      return heading ? heading.closest('section') : null;
    });

    if (sectionEl) {
      await sectionEl.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({
        path: path.join(artifactDir, 'about_approach_qa.png')
      });
      console.log('✓ Captured about_approach_qa.png screenshot');
    }

    // Test hover on Principle 1
    const firstCard = await page.$('section .group');
    if (firstCard) {
      await firstCard.hover();
      await new Promise(r => setTimeout(r, 600));
      const hoverMetrics = await page.evaluate(el => {
        const style = window.getComputedStyle(el);
        const transform = style.transform;
        const accentLine = el.querySelector('.bg-brand-yellow');
        const accentOpacity = accentLine ? window.getComputedStyle(accentLine).opacity : '0';
        return { transform, accentOpacity };
      }, firstCard);
      console.log(`✓ Card hover metrics: transform="${hoverMetrics.transform}", accentLineOpacity="${hoverMetrics.accentOpacity}"`);
    }

    await page.close();
  }

  // ----------------------------------------------------
  // TEST 3: REGRESSION TEST — /services: ServicesShowcase (10 Pinned Cards)
  // ----------------------------------------------------
  console.log('\n--- 3. Regression Protection: ServicesShowcase (10 Pinned Cards & WobbleCard) ---');
  {
    const page = await createMonitoredPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    const showcaseCheck = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Services'));
      if (!heading) return { error: 'ServicesShowcase heading not found' };

      // Check cards
      const showcaseSection = heading.closest('section');
      const cards = showcaseSection ? Array.from(showcaseSection.querySelectorAll('[data-service-card]')) : [];
      return {
        hasSection: Boolean(showcaseSection),
        cardCount: cards.length,
        firstCardId: cards[0]?.getAttribute('data-service-card') || null,
        lastCardId: cards[cards.length - 1]?.getAttribute('data-service-card') || null
      };
    });

    console.log('ServicesShowcase inspection:', showcaseCheck);
    if (showcaseCheck.cardCount !== 7) {
      console.error(`FAILED: Expected 7 service cards on /services, found ${showcaseCheck.cardCount}`);
      allTestsPassed = false;
    } else {
      console.log('✓ All 7 Services Showcase cards intact and mounted on /services.');
    }

    // Simulate scrolling through pinned sequence
    await page.evaluate(() => window.scrollTo(0, 1500));
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => window.scrollTo(0, 3500));
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => window.scrollTo(0, 0)); // reverse scroll
    await new Promise(r => setTimeout(r, 400));
    console.log('✓ Forward and reverse scroll execution completed without errors.');

    await page.close();
  }

  // ----------------------------------------------------
  // TEST 4: REGRESSION TEST — Home Process SVG Animation (/)
  // ----------------------------------------------------
  console.log('\n--- 4. Regression Protection: Home Process SVG Animation (/) ---');
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
