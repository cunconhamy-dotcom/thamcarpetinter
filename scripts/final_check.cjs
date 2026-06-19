const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function finalCheck() {
  const { data, error } = await supabase.from('products').select('code, name, spec').order('code');
  if (error) { console.error(error); return; }
  
  const englishWordPattern = /\b(commercial|loop|texture|construction|office|area|lounge|space|floor|room|lobby|corridor|reception|executive|retreat|hospitality|transition|zone|suite|showroom|feature|circulation|setting|balanced|organic|tonal|directional|deep|warm|light|fine|dense|subtle|accent|structured)\b/i;
  
  let issues = [];
  for (const p of data) {
    const pile = p.spec?.pile || '';
    const useCase = p.spec?.useCase || '';
    if (englishWordPattern.test(pile) || englishWordPattern.test(useCase)) {
      issues.push({ code: p.code, name: p.name, pile, useCase });
    }
  }
  
  if (issues.length === 0) {
    console.log('✅ TẤT CẢ SẢN PHẨM đã được Việt hóa hoàn toàn!');
  } else {
    console.log('⚠️ Còn ' + issues.length + ' sản phẩm có nội dung tiếng Anh:');
    issues.forEach(p => console.log('  - ' + p.code + ' (' + p.name + '): pile="' + p.pile + '" | useCase="' + p.useCase + '"'));
  }
  
  console.log('\nTổng: ' + data.length + ' sản phẩm đã kiểm tra.');
}

finalCheck().catch(console.error);
