import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to lightning zone (approx 500px down)
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 600));

  const artifactPath = 'C:/Users/salah/.gemini/antigravity-ide/brain/5f2174ec-addf-4e51-9d5c-49cc8c0950ea/hero_lightning_live_preview.png';
  await page.screenshot({ path: artifactPath });
  console.log('Saved screenshot to:', artifactPath);

  await browser.close();
})();
