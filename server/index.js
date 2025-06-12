const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());
const TMP = path.join(__dirname, 'temp');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP);

app.post('/run', async (req, res) => {
  const code = req.body.code;
  const id = uuidv4();
  const file = path.join(TMP, `${id}.html`);
  fs.writeFileSync(file, code);

  // Puppeteerで実行 & スクリーンショット取得
  const browser = await puppeteer.launch({
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(`file://${file}`, { waitUntil: 'load' });
  const img = await page.screenshot({ encoding: 'base64', fullPage: true });
  await browser.close();

  res.json({ img: `data:image/png;base64,${img}` });
});
app.listen(3000, () => console.log('Ready'));
