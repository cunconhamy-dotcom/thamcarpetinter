import fetch from 'node-fetch';

const candidates = {
  FL02: [
    'https://carpetsinter.com/wp-content/uploads/2022/09/FL02MUCUSSO-1.jpg'
  ],
  FL36: [
    'https://carpetsinter.com/wp-content/uploads/2022/09/FL36NarivareplaceFL16NM016-2150x50cm-3.jpg'
  ],
  DV300: [
    'https://carpetsinter.com/wp-content/uploads/2022/08/CANYON-DV-300.jpg',
    'https://carpetsinter.com/wp-content/uploads/2022/08/CANYON-DV300.jpg',
    'https://carpetsinter.com/wp-content/uploads/2022/09/CANYON-DV-300.jpg',
    'https://carpetsinter.com/wp-content/uploads/2022/09/CANYON-DV300.jpg',
    'https://carpetsinter.com/wp-content/uploads/2023/04/DV300-DV201.jpg',
    'https://carpetsinter.com/wp-content/uploads/2022/08/CANYON-DV-300-768x526.jpg',
  ],
  DV900: [
    'https://carpetsinter.com/wp-content/uploads/2022/08/WATERFALL-DV-900.jpg',
    'https://carpetsinter.com/wp-content/uploads/2022/08/WATERFALL-DV900.jpg',
    'https://carpetsinter.com/wp-content/uploads/2022/09/WATERFALL-DV-900.jpg',
    'https://carpetsinter.com/wp-content/uploads/2022/09/WATERFALL-DV900.jpg'
  ]
};

async function testUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      timeout: 3000
    });
    return res.status === 200 && res.headers.get('content-type')?.startsWith('image/');
  } catch (e) {
    return false;
  }
}

async function run() {
  console.log('Probing pattern candidates...');
  for (const [code, urls] of Object.entries(candidates)) {
    console.log(`\nProbing candidates for ${code}:`);
    let found = false;
    for (const url of urls) {
      const ok = await testUrl(url);
      if (ok) {
        console.log(`  🔥 FOUND WORKING URL: ${url}`);
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`  ⚠️ No candidate URLs worked for ${code}.`);
    }
  }
}

run();
