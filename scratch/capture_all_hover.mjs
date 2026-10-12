import puppeteer from "puppeteer";
import path from "path";

async function captureHoverScreenshots() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const targetDir = "C:\\Users\\salah\\.gemini\\antigravity-ide\\brain\\5f2174ec-addf-4e51-9d5c-49cc8c0950ea";

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // 1. About Page - Our Approach
    console.log("Navigating to http://localhost:3000/about...");
    await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    const aboutCard = await page.$("div.group.relative.bg-neutral-50\\/90");
    if (aboutCard) {
      await page.evaluate((el) => el.scrollIntoView({ block: "center" }), aboutCard);
      await new Promise((r) => setTimeout(r, 500));
      const box = await aboutCard.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await new Promise((r) => setTimeout(r, 600));
        await aboutCard.screenshot({ path: path.join(targetDir, "about_approach_card_hover.png") });
        console.log("Captured about_approach_card_hover.png");
      }
    }

    // 2. Contact Page - Direct Info
    console.log("Navigating to http://localhost:3000/contact...");
    await page.goto("http://localhost:3000/contact", { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    const contactCard = (await page.$$("div.rounded-xl.border.bg-white.group"))[1];
    if (contactCard) {
      await page.evaluate((el) => el.scrollIntoView({ block: "center" }), contactCard);
      await new Promise((r) => setTimeout(r, 500));
      const box = await contactCard.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await new Promise((r) => setTimeout(r, 600));
        await contactCard.screenshot({ path: path.join(targetDir, "contact_card_hover.png") });
        console.log("Captured contact_card_hover.png");
      }
    }

    // 3. Services Page - Project Types
    console.log("Navigating to http://localhost:3000/services...");
    await page.goto("http://localhost:3000/services", { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    const projectCard = await page.$("div.group.relative.bg-neutral-50\\/90");
    if (projectCard) {
      await page.evaluate((el) => el.scrollIntoView({ block: "center" }), projectCard);
      await new Promise((r) => setTimeout(r, 500));
      const box = await projectCard.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await new Promise((r) => setTimeout(r, 600));
        await projectCard.screenshot({ path: path.join(targetDir, "project_types_card_hover.png") });
        console.log("Captured project_types_card_hover.png");
      }
    }

    console.log("Done all captures!");
  } catch (err) {
    console.error("Capture error:", err);
  } finally {
    await browser.close();
  }
}

captureHoverScreenshots();
