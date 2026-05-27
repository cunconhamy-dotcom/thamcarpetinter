import { supabase } from './supabase'

export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  date: string
  author: string
  image: string
}

/** Fallback mock data used when Supabase is unavailable */
export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Carpets Inter tại dự án trụ sở ngân hàng VPBank Tower',
    summary: 'Chia sẻ hành trình cung cấp và thi công thảm sàn cao cấp cho tòa nhà văn phòng hạng A tại Hà Nội.',
    content: 'Dự án trụ sở VPBank Tower tại Hà Nội là một trong những công trình thương mại tiêu biểu sử dụng thảm sàn cao cấp từ Carpets Inter. Với tổng diện tích lắp đặt hơn 15.000m², đây là minh chứng cho năng lực cung ứng và thi công chuyên nghiệp của đội ngũ Carpets Inter Vietnam.\n\nBộ sưu tập được lựa chọn cho dự án này là AVENUE và LUSH — hai dòng thảm viên mang phong cách hiện đại, tối giản nhưng tinh tế. Tone màu xám trung tính kết hợp họa tiết linear tạo nên sự chuyên nghiệp và đẳng cấp cho không gian làm việc.\n\nQuá trình thi công được hoàn thành trong 45 ngày với đội ngũ kỹ thuật viên được đào tạo trực tiếp bởi Carpets Inter. Đặc biệt, hệ thống đế thảm EcoSoft giúp cải thiện đáng kể chỉ số NRC (Noise Reduction Coefficient), tạo môi trường làm việc yên tĩnh cho hơn 3.000 nhân viên.\n\nSau 2 năm sử dụng, thảm vẫn giữ được 95% chất lượng ban đầu nhờ quy trình bảo trì định kỳ và chất lượng vật liệu vượt trội.',
    date: '25/05/2026',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'news-2',
    title: 'So sánh thảm cuộn và thảm viên: Đâu là lựa chọn tối ưu cho văn phòng?',
    summary: 'Phân tích ưu nhược điểm giữa thảm cuộn (broadloom) và thảm viên (carpet tiles) để giúp bạn đưa ra quyết định phù hợp.',
    content: 'Khi lựa chọn thảm cho văn phòng, hai dạng phổ biến nhất là thảm cuộn (broadloom) và thảm viên (carpet tiles). Mỗi loại đều có những ưu điểm riêng, phù hợp với từng nhu cầu và quy mô công trình khác nhau.\n\nThảm cuộn mang lại bề mặt liền mạch, sang trọng, phù hợp với các không gian lớn như sảnh khách sạn, phòng hội nghị cao cấp. Tuy nhiên, chi phí lắp đặt cao hơn và khó thay thế khi hư hỏng cục bộ.\n\nNgược lại, thảm viên (carpet tiles) — đặc biệt là dòng sản phẩm 50x50cm của Carpets Inter — mang đến sự linh hoạt tuyệt vời: dễ lắp đặt, dễ thay thế từng viên khi cần, giảm hao hụt vật liệu xuống dưới 3%, và cho phép sáng tạo các pattern độc đáo bằng cách kết hợp nhiều mẫu mã khác nhau.\n\nVề chi phí vòng đời (lifecycle cost), thảm viên tiết kiệm hơn 30-40% so với thảm cuộn nhờ khả năng thay thế cục bộ và bảo trì dễ dàng.',
    date: '24/05/2026',
    author: 'Kỹ thuật',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'news-3',
    title: 'Thảm sàn xanh: Giải pháp bền vững cho công trình thương mại',
    summary: 'Tìm hiểu cách thảm sàn tái chế và vật liệu xanh đang thay đổi ngành nội thất thương mại tại Việt Nam.',
    content: 'Trong bối cảnh các doanh nghiệp và chủ đầu tư ngày càng chú trọng đến tiêu chí phát triển bền vững, thảm sàn xanh (green carpet) đã trở thành lựa chọn tất yếu cho các công trình thương mại hiện đại. Carpets Inter tiên phong trong việc sử dụng sợi tái chế từ chai nhựa PET và đế thảm EcoSoft — giảm tới 60% lượng carbon so với thảm truyền thống.\n\nCác dự án đạt chứng chỉ LEED, LOTUS hay Green Mark đều yêu cầu vật liệu nội thất có nguồn gốc bền vững. Thảm dạng viên từ Carpets Inter không chỉ đáp ứng mà còn vượt xa các tiêu chuẩn này, với khả năng thu hồi và tái chế 100% sau khi hết vòng đời sử dụng.\n\nĐặc biệt, quy trình sản xuất khép kín tại nhà máy Carpets Inter ở Thái Lan đã được chứng nhận ISO 14001 về quản lý môi trường, đảm bảo mỗi tấm thảm đều mang trong mình cam kết bảo vệ hành tinh mà không hề thỏa hiệp về chất lượng hay thẩm mỹ.',
    date: '22/05/2026',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'news-4',
    title: 'Xu hướng thiết kế nội thất thảm văn phòng 2026',
    summary: 'Khám phá những tông màu và chất liệu thảm được ưa chuộng nhất trong thiết kế văn phòng hiện đại.',
    content: 'Năm 2026 đánh dấu sự lên ngôi của các vật liệu thân thiện với môi trường và thiết kế thảm mang tính cá nhân hóa cao. Các không gian văn phòng ngày càng chú trọng đến sự thoải mái và sức khỏe của nhân viên. Sự kết hợp giữa các tông màu đất ấm áp và họa tiết lấy cảm hứng từ thiên nhiên đang trở thành xu hướng chủ đạo, giúp tạo ra một môi trường làm việc cân bằng và đầy cảm hứng.\n\nBên cạnh đó, thảm dạng viên (carpet tiles) với khả năng linh hoạt trong thiết kế và lắp đặt cũng đang được ưu tiên hàng đầu, giúp doanh nghiệp dễ dàng thay đổi cấu trúc không gian theo nhu cầu phát triển.',
    date: '19/05/2026',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'news-5',
    title: 'Giải pháp tiêu âm hiệu quả với thảm Carpets Inter',
    summary: 'Đánh giá khả năng cách âm và cải thiện chất lượng môi trường làm việc của thảm trải sàn.',
    content: 'Tiếng ồn trong văn phòng mở luôn là một thách thức lớn đối với sự tập trung và năng suất làm việc. Sử dụng thảm trải sàn chất lượng cao từ Carpets Inter với lớp đế EcoSoft không chỉ mang lại vẻ đẹp thẩm mỹ mà còn là giải pháp tiêu âm vượt trội.\n\nLớp đế EcoSoft được làm từ chai nhựa tái chế (PET) có khả năng hấp thụ âm thanh tốt gấp đôi so với thảm đế cứng thông thường (PVC). Điều này giúp giảm thiểu tiếng vang, tiếng bước chân và tạo ra một không gian làm việc yên tĩnh, chuyên nghiệp.',
    date: '15/05/2026',
    author: 'Kỹ thuật',
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'news-6',
    title: 'Cách bảo quản và vệ sinh thảm đúng chuẩn chuyên gia',
    summary: 'Hướng dẫn chi tiết giúp kéo dài tuổi thọ và duy trì vẻ đẹp ban đầu của thảm sàn.',
    content: 'Đầu tư vào thảm sàn cao cấp đòi hỏi một quy trình bảo dưỡng phù hợp để tối ưu hóa tuổi thọ. Hút bụi thường xuyên, ít nhất 2-3 lần/tuần là bước quan trọng nhất để ngăn bụi bẩn bám sâu vào sợi thảm.\n\nĐối với các vết bẩn do thức uống hoặc thức ăn, cần xử lý ngay lập tức bằng khăn sạch và dung dịch tẩy rửa chuyên dụng có độ pH trung tính. Việc giặt thảm định kỳ 6 tháng - 1 năm/lần bằng phương pháp giặt khô hoặc giặt hơi nước nóng (extraction) bởi các đơn vị chuyên nghiệp là vô cùng cần thiết để thảm luôn sạch sẽ và diệt khuẩn.',
    date: '10/05/2026',
    author: 'Dịch vụ',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
  }
]

/**
 * Format a Date or ISO string into dd/mm/yyyy Vietnamese-style date
 */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

/**
 * Fetch news articles from Supabase blog_posts table.
 * Falls back to mockNews if the fetch fails or returns empty.
 */
export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, content, cover_image, published_at')
      .eq('status', 'published')
      .not('content->>category', 'is', null)
      .order('published_at', { ascending: false })

    if (error) {
      console.warn('[News] Supabase fetch error, using fallback:', error.message)
      return mockNews
    }

    if (!data || data.length === 0) {
      console.warn('[News] No articles found in database, using fallback')
      return mockNews
    }

    // Filter only news-category posts and map to NewsArticle
    const newsArticles: NewsArticle[] = data
      .filter((post: any) => post.content?.category === 'news')
      .map((post: any) => ({
        id: post.id,
        title: post.title,
        summary: post.excerpt || '',
        content: post.content?.body || '',
        date: post.published_at ? formatDate(post.published_at) : '',
        author: post.content?.author || 'Admin',
        image: post.cover_image || '',
      }))

    return newsArticles.length > 0 ? newsArticles : mockNews
  } catch (err) {
    console.warn('[News] Unexpected error fetching news, using fallback:', err)
    return mockNews
  }
}
