import puppeteer from "puppeteer";
import path from "path";

async function captureAboutApproach() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const targetDir = "C:\\Users\\salah\\.gemini\\antigravity-ide\\brain\\5f2174ec-addf-4e51-9d5c-49cc8c0950ea";

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    console.log("Navigating to http://localhost:3000/about...");
    await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1500));

    const section = await page.evaluateHandle(() => {
      const headings = Array.from(document.querySelectorAll("h2"));
      const target = headings.find((h) => h.textContent.includes("Built On Professional Delivery Principles"));
      return target ? target.closest("section") : null;
    });

    if (section && section.asElement()) {
      const el = section.asElement();
      await el.evaluate((s) => s.scrollIntoView({ block: "start" }));
      await new Promise((r) => setTimeout(r, 1200));

      await el.screenshot({ path: path.join(targetDir, "about_approach_editorial_desktop.png") });
      console.log("Saved about_approach_editorial_desktop.png");
    }

    console.log("Done!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
}

captureAboutApproach();
