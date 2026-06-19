const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Sử dụng SERVICE_ROLE_KEY để vượt qua Row Level Security (RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const productFixes = {
  'AC02': { pile: "Sợi vòng lặp có định hướng mềm", useCase: "Không gian yên tĩnh / Khu vực thư giãn" },
  'AKI01': { pile: "Sợi vòng lặp hướng nhỏ", useCase: "Lễ tân / Không gian thiết kế sáng tạo" },
  'AKI02': { pile: "Sợi vòng lặp nhiều lớp", useCase: "Nội thất văn phòng cao cấp" },
  'AKI03': { pile: "Sợi vòng lặp họa tiết cân bằng", useCase: "Studio / Khu vực thuyết trình" },
  'AKI04': { pile: "Sợi vòng lặp thương mại có cấu trúc", useCase: "Khu vực làm việc / Vùng hỗ trợ" },
  'AKI05': { pile: "Sợi vòng lặp chuyển tông có kết cấu", useCase: "Không gian công ty / Khu điều hành" },
  'AKI06': { pile: "Sợi vòng lặp dệt dày đặc", useCase: "Khu vực làm việc / Vùng hỗ trợ" },
  'AKI07': { pile: "Sợi vòng lặp bề mặt định hướng", useCase: "Hành lang / Khu vực quy hoạch" },
  'AKI08': { pile: "Sợi vòng lặp hướng rõ nét", useCase: "Showroom / Lối đi khẳng định đẳng cấp" },
  'AKI09': { pile: "Sợi vòng lặp cao cấp đầy cảm xúc", useCase: "Sàn điểm nhấn / Phòng trưng bày bán hàng" },
  'AKV01': { pile: "Sợi vòng lặp hướng nhỏ", useCase: "Khu vực lễ tân / Văn phòng hạng sang" },
  'AKV02': { pile: "Sợi vòng lặp chuyển tông mềm", useCase: "Showroom / Không gian tư vấn" },
  'AKV03': { pile: "Sợi vòng lặp cân bằng hiện đại", useCase: "Văn phòng thiết kế / Không gian hợp tác" },
  'AKV04': { pile: "Sợi vòng lặp họa tiết điểm nhấn", useCase: "Nội thất sáng tạo / Lối đi điểm nhấn" },
  'AKV05': { pile: "Sợi vòng lặp chuyển tông thanh lịch", useCase: "Giới thiệu thương hiệu / Phòng suite cao cấp" },
  'AKV06': { pile: "Sợi vòng lặp thương mại có định hướng", useCase: "Sàn kiến trúc tích hợp" },
  'DV202': { pile: "Sợi vòng lặp họa tiết Mosaic", useCase: "Khu vực trưng bày / Showroom" },
  'EBR01': { pile: "Sợi vòng lặp chuyển tông mềm", useCase: "Khu tiếp khách nhà hàng / Lễ tân yên tĩnh" },
  'EBR02': { pile: "Sợi vòng lặp chuyển tông hữu cơ", useCase: "Văn phòng khu nghỉ dưỡng / Khu vực chờ" },
  'EBR03': { pile: "Sợi vòng lặp cảm hứng dòng chảy", useCase: "Phòng khách điểm nhấn / Lối đi khu nghỉ dưỡng" },
  'EBR04': { pile: "Sợi vòng lặp chuyển tông sâu", useCase: "Không gian nghỉ dưỡng cao cấp" },
  'EBR05': { pile: "Sợi vòng lặp cấu trúc thấp", useCase: "Vùng điểm nhấn mềm mại" },
  'EBR06': { pile: "Sợi vòng lặp chuyển tông tinh tế", useCase: "Khu nghỉ dưỡng yên tĩnh / Khu vực tiếp khách" },
  'EBR21': { pile: "Sợi vòng lặp thương mại đơn sắc", useCase: "Phòng yên tĩnh / Góc thư giãn" },
  'EBR22': { pile: "Sợi vòng lặp chuyển tông ấm", useCase: "Nội thất nghỉ dưỡng / Chỗ ngồi êm ái" },
  'EBR31': { pile: "Sợi vòng lặp hướng tự nhiên", useCase: "Lối đi dòng chảy / Khu nghỉ dưỡng thương hiệu" },
  'EBR32': { pile: "Sợi vòng lặp họa tiết dòng chảy", useCase: "Bố cục nghỉ dưỡng tích hợp" },
  'EBR41': { pile: "Sợi vòng lặp chuyển tông sáng", useCase: "Phòng chờ mở / Lễ tân" },
  'EBR42': { pile: "Sợi vòng lặp điểm nhấn đậm sâu", useCase: "Phòng chờ điểm nhấn / Tiếp khách điều hành" },
  'EBR43': { pile: "Sợi vòng lặp chuyển tông cân bằng", useCase: "Không gian nghỉ dưỡng tinh tế" },
  'EBR44': { pile: "Sợi vòng lặp sắc chạng vạng ấm", useCase: "Khu nghỉ dưỡng cao cấp / Phòng suite khách sạn" },
  'FD01': { pile: "Sợi vòng lặp cấu trúc thấp", useCase: "Lễ tân / Phòng chờ / Khu trung tâm văn phòng" },
  'FD02': { pile: "Sợi vòng lặp cấu trúc cân bằng", useCase: "Văn phòng điều hành / Khu vực phòng họp" },
  'FD03': { pile: "Sợi vòng lặp dệt dày đặc", useCase: "Khu vực lưu thông / Vùng hỗ trợ công ty" },
  'FD04': { pile: "Sợi vòng lặp họa tiết điểm nhấn", useCase: "Vùng điểm nhấn / Vùng chuyển tiếp" },
  'FD05': { pile: "Sợi vòng lặp thương mại", useCase: "Không gian làm việc mở / Khu vực bàn làm việc" },
  'FD06': { pile: "Sợi vòng lặp kết cấu định hướng", useCase: "Sàn Tuyên Ngôn Kiến Trúc" },
  'GW01': { pile: "Sợi vòng lặp cấu trúc đa lớp", useCase: "Quy hoạch văn phòng / Mặt bằng mở" },
  'GW02': { pile: "Sợi vòng lặp kết cấu tuyến tính", useCase: "Khu vực phòng họp / Vùng làm việc" },
  'GW03': { pile: "Sợi vòng lặp có định hướng", useCase: "Khu vực lưu thông / Hành lang" },
  'GW04': { pile: "Sợi vòng lặp có kết cấu", useCase: "Không gian làm việc / Khu vực hợp tác" },
  'GW05': { pile: "Sợi vòng lặp bề mặt mịn", useCase: "Vùng hỗ trợ / Khu vực lập kế hoạch" },
  'GW06': { pile: "Sợi vòng lặp thương mại dày", useCase: "Khu vực cốt lõi / Lưu thông văn phòng" },
  'GW07': { pile: "Sợi vòng lặp kết cấu đường nét cân bằng", useCase: "Văn phòng thiết kế / Showroom" },
  'GW08': { pile: "Sợi vòng lặp hướng đầy cảm xúc", useCase: "Sàn điểm nhấn / Lối đi ấn tượng" }
};

async function forceFixEnglish() {
  console.log('🔄 Đang ép cập nhật các sản phẩm còn tiếng Anh (Service Role)...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, code, name, spec');

  if (error) return console.error('❌ Lỗi tải sản phẩm:', error);
  
  let updated = 0;
  for (const product of products) {
    const fix = productFixes[product.code];
    if (fix) {
      const newSpec = { ...product.spec, pile: fix.pile, useCase: fix.useCase };
      const { error: updateError } = await supabase.from('products').update({ spec: newSpec }).eq('id', product.id);
      
      if (updateError) {
        console.error(`❌ Lỗi cập nhật ${product.code}:`, updateError);
      } else {
        console.log(`✅ Cập nhật thành công: ${product.code} (${product.name})`);
        updated++;
      }
    }
  }
  
  console.log(`\n🎉 Hoàn tất! Đã force-update ${updated} sản phẩm.`);
}

forceFixEnglish().catch(console.error);
