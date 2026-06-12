const fs = require('fs')

const file = fs.readFileSync('src/PublicApp.tsx', 'utf-8')

// We will use regex to find sections.
// Hero Section: from {/* ── HERO SECTION ── */} up to {/* ── COLLECTIONS SHOWCASE ── */}
// Collections Showcase: from {/* ── COLLECTIONS SHOWCASE ── */} up to {/* ── NEWS SECTION ── */}
// News Section: from {/* ── NEWS SECTION ── */} up to {/* ── PRODUCTS GRID & CATALOGUE ── */}
// Products Grid: from {/* ── PRODUCTS GRID & CATALOGUE ── */} up to {/* ── BROCHURES & DOCUMENTS ── */}
// Brochures: from {/* ── BROCHURES & DOCUMENTS ── */} up to {/* ── GALLERY & ALL IMAGES ── */}
// Gallery: from {/* ── GALLERY & ALL IMAGES ── */} up to {/* ── PORTFOLIO RESOURCES ── */}
// Portfolio Resources: from {/* ── PORTFOLIO RESOURCES ── */} up to {/* ── CONTACT & FOOTER (High Contrast Charcoal Black) ── */}
// Footer: from {/* ── CONTACT & FOOTER (High Contrast Charcoal Black) ── */} up to end of component.

const getSection = (startMarker, endMarker) => {
  const start = file.indexOf(startMarker)
  if (start === -1) throw new Error("Start marker not found: " + startMarker)
  if (endMarker) {
    const end = file.indexOf(endMarker)
    if (end === -1) throw new Error("End marker not found: " + endMarker)
    return file.substring(start, end)
  }
  return file.substring(start)
}

const beforeHero = file.substring(0, file.indexOf('{/* ── HERO SECTION ── */}'))
const hero = getSection('{/* ── HERO SECTION ── */}', '{/* ── COLLECTIONS SHOWCASE ── */}')
const showcase = getSection('{/* ── COLLECTIONS SHOWCASE ── */}', '{/* ── NEWS SECTION ── */}')
const news = getSection('{/* ── NEWS SECTION ── */}', '{/* ── PRODUCTS GRID & CATALOGUE ── */}')
const products = getSection('{/* ── PRODUCTS GRID & CATALOGUE ── */}', '{/* ── BROCHURES & DOCUMENTS ── */}')
const brochures = getSection('{/* ── BROCHURES & DOCUMENTS ── */}', '{/* ── GALLERY & ALL IMAGES ── */}')
const galleryRaw = getSection('{/* ── GALLERY & ALL IMAGES ── */}', '{/* ── PORTFOLIO RESOURCES ── */}')
const portfolio = getSection('{/* ── PORTFOLIO RESOURCES ── */}', '{/* ── CONTACT & FOOTER (High Contrast Charcoal Black) ── */}')
const footerAndRest = getSection('{/* ── CONTACT & FOOTER (High Contrast Charcoal Black) ── */}')

// The gallery section contains the "Trang chi tiết từng collection". Let's extract it.
const detailCardsStart = galleryRaw.indexOf('{/* Collections list page detail link */}')
const detailCardsEnd = galleryRaw.lastIndexOf('</div>\n          </div>') + 23 // Include the closing div

if (detailCardsStart === -1 || detailCardsEnd < 23) throw new Error("Detail cards not found in gallery")

const detailCardsContent = galleryRaw.substring(detailCardsStart, detailCardsEnd).trim()
const galleryContent = galleryRaw.substring(0, detailCardsStart) + '\n        </div>\n      </section>\n\n'

// Create new section for detailCardsContent
const detailCardsSection = `
      {/* ── CHI TIẾT TỪNG COLLECTION ── */}
      <section className="w-full bg-[#1a1a1a] py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          ${detailCardsContent}
        </div>
      </section>

`

// Reassemble
const newFile = beforeHero + 
  hero + 
  detailCardsSection + 
  showcase + 
  products + 
  brochures + 
  galleryContent + 
  portfolio + 
  news + 
  footerAndRest

fs.writeFileSync('src/PublicApp.tsx', newFile)
console.log('Reordered PublicApp.tsx successfully!')
