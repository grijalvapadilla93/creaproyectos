import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: 'new',
  args: ['--no-sandbox'],
});

// Stats band lives inside the page between #about and #services — select it by aria-label.
const shots = [
  { name: 'stats-desktop', w: 1440, h: 900 },
  { name: 'stats-mobile', w: 390, h: 844 },
];

for (const s of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4200)); // preloader
  const el = await page.$('section[aria-label="Cifras de la empresa"]');
  if (el) {
    await el.scrollIntoView();
    await new Promise((r) => setTimeout(r, 1800)); // let counters + hairlines animate in
    await el.screenshot({ path: `shots/${s.name}.png` });
  } else {
    console.log('stats section not found');
  }
  await page.close();
  console.log(`done ${s.name}`);
}

await browser.close();
