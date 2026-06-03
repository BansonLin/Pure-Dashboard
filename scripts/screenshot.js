/* eslint-disable */
// Screenshot driver — runs headless Chromium against the dev server.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 812 };

/** @type {Array<{slug:string,url:string}>} */
const PAGES = [
  { slug: "01-home", url: "/" },
  { slug: "02-finance", url: "/finance" },
  { slug: "03-people", url: "/people" },
  { slug: "04-risk", url: "/risk" },
  { slug: "05-bu-xinyi", url: "/bu/design-xinyi" },
  { slug: "06-bu-pure-house", url: "/bu/pure-house" },
];

async function shoot(browser, viewport, theme, slug, url) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("[browser console error]", msg.text());
  });
  page.on("pageerror", (e) => console.error("[pageerror]", e.message));

  // Pre-set the theme cookie/localStorage for next-themes
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);

  const fullUrl = `http://localhost:3000${url}`;
  await page.goto(fullUrl, { waitUntil: "networkidle", timeout: 30000 });
  // wait for charts / hydration
  await page.waitForTimeout(800);

  const sizeTag = viewport.width === 1440 ? "desktop" : "mobile";
  const themeTag = theme === "dark" ? "-dark" : "";
  const filename = `${slug}-${sizeTag}${themeTag}.png`;
  const filepath = path.join(OUT, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`✔ ${filename}`);
  await context.close();
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  // Desktop light
  for (const p of PAGES) await shoot(browser, DESKTOP, "light", p.slug, p.url);
  // Mobile light
  for (const p of PAGES) await shoot(browser, MOBILE, "light", p.slug, p.url);
  // Dark mode — just home page
  await shoot(browser, DESKTOP, "dark", "01-home", "/");

  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
