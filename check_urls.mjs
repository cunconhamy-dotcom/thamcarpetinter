import fetch from 'node-fetch'

const urls = [
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV100CAVE..jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV102..jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV103..jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV104..jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV200MOUNTAIN..jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV201..jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV202..jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV204..jpg',
  'https://carpetsinter.com/wp-content/uploads/2023/04/DV300-DV201.jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/08/WATERFALL-DV-900.jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV300..jpg',
  'https://carpetsinter.com/wp-content/uploads/2022/09/DV900..jpg'
]

async function run() {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' })
      console.log(`[${res.status}] ${url}`)
    } catch (e) {
      console.log(`[ERROR] ${url} - ${e.message}`)
    }
  }
}

run()
