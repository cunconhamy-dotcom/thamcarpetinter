-- Seed data for Collections and Blog Posts

-- Collections
INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'Foundation',
  'foundation',
  'Breaking Ground · mở ra nền tảng không gian bền vững và trang nhã.',
  'Bộ sưu tập Foundation mang ngôn ngữ thiết kế nền tảng, cân bằng giữa tính chuyên nghiệp, độ bền và vẻ đẹp tinh tế cho văn phòng, khách sạn và khu vực đón tiếp.',
  'Foundation phù hợp cho chiến lược thiết kế đề cao cảm giác ổn định, sạch sẽ và sang trọng. Các gam màu và texture được lựa chọn để tạo nên một mặt sàn có chiều sâu, giúp không gian ghi dấu ấn ngay từ ánh nhìn đầu tiên nhưng vẫn dễ ứng dụng trên diện rộng.',
  'https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root-1.jpg',
  'published',
  6
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'Groundwork',
  'groundwork',
  'Nền tảng chuyển động với cấu trúc 50x50 cm linh hoạt, dễ triển khai nhanh.',
  'Groundwork là lựa chọn cho các dự án cần tốc độ tiếp cận, bố trí nhanh và vẫn giữ được vẻ lịch thiệp của một bộ sưu tập thương mại cao cấp.',
  'Tinh thần của Groundwork nằm ở sự rõ ràng, hiệu quả và khả năng thích ứng mạnh. Bộ sưu tập này giúp nhà đầu tư và đơn vị thiết kế tạo nên mặt sàn đồng nhất, bền vững và hỗ trợ trải nghiệm di chuyển liên tục trong môi trường làm việc hiện đại.',
  'https://carpetsinter.com/wp-content/uploads/2026/01/GW08.jpg',
  'published',
  8
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'Aspekt: Insight',
  'aspekt-insight',
  'Một góc nhìn sâu hơn về không gian, nơi texture kể câu chuyện thương hiệu.',
  'Aspekt: Insight truyền tải tinh thần đương đại, giàu chiều sâu thị giác và phù hợp với các dự án muốn nhấn mạnh bản sắc thiết kế.',
  'Sự hấp dẫn của Insight nằm ở khả năng tạo ra bề mặt tinh tế nhưng không phô trương. Từng lựa chọn trong bộ sưu tập hỗ trợ kiến trúc sư và chủ đầu tư xây dựng trải nghiệm không gian cao cấp, hiện đại và có dấu ấn thẩm mỹ riêng.',
  'https://carpetsinter.com/wp-content/uploads/2024/10/01.jpg',
  'published',
  9
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'Waterloo',
  'waterloo',
  'Bright Light Big City · sắc thái đô thị sáng rõ, hiện đại và đắt giá.',
  'Waterloo được xây dựng cho những không gian muốn thể hiện nhịp sống thành thị, tinh thần đương đại và tiêu chuẩn thẩm mỹ rõ ràng.',
  'Bộ sưu tập Waterloo mang cảm hứng thành phố lớn, nơi nhịp chuyển động và ánh sáng kiến tạo nên cảm xúc chuyên nghiệp. Khi đưa vào dự án, Waterloo nâng cấp cảm nhận về chất lượng không gian, đồng thời giữ được tính linh hoạt cho nhiều loại layout.',
  'https://carpetsinter.com/wp-content/uploads/2025/11/Waterloo-WL201-adjust-scaled.jpg',
  'published',
  6
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'Architexture Connect',
  'architexture-connect',
  'Kết nối kiến trúc và xúc cảm bằng bề mặt đậm tính thiết kế.',
  'Architexture Connect được định vị cho những dự án muốn khẳng định đẳng cấp thiết kế thông qua kết cấu bề mặt khác biệt và giàu tính kết nối.',
  'Đây là bộ sưu tập lý tưởng khi mục tiêu không chỉ là lát sàn mà còn là kể câu chuyện thương hiệu. Architexture Connect giúp không gian trở nên tinh vi, có chiều sâu và tạo ra cảm giác đầu tư chỉn chu trong từng chi tiết.',
  'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-AC51-Silom-2-scaled-e1713320553884.jpg',
  'published',
  11
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'EBB Retreat',
  'ebb-retreat',
  'Upstream EBB & Flow · cảm hứng nghỉ dưỡng tinh tế cho không gian thương mại.',
  'EBB Retreat hướng đến trải nghiệm êm dịu, thư thái nhưng vẫn thể hiện chuẩn mực của một không gian đầu tư bài bản và cao cấp.',
  'Bộ sưu tập gợi nhịp chảy tự nhiên, rất phù hợp với những không gian cần cảm giác mềm mại, dễ chịu và có chiều sâu cảm xúc. EBB Retreat giúp người xem cảm nhận được sự chăm chút, giá trị lâu dài và đẳng cấp tinh tế ngay từ bề mặt sàn.',
  'https://carpetsinter.com/wp-content/uploads/2025/12/EBR04-42-Herringbone-roomscene-1.jpg',
  'published',
  13
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'Discover',
  'discover',
  'Take a Journey of Discovery · mỗi mã thiết kế là một câu chuyện thương hiệu riêng.',
  'Discover là bộ sưu tập đa dạng, nổi bật với nhiều mẫu mã giàu cá tính, phù hợp cho khách hàng muốn lựa chọn nhanh nhưng vẫn đạt được hiệu ứng thẩm mỹ cao.',
  'Discover mở ra nhiều khả năng kể chuyện cho không gian: từ chiều sâu tự nhiên, đường nét thủ công đến cảm hứng địa hình và nghệ thuật. Đây là lựa chọn rất mạnh cho chiến lược bán hàng nhấn vào sự phong phú, cảm hứng và giá trị trực tiếp mà khách hàng có thể hình dung ngay.',
  'https://carpetsinter.com/wp-content/uploads/2023/05/DV200_202-e1684310233612.jpg',
  'published',
  10
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'Flatlands',
  'flatlands',
  'Sự phẳng lặng tinh tế, tối giản nhưng để lại chiều sâu thị giác bền lâu.',
  'Flatlands phù hợp với chiến lược thiết kế tối giản sang trọng, nơi mọi chi tiết đều được tiết chế để làm nổi bật chất lượng tổng thể của không gian.',
  'Bộ sưu tập này phát huy sức mạnh trong các không gian cần cảm giác gọn, sạch, tinh tế và trưởng thành. Flatlands giúp các dự án thương mại đạt được hình ảnh chỉn chu, cao cấp mà không cần quá nhiều chi tiết phô trương.',
  'https://carpetsinter.com/wp-content/uploads/2023/04/FL0104242528333738-scaled.jpg',
  'published',
  16
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;

INSERT INTO collections (name, slug, tagline, summary, detail, hero_image, status, product_count)
VALUES (
  'Aspekt: Vue',
  'aspekt-vue',
  'Một tầm nhìn tinh tế, cân bằng giữa nghệ thuật thị giác và giá trị ứng dụng.',
  'Aspekt: Vue tạo nên ngôn ngữ mặt sàn mềm mại, hiện đại và sang trọng, phù hợp với những công trình cần dấu ấn thẩm mỹ rõ rệt nhưng vẫn dễ tiếp cận.',
  'Vue là lựa chọn lý tưởng để tạo ấn tượng trực tiếp cho khách hàng khi bước vào không gian. Bề mặt vừa thanh mảnh vừa có độ sâu, giúp công trình thể hiện hình ảnh đẳng cấp và có gu thiết kế rõ ràng.',
  'https://carpetsinter.com/wp-content/uploads/2024/10/Vue-e1728381708911.jpg',
  'published',
  9
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  detail = EXCLUDED.detail,
  hero_image = EXCLUDED.hero_image;


-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at)
VALUES (
  'Carpets Inter tại dự án trụ sở ngân hàng VPBank Tower',
  'news-1',
  '',
  '{"html":"Dự án trụ sở VPBank Tower tại Hà Nội là một trong những công trình thương mại tiêu biểu sử dụng thảm sàn cao cấp từ Carpets Inter. Với tổng diện tích lắp đặt hơn 15.000m², đây là minh chứng cho năng lực cung ứng và thi công chuyên nghiệp của đội ngũ Carpets Inter Vietnam.\n\nBộ sưu tập được lựa chọn cho dự án này là AVENUE và LUSH — hai dòng thảm viên mang phong cách hiện đại, tối giản nhưng tinh tế. Tone màu xám trung tính kết hợp họa tiết linear tạo nên sự chuyên nghiệp và đẳng cấp cho không gian làm việc.\n\nQuá trình thi công được hoàn thành trong 45 ngày với đội ngũ kỹ thuật viên được đào tạo trực tiếp bởi Carpets Inter. Đặc biệt, hệ thống đế thảm EcoSoft giúp cải thiện đáng kể chỉ số NRC (Noise Reduction Coefficient), tạo môi trường làm việc yên tĩnh cho hơn 3.000 nhân viên.\n\nSau 2 năm sử dụng, thảm vẫn giữ được 95% chất lượng ban đầu nhờ quy trình bảo trì định kỳ và chất lượng vật liệu vượt trội."}'::jsonb,
  '',
  'published',
  ''
) ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image;

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at)
VALUES (
  'So sánh thảm cuộn và thảm viên: Đâu là lựa chọn tối ưu cho văn phòng?',
  'news-2',
  '',
  '{"html":"Khi lựa chọn thảm cho văn phòng, hai dạng phổ biến nhất là thảm cuộn (broadloom) và thảm viên (carpet tiles). Mỗi loại đều có những ưu điểm riêng, phù hợp với từng nhu cầu và quy mô công trình khác nhau.\n\nThảm cuộn mang lại bề mặt liền mạch, sang trọng, phù hợp với các không gian lớn như sảnh khách sạn, phòng hội nghị cao cấp. Tuy nhiên, chi phí lắp đặt cao hơn và khó thay thế khi hư hỏng cục bộ.\n\nNgược lại, thảm viên (carpet tiles) — đặc biệt là dòng sản phẩm 50x50cm của Carpets Inter — mang đến sự linh hoạt tuyệt vời: dễ lắp đặt, dễ thay thế từng viên khi cần, giảm hao hụt vật liệu xuống dưới 3%, và cho phép sáng tạo các pattern độc đáo bằng cách kết hợp nhiều mẫu mã khác nhau.\n\nVề chi phí vòng đời (lifecycle cost), thảm viên tiết kiệm hơn 30-40% so với thảm cuộn nhờ khả năng thay thế cục bộ và bảo trì dễ dàng."}'::jsonb,
  '',
  'published',
  ''
) ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image;

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at)
VALUES (
  'Thảm sàn xanh: Giải pháp bền vững cho công trình thương mại',
  'news-3',
  '',
  '{"html":"Trong bối cảnh các doanh nghiệp và chủ đầu tư ngày càng chú trọng đến tiêu chí phát triển bền vững, thảm sàn xanh (green carpet) đã trở thành lựa chọn tất yếu cho các công trình thương mại hiện đại. Carpets Inter tiên phong trong việc sử dụng sợi tái chế từ chai nhựa PET và đế thảm EcoSoft — giảm tới 60% lượng carbon so với thảm truyền thống.\n\nCác dự án đạt chứng chỉ LEED, LOTUS hay Green Mark đều yêu cầu vật liệu nội thất có nguồn gốc bền vững. Thảm dạng viên từ Carpets Inter không chỉ đáp ứng mà còn vượt xa các tiêu chuẩn này, với khả năng thu hồi và tái chế 100% sau khi hết vòng đời sử dụng.\n\nĐặc biệt, quy trình sản xuất khép kín tại nhà máy Carpets Inter ở Thái Lan đã được chứng nhận ISO 14001 về quản lý môi trường, đảm bảo mỗi tấm thảm đều mang trong mình cam kết bảo vệ hành tinh mà không hề thỏa hiệp về chất lượng hay thẩm mỹ."}'::jsonb,
  '',
  'published',
  ''
) ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image;

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at)
VALUES (
  'Xu hướng thiết kế nội thất thảm văn phòng 2026',
  'news-4',
  '',
  '{"html":"Năm 2026 đánh dấu sự lên ngôi của các vật liệu thân thiện với môi trường và thiết kế thảm mang tính cá nhân hóa cao. Các không gian văn phòng ngày càng chú trọng đến sự thoải mái và sức khỏe của nhân viên. Sự kết hợp giữa các tông màu đất ấm áp và họa tiết lấy cảm hứng từ thiên nhiên đang trở thành xu hướng chủ đạo, giúp tạo ra một môi trường làm việc cân bằng và đầy cảm hứng.\n\nBên cạnh đó, thảm dạng viên (carpet tiles) với khả năng linh hoạt trong thiết kế và lắp đặt cũng đang được ưu tiên hàng đầu, giúp doanh nghiệp dễ dàng thay đổi cấu trúc không gian theo nhu cầu phát triển."}'::jsonb,
  '',
  'published',
  ''
) ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image;

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at)
VALUES (
  'Giải pháp tiêu âm hiệu quả với thảm Carpets Inter',
  'news-5',
  '',
  '{"html":"Tiếng ồn trong văn phòng mở luôn là một thách thức lớn đối với sự tập trung và năng suất làm việc. Sử dụng thảm trải sàn chất lượng cao từ Carpets Inter với lớp đế EcoSoft không chỉ mang lại vẻ đẹp thẩm mỹ mà còn là giải pháp tiêu âm vượt trội.\n\nLớp đế EcoSoft được làm từ chai nhựa tái chế (PET) có khả năng hấp thụ âm thanh tốt gấp đôi so với thảm đế cứng thông thường (PVC). Điều này giúp giảm thiểu tiếng vang, tiếng bước chân và tạo ra một không gian làm việc yên tĩnh, chuyên nghiệp."}'::jsonb,
  '',
  'published',
  ''
) ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image;

INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at)
VALUES (
  'Cách bảo quản và vệ sinh thảm đúng chuẩn chuyên gia',
  'news-6',
  '',
  '{"html":"Đầu tư vào thảm sàn cao cấp đòi hỏi một quy trình bảo dưỡng phù hợp để tối ưu hóa tuổi thọ. Hút bụi thường xuyên, ít nhất 2-3 lần/tuần là bước quan trọng nhất để ngăn bụi bẩn bám sâu vào sợi thảm.\n\nĐối với các vết bẩn do thức uống hoặc thức ăn, cần xử lý ngay lập tức bằng khăn sạch và dung dịch tẩy rửa chuyên dụng có độ pH trung tính. Việc giặt thảm định kỳ 6 tháng - 1 năm/lần bằng phương pháp giặt khô hoặc giặt hơi nước nóng (extraction) bởi các đơn vị chuyên nghiệp là vô cùng cần thiết để thảm luôn sạch sẽ và diệt khuẩn."}'::jsonb,
  '',
  'published',
  ''
) ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image;

