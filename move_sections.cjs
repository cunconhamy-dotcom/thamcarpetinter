const fs = require('fs')

let code = fs.readFileSync('src/PublicApp.tsx', 'utf-8')

// 1. Move News Section
const newsStart = code.indexOf('{/* ── NEWS SECTION ── */}')
const newsEnd = code.indexOf('{/* ── PRODUCTS GRID & CATALOGUE ── */}')
const newsBlock = code.substring(newsStart, newsEnd)

code = code.substring(0, newsStart) + code.substring(newsEnd)

const footerStart = code.indexOf('{/* ── CONTACT & FOOTER (High Contrast Charcoal Black) ── */}')
code = code.substring(0, footerStart) + newsBlock + code.substring(footerStart)


// 2. Move "Trang chi tiết từng collection"
const detailMarker = '{/* Collections list page detail link */}'
const detailStart = code.indexOf(detailMarker)
// It ends with a div and the section end
const endRegex = /<\/div>\s*<\/div>\s*<\/section>/
const match = code.substring(detailStart).match(endRegex)

if (match) {
  // match[0] is "</div>\n\n        </div>\n      </section>"
  // The first "</div>" belongs to the detail component.
  const dEnd = detailStart + match.index + 6 // Include the first </div>
  const detailBlock = code.substring(detailStart, dEnd)
  
  // Remove detailBlock from the gallery section
  code = code.substring(0, detailStart) + code.substring(dEnd)
  
  // Insert below hero
  const heroEnd = code.indexOf('{/* ── COLLECTIONS SHOWCASE ── */}')
  const wrapper = `\n      {/* ── CHI TIẾT TỪNG COLLECTION ── */}\n      <section className="w-full bg-[#1a1a1a] py-16 border-b border-white/5">\n        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\n          ${detailBlock}\n        </div>\n      </section>\n\n`
  
  code = code.substring(0, heroEnd) + wrapper + code.substring(heroEnd)
}

fs.writeFileSync('src/PublicApp.tsx', code)
console.log('Done moving sections.')
