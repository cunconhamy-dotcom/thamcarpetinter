export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  date: string
  author: string
  image: string
}

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Xu hướng thiết kế nội thất thảm văn phòng 2026',
    summary: 'Khám phá những tông màu và chất liệu thảm được ưa chuộng nhất trong thiết kế văn phòng hiện đại.',
    content: 'Năm 2026 đánh dấu sự lên ngôi của các vật liệu thân thiện với môi trường và thiết kế thảm mang tính cá nhân hóa cao. Các không gian văn phòng ngày càng chú trọng đến sự thoải mái và sức khỏe của nhân viên. Sự kết hợp giữa các tông màu đất ấm áp và họa tiết lấy cảm hứng từ thiên nhiên đang trở thành xu hướng chủ đạo, giúp tạo ra một môi trường làm việc cân bằng và đầy cảm hứng.\n\nBên cạnh đó, thảm dạng viên (carpet tiles) với khả năng linh hoạt trong thiết kế và lắp đặt cũng đang được ưu tiên hàng đầu, giúp doanh nghiệp dễ dàng thay đổi cấu trúc không gian theo nhu cầu phát triển.',
    date: '19/05/2026',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'news-2',
    title: 'Giải pháp tiêu âm hiệu quả với thảm Carpets Inter',
    summary: 'Đánh giá khả năng cách âm và cải thiện chất lượng môi trường làm việc của thảm trải sàn.',
    content: 'Tiếng ồn trong văn phòng mở luôn là một thách thức lớn đối với sự tập trung và năng suất làm việc. Sử dụng thảm trải sàn chất lượng cao từ Carpets Inter với lớp đế EcoSoft không chỉ mang lại vẻ đẹp thẩm mỹ mà còn là giải pháp tiêu âm vượt trội.\n\nLớp đế EcoSoft được làm từ chai nhựa tái chế (PET) có khả năng hấp thụ âm thanh tốt gấp đôi so với thảm đế cứng thông thường (PVC). Điều này giúp giảm thiểu tiếng vang, tiếng bước chân và tạo ra một không gian làm việc yên tĩnh, chuyên nghiệp.',
    date: '15/05/2026',
    author: 'Kỹ thuật',
    image: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'news-3',
    title: 'Cách bảo quản và vệ sinh thảm đúng chuẩn chuyên gia',
    summary: 'Hướng dẫn chi tiết giúp kéo dài tuổi thọ và duy trì vẻ đẹp ban đầu của thảm sàn.',
    content: 'Đầu tư vào thảm sàn cao cấp đòi hỏi một quy trình bảo dưỡng phù hợp để tối ưu hóa tuổi thọ. Hút bụi thường xuyên, ít nhất 2-3 lần/tuần là bước quan trọng nhất để ngăn bụi bẩn bám sâu vào sợi thảm.\n\nĐối với các vết bẩn do thức uống hoặc thức ăn, cần xử lý ngay lập tức bằng khăn sạch và dung dịch tẩy rửa chuyên dụng có độ pH trung tính. Việc giặt thảm định kỳ 6 tháng - 1 năm/lần bằng phương pháp giặt khô hoặc giặt hơi nước nóng (extraction) bởi các đơn vị chuyên nghiệp là vô cùng cần thiết để thảm luôn sạch sẽ và diệt khuẩn.',
    date: '10/05/2026',
    author: 'Dịch vụ',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
  }
]
