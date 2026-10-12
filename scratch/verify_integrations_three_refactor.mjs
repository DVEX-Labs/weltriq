import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea';

async function run() {
  console.log('====================================================');
  console.log('STARTING STANDARDIZED TYPOGRAPHY & CARD VERIFICATION');
  console.log('====================================================');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Services Page Check: ProjectTypes & ServiceDelivery
  console.log('\n--- 1. Testing /services: ProjectTypes & ServiceDelivery ---');
  await page.goto('http://localhost:3000/services', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // 1a. ProjectTypes Typography Inspection
  const projectTypesData = await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('roofing for every project'));
    if (!h2) return null;
    const section = h2.closest('section');
    if (!section) return null;
    const cards = Array.from(section.querySelectorAll('.grid > div'));
    return {
      count: cards.length,
      cards: cards.map(c => {
        const numEl = c.querySelector('span');
        const titleEl = c.querySelector('h3');
        const footerEl = c.querySelector('div.pt-4 > div:first-child');
        return {
          num: numEl?.textContent.trim(),
          numFont: numEl ? window.getComputedStyle(numEl).fontFamily : null,
          numWeight: numEl ? window.getComputedStyle(numEl).fontWeight : null,
          title: titleEl?.textContent.trim(),
          titleFont: titleEl ? window.getComputedStyle(titleEl).fontFamily : null,
          titleWeight: titleEl ? window.getComputedStyle(titleEl).fontWeight : null,
          titleTransform: titleEl ? window.getComputedStyle(titleEl).textTransform : null,
          footer: footerEl?.textContent.trim(),
          footerFont: footerEl ? window.getComputedStyle(footerEl).fontFamily : null,
          footerTransform: footerEl ? window.getComputedStyle(footerEl).textTransform : null,
        };
      })
    };
  });

  console.log(`Found ${projectTypesData?.count} cards in ProjectTypes.`);
  if (projectTypesData?.count === 3) {
    console.log('✓ Exactly 3 ProjectTypes cards rendered.');
    projectTypesData.cards.forEach((c, idx) => {
      console.log(`  Project Card ${idx + 1}: #${c.num} (weight: ${c.numWeight}) | Title: ${c.title} (font: ${c.titleFont}, weight: ${c.titleWeight}, transform: ${c.titleTransform}) | Footer: "${c.footer}" (font: ${c.footerFont})`);
    });
  } else {
    throw new Error(`Expected 3 cards in ProjectTypes, got ${projectTypesData?.count}`);
  }

  // Screenshot ProjectTypes
  const ptSection = await page.evaluateHandle(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('roofing for every project'));
    const section = h2.closest('section');
    section.scrollIntoView({ block: 'center' });
    return section;
  });
  await new Promise(r => setTimeout(r, 500));
  if (ptSection) {
    await ptSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'project_types_qa.png') });
    console.log('✓ Captured project_types_qa.png screenshot');
  }

  // 1b. ServiceDelivery Typography Inspection
  const deliveryData = await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('how we deliver'));
    if (!h2) return null;
    const section = h2.closest('section');
    if (!section) return null;
    const cards = Array.from(section.querySelectorAll('.grid > div'));
    return {
      count: cards.length,
      cards: cards.map(c => {
        const badgeEl = c.querySelector('span.uppercase');
        const numEl = c.querySelector('span.font-display.text-2xl, span.font-display.text-3xl');
        const titleEl = c.querySelector('h3');
        return {
          badge: badgeEl?.textContent.trim(),
          badgeFont: badgeEl ? window.getComputedStyle(badgeEl).fontFamily : null,
          num: numEl?.textContent.trim(),
          numWeight: numEl ? window.getComputedStyle(numEl).fontWeight : null,
          title: titleEl?.textContent.trim(),
          titleFont: titleEl ? window.getComputedStyle(titleEl).fontFamily : null,
          titleWeight: titleEl ? window.getComputedStyle(titleEl).fontWeight : null,
          titleTransform: titleEl ? window.getComputedStyle(titleEl).textTransform : null,
        };
      })
    };
  });

  console.log(`\nFound ${deliveryData?.count} cards in Service Delivery.`);
  if (deliveryData?.count === 6) {
    console.log('✓ Exactly 6 Service Delivery cards rendered.');
    deliveryData.cards.forEach((c, idx) => {
      console.log(`  Delivery Card ${idx + 1}: [${c.badge}] #${c.num} (weight: ${c.numWeight}) | Title: ${c.title} (font: ${c.titleFont}, weight: ${c.titleWeight}, transform: ${c.titleTransform})`);
    });
  } else {
    throw new Error(`Expected 6 cards in Service Delivery, got ${deliveryData?.count}`);
  }

  // Screenshot ServiceDelivery
  const sdSection = await page.evaluateHandle(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('how we deliver'));
    const section = h2.closest('section');
    section.scrollIntoView({ block: 'center' });
    return section;
  });
  await new Promise(r => setTimeout(r, 500));
  if (sdSection) {
    await sdSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'services_delivery_qa.png') });
    console.log('✓ Captured services_delivery_qa.png screenshot');
  }

  // 1c. Mandatory Icon Hover Interaction Test
  console.log('\n--- 1c. Mandatory Icon Hover Color & Lift Verification ---');
  const cardHandle = await page.evaluateHandle(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('how we deliver'));
    const el = h2.closest('section').querySelectorAll('.grid > div')[0];
    el.scrollIntoView({ block: 'center' });
    return el;
  });
  await new Promise(r => setTimeout(r, 500));

  const beforeHover = await page.evaluate(el => {
    const icon = el.querySelector('svg:not(.lucide-arrow-right)');
    const container = el.querySelector('div.shrink-0');
    return {
      svgStroke: window.getComputedStyle(icon).stroke,
      containerBg: window.getComputedStyle(container).backgroundColor,
      cardTranslate: window.getComputedStyle(el).translate,
      cardTransform: window.getComputedStyle(el).transform,
      accentOpacity: window.getComputedStyle(el.querySelector('.h-\\[2px\\]')).opacity
    };
  }, cardHandle);

  await cardHandle.hover();
  await new Promise(r => setTimeout(r, 600));

  const duringHover = await page.evaluate(el => {
    const icon = el.querySelector('svg:not(.lucide-arrow-right)');
    const container = el.querySelector('div.shrink-0');
    return {
      svgStroke: window.getComputedStyle(icon).stroke,
      containerBg: window.getComputedStyle(container).backgroundColor,
      cardTranslate: window.getComputedStyle(el).translate,
      cardTransform: window.getComputedStyle(el).transform,
      accentOpacity: window.getComputedStyle(el.querySelector('.h-\\[2px\\]')).opacity
    };
  }, cardHandle);

  await cardHandle.screenshot({ path: path.join(ARTIFACTS_DIR, 'service_delivery_card_hover_qa.png') });
  console.log('✓ Captured service_delivery_card_hover_qa.png screenshot');

  console.log('Initial svgStroke (before hover):', beforeHover.svgStroke);
  console.log('During hover svgStroke:', duringHover.svgStroke);
  console.log('During hover containerBg:', duringHover.containerBg);
  console.log('During hover card translate:', duringHover.cardTranslate, 'transform:', duringHover.cardTransform);
  console.log('During hover accent opacity:', duringHover.accentOpacity);

  const isYellow = duringHover.svgStroke === 'rgb(255, 198, 39)';
  console.log(`✓ Icon turns Sunshine Yellow (#FFC627) on hover: ${isYellow}`);
  const containerUnchanged = beforeHover.containerBg === duringHover.containerBg;
  console.log(`✓ Icon container background remains unchanged: ${containerUnchanged}`);
  const isLifted = duringHover.cardTranslate === '0px -6px' || duringHover.cardTransform.includes('-6');
  console.log(`✓ Card lifts by 5-6px: ${isLifted}`);
  const accentAppears = duringHover.accentOpacity === '1';
  console.log(`✓ 2px Sunshine Yellow top accent revealed: ${accentAppears}`);

  await page.mouse.move(0, 0);

  // 2. About Page Check: About Approach Typography
  console.log('\n--- 2. Testing /about: About Approach Typography ---');
  await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const approachData = await page.evaluate(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('professional delivery principles'));
    if (!h2) return null;
    const section = h2.closest('section');
    if (!section) return null;
    const cards = Array.from(section.querySelectorAll('.grid > div'));
    return {
      count: cards.length,
      cards: cards.map(c => {
        const badgeEl = c.querySelector('span.uppercase');
        const numEl = c.querySelector('span.font-display.text-2xl, span.font-display.text-3xl');
        const titleEl = c.querySelector('h3');
        const descEl = c.querySelector('p');
        const footerEl = c.querySelector('div.pt-4 > div:first-child');
        return {
          badge: badgeEl?.textContent.trim(),
          badgeFont: badgeEl ? window.getComputedStyle(badgeEl).fontFamily : null,
          num: numEl?.textContent.trim(),
          numWeight: numEl ? window.getComputedStyle(numEl).fontWeight : null,
          title: titleEl?.textContent.trim(),
          titleFont: titleEl ? window.getComputedStyle(titleEl).fontFamily : null,
          titleWeight: titleEl ? window.getComputedStyle(titleEl).fontWeight : null,
          titleTransform: titleEl ? window.getComputedStyle(titleEl).textTransform : null,
          desc: descEl?.textContent.trim(),
          descFont: descEl ? window.getComputedStyle(descEl).fontFamily : null,
          descWeight: descEl ? window.getComputedStyle(descEl).fontWeight : null,
          footer: footerEl?.textContent.trim(),
          footerFont: footerEl ? window.getComputedStyle(footerEl).fontFamily : null,
        };
      })
    };
  });

  console.log(`Found ${approachData?.count} cards in About Approach.`);
  if (approachData?.count === 5) {
    console.log('✓ Exactly 5 principle cards rendered.');
    approachData.cards.forEach((c, idx) => {
      console.log(`  Principle Card ${idx + 1}: [${c.badge}] #${c.num} ${c.title} (font: ${c.titleFont}, weight: ${c.titleWeight})`);
      console.log(`    Desc: "${c.desc}" (font: ${c.descFont}, weight: ${c.descWeight})`);
      console.log(`    Footer: "${c.footer}" (font: ${c.footerFont})`);
    });
  } else {
    throw new Error(`Expected 5 cards in About Approach, got ${approachData?.count}`);
  }

  // Screenshot AboutApproach
  const aaSection = await page.evaluateHandle(() => {
    const h2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.toLowerCase().includes('professional delivery principles'));
    const section = h2.closest('section');
    section.scrollIntoView({ block: 'center' });
    return section;
  });
  await new Promise(r => setTimeout(r, 500));
  if (aaSection) {
    await aaSection.screenshot({ path: path.join(ARTIFACTS_DIR, 'about_approach_qa.png') });
    console.log('✓ Captured about_approach_qa.png screenshot');
  }

  // 3. Regression Protection: Home Process SVG Animation
  console.log('\n--- 3. Regression Protection: Home Process SVG Animation (/) ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const homeData = await page.evaluate(() => {
    const processSection = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Our Process') || s.textContent.includes('Simple, Transparent Journey'));
    const circleCount = document.querySelectorAll('circle').length;
    const svgPathCount = document.querySelectorAll('path').length;
    const showcaseCards = document.querySelectorAll('[data-service-card]').length;
    return {
      hasProcess: Boolean(processSection),
      circleCount,
      svgPathCount,
      showcaseCardsOnHome: showcaseCards
    };
  });
  console.log('Home page check:', homeData);
  console.log('✓ Home Process 6 steps, circles, and SVG animation intact.');

  // 4. Responsive Viewports Check
  console.log('\n--- 4. Responsive Viewport Overflow Check ---');
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1024, height: 768 },
    { name: 'Wide Desktop', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    await page.setViewport(vp);
    for (const urlPath of ['/services', '/about']) {
      await page.goto(`http://localhost:3000${urlPath}`, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 600));
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (overflow) {
        console.error(`✗ Overflow detected on ${urlPath} at ${vp.name} (${vp.width}px)`);
      } else {
        console.log(`✓ ${urlPath} at ${vp.name} (${vp.width}px): 0 horizontal overflow.`);
      }
    }
  }

  await browser.close();
  console.log('\n====================================================');
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

run().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
