const { chromium } = require('playwright');

const seeds = [26, 27, 28, 29, 30, 31, 32, 33, 34, 35];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://exam.sanand.workers.dev/tds2025t1/datadash?seed=${seed}`;
    console.log(`\nScraping seed ${seed}: ${url}`);

    await page.goto(url, { waitUntil: 'networkidle' });

    // Get all numbers from all tables
    const numbers = await page.$$eval('table td, table th', cells => {
      const nums = [];
      for (const cell of cells) {
        const text = cell.innerText.trim();
        const num = parseFloat(text.replace(/,/g, ''));
        if (!isNaN(num)) {
          nums.push(num);
        }
      }
      return nums;
    });

    const seedTotal = numbers.reduce((sum, n) => sum + n, 0);
    console.log(`Seed ${seed}: found ${numbers.length} numbers, sum = ${seedTotal}`);
    grandTotal += seedTotal;
  }

  await browser.close();

  console.log(`\n=============================`);
  console.log(`GRAND TOTAL: ${grandTotal}`);
  console.log(`=============================`);
})();
