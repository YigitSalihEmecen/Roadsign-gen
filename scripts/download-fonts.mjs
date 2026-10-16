import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const fontsDir = path.resolve('public/fonts');
fs.mkdirSync(fontsDir, { recursive: true });

const fonts = [
  {
    name: 'HWYGOTH.woff2',
    url: 'https://raw.githubusercontent.com/gregfleury/highwaygothic/master/HWYGOTH.woff2',
  },
  {
    name: 'HWYGCOND.woff2',
    url: 'https://raw.githubusercontent.com/gregfleury/highwaygothic/master/HWYGCOND.woff2',
  },
  {
    name: 'HWYGEXPD.woff2',
    url: 'https://raw.githubusercontent.com/gregfleury/highwaygothic/master/HWYGEXPD.woff2',
  },
  {
    name: 'HWYGNRRW.woff2',
    url: 'https://raw.githubusercontent.com/gregfleury/highwaygothic/master/HWYGNRRW.woff2',
  },
  {
    name: 'HWYGWDE.woff2',
    url: 'https://raw.githubusercontent.com/gregfleury/highwaygothic/master/HWYGWDE.woff2',
  },
  {
    name: 'D-DIN.woff2',
    url: 'https://raw.githubusercontent.com/amcchord/datto-d-din/main/D-DIN.woff2',
  },
  {
    name: 'D-DIN-Bold.woff2',
    url: 'https://raw.githubusercontent.com/amcchord/datto-d-din/main/D-DIN-Bold.woff2',
  },
  {
    name: 'D-DINCondensed-Bold.woff2',
    url: 'https://raw.githubusercontent.com/amcchord/datto-d-din/main/D-DINCondensed-Bold.woff2',
  },
  {
    name: 'D-DINExp-Bold.woff2',
    url: 'https://raw.githubusercontent.com/amcchord/datto-d-din/main/D-DINExp-Bold.woff2',
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    req.on('error', reject);
  });
}

for (const f of fonts) {
  const target = path.join(fontsDir, f.name);
  try {
    await download(f.url, target);
    console.log(`Downloaded ${f.name}`);
  } catch (err) {
    console.warn(`Could not download ${f.name}:`, err.message);
  }
}
