import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: 'new',
  args: ['--no-sandbox'],
});

const shots = [
  { name: 'hero-desktop', w: 1440, h: 900, sel: '#hero' },
  { name: 'process-desktop', w: 1440, h: 900, sel: '#process', extra: 320 },
  { name: 'sectors-desktop', w: 1440, h: 900, sel: '#services' },
  { name: 'hero-mobile', w: 390, h: 844, sel: '#hero' },
  { name: 'process-mobile', w: 390, h: 844, sel: '#process', extra: 300 },
  { name: 'services-mobile', w: 390, h: 844, sel: '#services' },
  { name: 'contact-mobile', w: 390, h: 844, sel: '#contact' },
  { name: 'process-tablet', w: 768, h: 1024, sel: '#process', extra: 300 },
  { name: 'about-tablet', w: 768, h: 1024, sel: '#about' },
  { name: 'fullpage-mobile', w: 390, h: 844, full: true },
];

for (const s of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 });
  // wait out the preloader + hero choreography
  await new Promise((r) => setTimeout(r, 4200));
  if (s.full) {
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `shots/${s.name}.png`, fullPage: true });
  } else {
    const el = await page.$(s.sel);
    if (el) {
      await el.scrollIntoView();
      await new Promise((r) => setTimeout(r, 900));
      if (s.extra) {
        await page.evaluate((dy) => window.scrollBy(0, dy), s.extra);
        await new Promise((r) => setTimeout(r, 1200));
      }
      await el.screenshot({ path: `shots/${s.name}.png` });
    } else {
      console.log(`selector ${s.sel} not found`);
    }
  }
  await page.close();
  console.log(`done ${s.name}`);
}

await browser.close();
