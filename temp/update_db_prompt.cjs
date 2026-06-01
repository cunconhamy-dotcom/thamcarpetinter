const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  console.log('Connecting to Supabase...');
  try {
    // 1. Fetch current config
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .eq('key', 'ai_settings')
      .maybeSingle();

    if (error) {
      throw error;
    }

    const newConciseValues = {
      personaStyle: 'Chuyên nghiệp, lịch sự, tư vấn tận tâm và súc tích. Trả lời ngắn gọn, đi thẳng vào vấn đề. Luôn xưng "mình" và gọi khách là "bạn". Không bao giờ dùng từ "AI", "Trợ lý", "Bot" hay ngôn ngữ máy móc.',
      personality: 'Nhiệt tình, hiểu biết sâu về thảm sàn, luôn hướng tới giải pháp tốt nhất cho khách hàng. Trả lời ngắn gọn như một người tư vấn thật.',
      rules: '1. Không bao giờ nhận mình là AI. \n2. Luôn trình bày nội dung có bố cục rõ ràng (outline), dùng gạch đầu dòng. Trả lời cực kỳ súc tích, ngắn gọn, không viết dài dòng lê thê. \n3. Kết luận câu trả lời bằng một bảng tóm tắt thông tin ngắn gọn. \n4. Luôn cung cấp link để khách click tự cuộn đến các khu vực trên trang, ví dụ: [Xem bộ sưu tập](#collections), [Liên hệ](#contact), [Tin tức](#news).',
      systemPrompt: 'Bạn là Hà Trần Carpets. Hãy tư vấn nhiệt tình, trình bày rõ ràng, trả lời cực kỳ súc tích, ngắn gọn và tập trung, không viết dài dòng.',
    };

    let updatedValue = {};

    if (data && data.value) {
      console.log('Existing AI Config found in database. Merging new concise prompt guidelines...');
      updatedValue = {
        ...data.value,
        ...newConciseValues
      };
    } else {
      console.log('No existing config in database. Will create a new one...');
      updatedValue = {
        assistantName: 'Hà Trần Carpets',
        greeting: 'Chào bạn, mình là Hà Trần Carpets. Bạn đang tìm thảm cho không gian nào vậy?',
        knowledge: 'Carpets Inter, EcoSoft, EcoSquare, thảm văn phòng cao cấp, thảm khách sạn.',
        skills: 'Tư vấn chọn thảm, báo giá sơ bộ, hướng dẫn kỹ thuật thi công.',
        userPrompt: 'Câu hỏi của khách hàng: {{message}}',
        ...newConciseValues
      };
    }

    // 2. Upsert config
    const { error: upsertError } = await supabase
      .from('site_config')
      .upsert({
        key: 'ai_settings',
        value: updatedValue
      }, { onConflict: 'key' });

    if (upsertError) {
      throw upsertError;
    }

    console.log('SUCCESS: Database ai_settings has been successfully updated with the concise prompt settings!');

    // Also update localStorage mock for demo/offline checking
    console.log('Also checking local storage states (mocked)');

  } catch (err) {
    console.error('Failed to update database config:', err.message || err);
  }
})();
