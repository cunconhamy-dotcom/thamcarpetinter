import fetch from 'node-fetch';

async function test(url) {
  console.log('Fetching', url);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    console.log('Status:', res.status, 'Content-Type:', res.headers.get('content-type'));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

async function run() {
  await test('https://carpetsinter.com/wp-content/uploads/2022/09/DV102..jpg');
  await test('https://carpetsinter.com/wp-content/uploads/2022/09/DV300..jpg');
}

run();
