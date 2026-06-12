import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixDatabase() {
  // 1. Login as admin
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@carpetsinter.vn',
    password: 'admin123'
  });
  if (authError) { console.error('Login failed:', authError); return; }
  console.log('Logged in as:', authData.user.email);

  // 2. Fix ebb-retreat: hero_image is missing
  console.log('\n--- Fixing ebb-retreat hero_image ---');
  const ebbHeroImage = 'https://carpetsinter.com/wp-content/uploads/2023/06/EBR04-42-Herringbone-roomscene-1.jpg';
  const { error: ebbErr } = await supabase.from('collections').update({ hero_image: ebbHeroImage }).eq('slug', 'ebb-retreat');
  if (ebbErr) console.error('Error:', ebbErr);
  else console.log('✅ ebb-retreat hero_image fixed');

  // 3. Fix aspekt-vue: remove duplicate products (AKV04, AKV05, AKV06 are duplicated)
  console.log('\n--- Fixing aspekt-vue duplicate products ---');
  const { data: vueData } = await supabase.from('collections').select('metadata').eq('slug', 'aspekt-vue').single();
  if (vueData) {
    const meta = vueData.metadata;
    // Deduplicate by product code
    const seen = new Set();
    const uniqueProducts = meta.products.filter(p => {
      if (seen.has(p.code)) return false;
      seen.add(p.code);
      return true;
    });
    console.log(`Found ${meta.products.length} products, deduped to ${uniqueProducts.length}`);
    const { error: vueErr } = await supabase.from('collections').update({
      metadata: { ...meta, products: uniqueProducts }
    }).eq('slug', 'aspekt-vue');
    if (vueErr) console.error('Error:', vueErr);
    else console.log('✅ aspekt-vue duplicates removed');
  }

  // 4. Add/update Upstream collection with full metadata
  console.log('\n--- Adding Upstream collection data ---');
  const upstreamData = {
    name: 'Upstream',
    slug: 'upstream',
    tagline: 'EBB & Flow — Hành trình ngược dòng tạo nên sức sống không gian.',
    summary: 'Upstream là bộ sưu tập lấy cảm hứng từ sự chuyển động của nước — linh hoạt, bền bỉ và luôn tìm kiếm con đường tiến về phía trước.',
    detail: 'Thiết kế Upstream phản chiếu tinh thần vận động không ngừng, mang ngôn ngữ bề mặt động và giàu cảm xúc. Thích hợp cho không gian khuyến khích sự sáng tạo, nơi mà mỗi bước chân đều cảm nhận được sức sống từ mặt sàn.',
    hero_image: 'https://carpetsinter.com/wp-content/uploads/2026/04/EB02-EB04-EB05-768x600.jpg',
    accent: '#4a9b8e',
    quick_facts: ['Thiết kế lấy cảm hứng từ dòng chảy nước', 'Bề mặt giàu chuyển động thị giác', 'Phù hợp không gian sáng tạo và năng động'],
    value_points: [
      'Tạo không gian tràn đầy sức sống và năng lượng tích cực.',
      'Bề mặt độc đáo, tạo điểm nhấn thẩm mỹ rõ ràng cho công trình.',
      'Giúp phân vùng không gian tự nhiên bằng ngôn ngữ thị giác.'
    ],
    applications: ['Creative workspace', 'Hospitality lounge', 'Boutique hotel', 'Khu vực tiếp khách năng động'],
    status: 'published',
    metadata: {
      products: [
        {
          code: 'EB01',
          name: 'Current',
          highlights: ['Bề mặt gợi chuyển động linh hoạt', 'Tạo nhịp điệu thị giác mạnh mẽ'],
          colors: ['Xanh teal', 'Xám trung tính'],
          image: 'https://carpetsinter.com/wp-content/uploads/2023/06/EB01-6.jpg',
          spec: {
            pile: 'Cut and loop pile',
            construction: 'Tufted textured / carpet tile thương mại',
            backing: 'EcoSoft backing – tái chế PET',
            size: '50 x 50 cm',
            useCase: 'Creative studio / lounge area',
            installation: 'Quarter turn / ashlar pattern'
          }
        },
        {
          code: 'EB02',
          name: 'Flow',
          highlights: ['Cảm giác trôi chảy nhẹ nhàng', 'Phối hợp tốt trong không gian mở'],
          colors: ['Xanh nước biển nhạt', 'Xanh lá nhạt'],
          image: 'https://carpetsinter.com/wp-content/uploads/2023/06/EB02-6.jpg',
          spec: {
            pile: 'Low cut pile',
            construction: 'Tufted structured loop / carpet tile thương mại',
            backing: 'EcoSoft backing – tái chế PET',
            size: '50 x 50 cm',
            useCase: 'Open plan / collaboration zone',
            installation: 'Ashlar / quarter turn'
          }
        },
        {
          code: 'EB03',
          name: 'Tide',
          highlights: ['Nhịp điệu tự nhiên của sóng', 'Tạo chiều sâu không gian rõ nét'],
          colors: ['Teal đậm', 'Xám xanh'],
          image: 'https://carpetsinter.com/wp-content/uploads/2023/06/EB03-6.jpg',
          spec: {
            pile: 'Textured loop',
            construction: 'Tufted directional / carpet tile thương mại',
            backing: 'EcoSoft backing – tái chế PET',
            size: '50 x 50 cm',
            useCase: 'Transition zone / feature flooring',
            installation: 'Directional / quarter turn'
          }
        },
        {
          code: 'EB04',
          name: 'Wave',
          highlights: ['Bề mặt sóng nước tinh tế', 'Thể hiện sự chuyển động mềm mại'],
          colors: ['Xanh lam', 'Xanh rêu nhạt'],
          image: 'https://carpetsinter.com/wp-content/uploads/2023/06/EB04-6.jpg',
          spec: {
            pile: 'Multi-level loop',
            construction: 'Tufted wave pattern / carpet tile thương mại',
            backing: 'EcoSoft backing – tái chế PET',
            size: '50 x 50 cm',
            useCase: 'Hospitality / boutique hotel',
            installation: 'Ashlar / monolithic'
          }
        },
        {
          code: 'EB05',
          name: 'Stream',
          highlights: ['Hơi thở của dòng chảy', 'Phù hợp không gian cần sự tươi mới'],
          colors: ['Xanh mint', 'Trắng xám'],
          image: 'https://carpetsinter.com/wp-content/uploads/2023/06/EB05-6.jpg',
          spec: {
            pile: 'Fine loop texture',
            construction: 'Tufted fine loop / carpet tile thương mại',
            backing: 'EcoSoft backing – tái chế PET',
            size: '50 x 50 cm',
            useCase: 'Reception / showroom / spa lobby',
            installation: 'Quarter turn / ashlar'
          }
        }
      ],
      gallery: [
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB01-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB02-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB03-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB04-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB05-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2026/04/EB02-EB04-EB05-768x600.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EBR04-42-Herringbone-roomscene-1.jpg'
      ],
      productImages: [
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB01-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB02-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB03-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB04-6.jpg',
        'https://carpetsinter.com/wp-content/uploads/2023/06/EB05-6.jpg'
      ],
      resources: [
        { label: 'Brochure EBB & Upstream', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/CarpetTileCustomDesignPortfolioAug2021lr.pdf' },
        { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' }
      ]
    }
  };

  const { error: upErr } = await supabase.from('collections').update(upstreamData).eq('slug', 'upstream');
  if (upErr) {
    console.error('Update failed, trying upsert:', upErr);
    const { error: upErr2 } = await supabase.from('collections').upsert(upstreamData, { onConflict: 'slug' });
    if (upErr2) console.error('Upsert also failed:', upErr2);
    else console.log('✅ Upstream collection upserted with full data');
  } else {
    console.log('✅ Upstream collection updated with full data');
  }

  // 5. Verify final state
  console.log('\n--- Final DB State ---');
  const { data: finalData } = await supabase.from('collections').select('slug, name, hero_image, metadata').eq('status', 'published');
  finalData?.forEach(d => {
    const heroOk = d.hero_image && d.hero_image.length > 0 ? '✅' : '❌';
    const productsCount = d.metadata?.products?.length || 0;
    const galleryCount = d.metadata?.gallery?.length || 0;
    console.log(`${heroOk} ${d.slug}: products=${productsCount}, gallery=${galleryCount}, hero=${d.hero_image ? 'YES' : 'MISSING'}`);
  });
}

fixDatabase();
