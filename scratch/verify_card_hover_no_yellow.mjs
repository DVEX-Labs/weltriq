import puppeteer from "puppeteer";
import path from "path";

async function verifyCardHover() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log("Navigating to http://localhost:3000/blog...");
    await page.goto("http://localhost:3000/blog", { waitUntil: "domcontentloaded", timeout: 60000 });

    const cardSelector = "article";
    await page.waitForSelector(cardSelector, { timeout: 30000 });

    // Wait a brief moment for styles/images to settle
    await new Promise((r) => setTimeout(r, 2000));

    // Hover over the first card
    console.log("Hovering over first blog card...");
    await page.hover(cardSelector);
    await new Promise((r) => setTimeout(r, 600));

    // Evaluate colors on hover
    const hoverStyles = await page.evaluate(() => {
      const card = document.querySelector("article");
      const title = card.querySelector("h3");
      const arrow = card.querySelector("svg");
      const topAccent = card.querySelector(".bg-brand-yellow");

      return {
        titleColor: window.getComputedStyle(title).color,
        arrowColor: arrow ? window.getComputedStyle(arrow).color : null,
        hasTopAccentLine: !!topAccent,
      };
    });

    console.log("Computed hover styles:", hoverStyles);

    // Capture screenshot of hover state
    const targetDir = "C:\\Users\\salah\\.gemini\\antigravity-ide\\brain\\5f2174ec-addf-4e51-9d5c-49cc8c0950ea";
    const cardElement = await page.$(cardSelector);
    await cardElement.screenshot({ path: path.join(targetDir, "blog_card_hover_no_yellow.png") });
    console.log("Saved card screenshot to artifact directory");

    await page.screenshot({ path: path.join(targetDir, "blog_cards_grid_hover.png") });
    console.log("Saved full page screenshot to artifact directory");

  } catch (err) {
    console.error("Error during hover verification:", err);
  } finally {
    await browser.close();
  }
}

verifyCardHover();
