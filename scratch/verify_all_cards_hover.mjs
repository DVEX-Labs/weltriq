import puppeteer from "puppeteer";
import path from "path";

async function verifyAllCardsHover() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const targetDir = "C:\\Users\\salah\\.gemini\\antigravity-ide\\brain\\5f2174ec-addf-4e51-9d5c-49cc8c0950ea";

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // 1. Services Page - Project Types & Service Delivery
    console.log("Navigating to http://localhost:3000/services...");
    await page.goto("http://localhost:3000/services", { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Find cards in the Project Types section
    const projectCards = await page.$$("div.group.relative.bg-neutral-50\\/90");
    if (projectCards.length > 0) {
      console.log("Hovering over Project Types card 1...");
      await projectCards[0].hover();
      await new Promise((r) => setTimeout(r, 600));
      await projectCards[0].screenshot({ path: path.join(targetDir, "project_types_card_hover.png") });
      console.log("Saved project_types_card_hover.png");

      if (projectCards.length > 3) {
        console.log("Hovering over Service Delivery card...");
        await projectCards[3].hover();
        await new Promise((r) => setTimeout(r, 600));
        await projectCards[3].screenshot({ path: path.join(targetDir, "service_delivery_card_hover.png") });
        console.log("Saved service_delivery_card_hover.png");
      }
    }

    // 2. About Page - Our Approach
    console.log("Navigating to http://localhost:3000/about...");
    await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2000));

    const aboutCards = await page.$$("div.group.relative.bg-neutral-50\\/90");
    if (aboutCards.length > 0) {
      console.log("Hovering over About Approach card 1...");
      await aboutCards[0].hover();
      await new Promise((r) => setTimeout(r, 600));
      await aboutCards[0].screenshot({ path: path.join(targetDir, "about_approach_card_hover.png") });
      console.log("Saved about_approach_card_hover.png");
    }

    // 3. Contact Page - Direct Info
    console.log("Navigating to http://localhost:3000/contact...");
    await page.goto("http://localhost:3000/contact", { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2000));

    const contactCards = await page.$$("div.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 > div.group");
    if (contactCards.length > 1) {
      console.log("Hovering over Contact Phone card...");
      await contactCards[1].hover();
      await new Promise((r) => setTimeout(r, 600));
      await contactCards[1].screenshot({ path: path.join(targetDir, "contact_card_hover.png") });
      console.log("Saved contact_card_hover.png");
    }

    console.log("All screenshots captured successfully!");
  } catch (err) {
    console.error("Error during verification:", err);
  } finally {
    await browser.close();
  }
}

verifyAllCardsHover();
