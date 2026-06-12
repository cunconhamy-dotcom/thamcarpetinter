import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// 1. Static translations for the 9 collections
const collectionTranslations = {
  'foundation': {
    tagline: 'Mỗi thành công trường tồn đều khởi nguồn từ một nền tảng vững chắc.',
    summary: 'Foundation – Thiết kế đột phá khởi nguồn từ cam kết bền vững của chúng tôi với môi trường.',
    detail: 'Sự ổn định của ngày hôm nay mở ra cánh cửa cho sự sáng tạo và xuất sắc của ngày mai. Mỗi bước đi vững chắc giúp kiến tạo một tương lai bền vững.',
    quick_facts: ['Kích thước: 50x50 cm.'],
    value_facts: [
      'Cung cấp nền tảng vững chắc cho sự thành công lâu dài.',
      'Nâng đỡ doanh nghiệp ngay từ những bước đầu tiên.',
      'Cam kết hướng tới sự bền vững và thân thiện với môi trường.'
    ],
    applications: ['Định hình thương hiệu', 'Kiến tạo môi trường', 'Hỗ trợ doanh nghiệp']
  },
  'aspekt-insight': {
    tagline: 'Khai mở những góc nhìn đầy sáng tạo, kiến tạo nên những thiết kế tinh tế và có chiều sâu.',
    summary: 'Bộ sưu tập Aspekt: Insight mang lại những góc nhìn đầy cảm hứng và thiết kế tiên phong cho không gian thương mại. Kết hợp tính thẩm mỹ cao cấp với giải pháp sinh thái bền vững để định hình không gian làm việc hiện đại.',
    detail: 'Với sự rõ nét, tự tin và cam kết đổi mới trong thiết kế, Aspekt: Insight đại diện cho chuẩn mực tiếp theo của dòng thảm tấm thương mại. Sản phẩm nâng tầm giá trị trực quan đồng thời đáp ứng các tiêu chuẩn giảm thiểu carbon nghiêm ngặt.',
    quick_facts: ['Kích thước: 50x50 cm.', 'Chất liệu: 100% Sợi cao cấp thân thiện môi trường'],
    value_facts: [
      'Truyền cảm hứng thành công, thể hiện tầm nhìn và di sản vượt trội.',
      'Mang đến vẻ đẹp sang trọng, êm ái và định hình phong cách sống hiện đại.',
      'Kiến tạo sự an lành và nâng cao năng suất làm việc.',
      'Thể hiện cam kết cắt giảm carbon và trách nhiệm bảo vệ môi trường.',
      'Kiến tạo không gian bằng sự tự tin và tinh tế đẳng cấp.'
    ],
    applications: ['Văn phòng cao cấp', 'Khu vực trưng bày', 'Phòng họp sáng tạo']
  },
  'ebb-retreat': {
    tagline: 'Sự linh hoạt trong thiết kế là cốt lõi để kiến tạo nên những không gian nội thất mang đậm dấu ấn cá nhân.',
    summary: 'Thảm tấm modular của chúng tôi mang lại nhiều lợi ích vượt trội, từ tính năng dễ dàng lắp đặt cho đến khả năng bảo dưỡng dưới sàn linh hoạt với mức độ gián đoạn tối thiểu.',
    detail: 'Bộ sưu tập EBB Retreat mang đến giải pháp thảm sàn linh hoạt, tối ưu hóa công năng và nâng tầm tính thẩm mỹ cho mọi công trình thương mại hiện đại.',
    quick_facts: ['Loại sản phẩm: Thảm tấm modular', 'Kích thước: 50x50 cm.'],
    value_facts: [
      'Lắp đặt dễ dàng, nhanh chóng và tiết kiệm chi phí tối đa.',
      'Bảo dưỡng và thay thế linh hoạt dưới sàn với sự gián đoạn tối thiểu.',
      'Đa dạng cách phối màu và hoa văn độc đáo, tạo cảm giác yên bình và thư thái.'
    ],
    applications: ['Phòng họp', 'Khu vực lễ tân', 'Không gian nội thất cá nhân']
  },
  'groundwork': {
    tagline: 'Khai phóng tiềm năng cùng bộ sưu tập Groundwork.',
    summary: 'Mang đến nền tảng cấu trúc hữu cơ thanh lịch và vượt thời gian, làm điểm tựa vững chắc để xây dựng và định hình những không gian làm việc chuyên nghiệp, truyền cảm hứng.',
    detail: 'Thiết kế dựa trên Groundwork đồng nghĩa với việc gia tăng cá tính, sự tinh tế tự nhiên và độ bền ưu việt cho mặt sàn. Bộ sưu tập sử dụng cấu trúc dệt nhiều lớp hiện đại mang lại hiệu năng tối đa.',
    quick_facts: [
      'Cấu trúc: Tufted vòng lặp nhiều cấp độ',
      'Chất liệu sợi: 100% Solution Dyed Nylon',
      'Cự ly kim: 1/12',
      'Chiều cao sợi: 3 - 5.5 mm.',
      'Tổng trọng lượng: 2,812 và 3,422 g/m²',
      'Đế sơ cấp: Non Woven Polyester Spunbonded',
      'Đế thứ cấp: EcoSquare® và EcoSoft®',
      'Kích thước tấm: 50 x 50 cm'
    ],
    value_facts: [
      'Kiến tạo một tương lai không chỉ thành công mà còn bền vững.',
      'Đầu tư vào nền móng vững chắc của tương lai thương hiệu.'
    ],
    applications: ['Văn phòng làm việc', 'Khu vực công cộng', 'Không gian thương mại']
  },
  'flatlands': {
    tagline: 'Cấu trúc vân đơn sắc, giải pháp lý tưởng cho tổng thể mặt sàn đồng nhất.',
    summary: 'Flatlands mang lại lớp nền vân đơn sắc hiệu năng cao cho các không gian chức năng, được thiết kế để tạo ra diện mạo liền mạch và sang trọng trên toàn bộ mặt sàn.',
    detail: 'Được lấy cảm hứng từ những đồng bằng bao la bao phủ trái đất, cấu trúc vân đơn sắc của Flatlands là lựa chọn lý tưởng cho các không gian văn phòng. Thảm có thể được lắp đặt độc lập hoặc kết hợp hài hòa với các hoa văn của bộ sưu tập Mesa, Over the Ocean và Across the Sea.',
    quick_facts: ['Kích thước sẵn có: 50x50 cm', 'Kích thước sẵn có: 25x100 cm'],
    value_facts: [
      'Lý tưởng để tạo ra diện mạo liền mạch và đồng nhất trên toàn bộ mặt sàn.',
      'Cung cấp một lớp nền linh hoạt, hiệu năng cao cho các không gian chức năng.',
      'Phối hợp hoàn hảo với các hoa văn của Mesa, Over the Ocean và Across the Sea.'
    ],
    applications: ['Không gian chức năng', 'Văn phòng hiện đại', 'Hành lang & Lối đi']
  },
  'aspekt-vue': {
    tagline: 'Sự kết hợp hoàn hảo giữa chất lượng cao cấp và tư duy thiết kế tiên phong.',
    summary: 'Cốt lõi của Bộ sưu tập Aspekt là khái niệm khai mở những chiều không gian mới của chất lượng, phong cách và sự bền vững. Aspekt-Vue là sự tiếp nối hoàn mỹ mang lại chiều sâu trực quan cho mặt sàn.',
    detail: 'Bộ sưu tập Aspekt-Vue đại diện cho sự giao thoa giữa chất lượng thượng hạng và tư duy thiết kế hướng tới tương lai. Thúc đẩy cảm hứng thành công và đổi mới sáng tạo trong mọi không gian làm việc.',
    quick_facts: ['Kích thước: 50x50 cm.'],
    value_facts: [
      'Truyền cảm hứng thành công và thúc đẩy sự đổi mới sáng tạo mạnh mẽ.',
      'Mang lại trải nghiệm dẫn đầu, sự tự tin và mục tiêu rõ ràng trong công việc.',
      'Kiến tạo không gian nơi sự đổi mới thăng hoa và trách nhiệm sinh thái đồng hành cùng sự ưu việt.',
      'Đóng góp tích cực vào một tương lai xanh và bền vững hơn.'
    ],
    applications: ['Văn phòng lãnh đạo', 'Khu vực sáng tạo', 'Phòng hội nghị cao cấp']
  },
  'discover': {
    tagline: 'Hành trình khám phá và tự viết nên câu chuyện của riêng bạn.',
    summary: 'Discover là bộ sưu tập thảm tấm modular lấy cảm hứng từ lịch sử, những chuyến phiêu lưu và câu chuyện khảo cổ của các vùng đất cổ xưa, mang vẻ đẹp huyền bí vào không gian kiến trúc đương đại.',
    detail: 'Xuyên suốt chiều dài lịch sử, các nhà thám hiểm đã khai quật lịch sử, khám phá các nền văn minh cổ đại và mang vẻ đẹp hoang sơ về với hiện tại. Discover tái hiện những chất cảm đó qua các đường vân dệt độc đáo, mô phỏng các dấu vết thời gian.',
    quick_facts: ['Kích thước: 50x50 cm.'],
    value_facts: [
      'Cho phép bạn tự viết nên câu chuyện không gian độc đáo của riêng mình.',
      'Khai quật vẻ đẹp lịch sử và chất cảm tự nhiên vào thiết kế mặt sàn.',
      'Tạo nên vẻ đẹp vượt thời gian và sự tò mò đầy nghệ thuật trong không gian nội thất.',
      'Tôn vinh các họa tiết thủ công độc bản mang đậm dấu ấn di sản.'
    ],
    applications: ['Phòng trưng bày', 'Văn phòng sáng tạo', 'Sảnh khách sạn']
  },
  'architexture-connect': {
    tagline: 'Khám phá - Kiến tạo những kết nối không giới hạn.',
    summary: 'Architexture Connect là sự tiến hóa của dòng thảm cổ điển vượt thời gian, được thiết kế để kết nối các không gian làm việc, học tập và nghỉ ngơi một cách tự nhiên và liền mạch.',
    detail: 'Kiến trúc đóng vai trò như người kể chuyện cho hành trình chung của chúng ta. Nó vượt lên trên những viên gạch và vữa để trở thành một trải nghiệm sống động. Architexture Connect giúp nối kết quá khứ với tầm nhìn tương lai.',
    quick_facts: ['Loại sản phẩm: Thảm tấm thanh dài', 'Kích thước tấm: 25x100 cm.'],
    value_facts: [
      'Kết nối các không gian lại với nhau một cách dễ dàng và tinh tế.',
      'Kết nối quá khứ với tầm nhìn hướng tới tương lai vững chắc.',
      'Khả năng thích ứng linh hoạt cho các không gian không ngừng phát triển.',
      'Phù hợp hoàn hảo cho các môi trường làm việc, nghỉ ngơi, vui chơi, học tập và trị liệu.'
    ],
    applications: ['Không gian làm việc', 'Không gian nghỉ ngơi', 'Không gian học tập', 'Không gian trị liệu']
  },
  'waterloo': {
    tagline: 'Nơi cấu trúc giao thoa cùng dòng chảy, thiết kế tối ưu cho cuộc sống hiện đại.',
    summary: 'Những hoa văn hình học tinh tế kết hợp cùng bảng màu hiện đại, tối giản phản ánh nhịp sống năng động và đầy màu sắc tại các trung tâm đô thị lớn toàn cầu.',
    detail: 'Được lấy cảm hứng từ ga Waterloo - trung tâm của sự chuyển dịch, thảm Waterloo phản ánh một cấu trúc chặt chẽ nhưng vẫn mềm mại như dòng chảy của con người. Thảm mang đến sự bền bỉ ưu việt và tính linh hoạt cao cho các không gian có mật độ đi lại lớn.',
    quick_facts: ['Loại sản phẩm: Thảm tấm thanh dài', 'Kích thước tấm: 50x100 cm.'],
    value_facts: [
      'Kết nối các không gian trong khi vẫn giữ nguyên vẻ sang trọng của cuộc sống đô thị.',
      'Gợi liên tưởng đến nhịp điệu không ngừng của những chuyến đi và đến.',
      'Mang lại hiệu năng sử dụng hàng đầu cho các dự án thương mại.',
      'Thiết kế chuyên biệt cho môi trường có mật độ giao thông đi lại cực cao.',
      'Cung cấp độ bền tối đa và sự linh hoạt vượt trội cho các không gian năng động.'
    ],
    applications: ['Văn phòng năng động', 'Lối đi chung', 'Khu vực công cộng mật độ cao']
  }
};

// 2. Dictionary of English spec terms to Vietnamese
const specDictionary = {
  // Pile
  'Urban directional loop': 'Sợi vòng lặp có định hướng đô thị',
  'Fine commercial loop': 'Sợi vòng lặp thương mại mịn',
  'Structured loop texture': 'Cấu trúc sợi vòng lặp dệt nổi',
  'Dense directional loop': 'Sợi vòng lặp mật độ cao có định hướng',
  'Refined tonal loop': 'Sợi vòng lặp chuyển tông tinh tế',
  'Directional statement loop': 'Sợi vòng lặp có định hướng tạo điểm nhấn',
  'Accent tonal loop': 'Sợi vòng lặp nhấn chuyển tông',
  'Structured accent loop': 'Cấu trúc sợi vòng lặp nhấn dệt nổi',
  'Premium contrast loop': 'Sợi vòng lặp tương phản cao cấp',
  'Expressive pattern loop': 'Sợi vòng lặp hoa văn biểu cảm',
  'Refined loop structure': 'Cấu trúc sợi vòng lặp tinh tế',
  'Dynamic loop construction': 'Cấu trúc sợi vòng lặp năng động',
  'Connector pattern loop': 'Sợi vòng lặp hoa văn kết nối',
  'Connector accent loop': 'Sợi vòng lặp nhấn kết nối',
  'Accent loop surface': 'Bề mặt sợi vòng lặp điểm nhấn',
  'Architectural accent loop': 'Sợi vòng lặp nhấn kiến trúc',
  'Directional connector loop': 'Sợi vòng lặp kết nối có định hướng',
  'Organic commercial loop': 'Sợi vòng lặp thương mại hữu cơ',
  'Pattern loop expression': 'Sợi vòng lặp biểu cảm hoa văn',
  'Graphic loop texture': 'Cấu trúc sợi vòng lặp đồ họa',
  'Decorative loop surface': 'Bề mặt sợi vòng lặp trang trí',
  'Topographic loop pattern': 'Hoa văn sợi vòng lặp địa hình',
  'Cultural pattern loop': 'Sợi vòng lặp hoa văn văn hóa',
  'Accent mosaic loop': 'Sợi vòng lặp nhấn Mosaic',
  'Art-inspired loop texture': 'Cấu trúc sợi vòng lặp cảm hứng nghệ thuật',
  'Narrative directional loop': 'Sợi vòng lặp kể chuyện có định hướng',
  'Fluid tonal loop': 'Sợi vòng lặp dòng chảy chuyển tông',
  'Monotone fine loop': 'Sợi vòng lặp đơn sắc mịn',
  'Balanced commercial loop': 'Sợi vòng lặp thương mại cân bằng',
  'Soft tonal loop': 'Sợi vòng lặp chuyển tông mềm',
  'Refined low loop': 'Sợi vòng lặp thấp tinh tế',
  'Soft directional loop': 'Sợi vòng lặp có định hướng mềm',
  'Dense tonal loop': 'Sợi vòng lặp mật độ cao chuyển tông',
  'Transition loop texture': 'Cấu trúc sợi vòng lặp chuyển tiếp',
  'Pattern accent loop': 'Sợi vòng lặp nhấn hoa văn',
  'Medium contrast loop': 'Sợi vòng lặp tương phản trung bình',
  'Structured tonal loop': 'Sợi vòng lặp cấu trúc chuyển tông',
  'Architectural loop texture': 'Cấu trúc sợi vòng lặp kiến trúc',
  'Directional elegant loop': 'Sợi vòng lặp thanh lịch có định hướng',
  'Light modern loop': 'Sợi vòng lặp hiện đại sáng',
  'Balanced monotone loop': 'Sợi vòng lặp đơn sắc cân bằng',
  'Organic loop design': 'Thiết kế sợi vòng lặp hữu cơ',
  'Structural organic loop': 'Sợi vòng lặp cấu trúc hữu cơ',
  'Sleek commercial loop': 'Sợi vòng lặp thương mại mượt mà',
  'Tonal organic texture': 'Cấu trúc hữu cơ chuyển tông',
  'Dense organic loop': 'Sợi vòng lặp hữu cơ mật độ cao',
  'Contrast organic loop': 'Sợi vòng lặp hữu cơ tương phản',
  'Fine organic loop': 'Sợi vòng lặp hữu cơ mịn',

  // Construction
  'Tufted textured loop / carpet tile thương mại': 'Thảm tấm thương mại dệt sợi vòng lặp cấu trúc (Tufted Textured Loop)',
  'Tufted textured loop / carpet tile': 'Thảm tấm thương mại dệt sợi vòng lặp cấu trúc',
  'Multi Level Texture Tufted': 'Dệt cấu trúc sợi vòng lặp nhiều cấp độ',
  'Multi-level texture tufted': 'Dệt cấu trúc sợi vòng lặp nhiều cấp độ',

  // Backing
  'Backed for commercial interior application': 'Đế thảm chuyên dụng cho nội thất thương mại',
  'EcoSquare® and EcoSoft®': 'Đế EcoSquare® hoặc EcoSoft® thân thiện môi trường',
  'Non Woven Polyester Spunbonded': 'Vải không dệt Polyester Spunbonded',

  // Installation
  'Quarter turn / ashlar / monolithic tùy định hướng thiết kế': 'Xoay 90 độ / So le / Đơn hướng tùy thiết kế',

  // UseCase
  'Corporate reception / lounge': 'Sảnh lễ tân doanh nghiệp / Phòng chờ',
  'High traffic business area': 'Khu thương mại mật độ đi lại cao',
  'Open office / brand zone': 'Văn phòng mở / Phân khu thương hiệu',
  'Main flooring concept': 'Ý tưởng mặt sàn chủ đạo',
  'Premium workspace / boardroom': 'Không gian làm việc cao cấp / Phòng họp VIP',
  'Statement feature flooring': 'Sàn điểm nhấn khẳng định vị thế',
  'Transition / feature insert': 'Khu vực chuyển tiếp / Điểm nhấn bổ sung',
  'Architectural highlight flooring': 'Sàn điểm nhấn kiến trúc',
  'Premium zoning / statement floor': 'Phân khu cao cấp / Sàn khẳng định thương hiệu',
  'Creative office / brand reception': 'Văn phòng sáng tạo / Lễ tân thương hiệu',
  'Feature floor / gallery path': 'Sàn điểm nhấn / Lối đi phòng triển lãm',
  'Statement design interior': 'Nội thất thiết kế khẳng định phong cách',
  'Boutique / luxury lounge': 'Cửa hàng thời trang / Phòng chờ sang trọng',
  'Corporate / experience area': 'Văn phòng doanh nghiệp / Khu vực trải nghiệm',
  'Brand-led presentation zone': 'Phân khu giới thiệu thương hiệu',
  'Display / showroom': 'Khu vực trưng bày / Showroom',
  'Feature gallery / statement office': 'Phòng trưng bày chuyên đề / Văn phòng đẳng cấp',
  'Integrated concept flooring': 'Sàn thiết kế theo concept tích hợp',
  'Soft hospitality / feature zone': 'Không gian dịch vụ cao cấp / Phân khu điểm nhấn',
  'Design office / reception': 'Văn phòng thiết kế / Lễ tân',
  'Corporate core / workspace': 'Phân khu trung tâm doanh nghiệp / Không gian làm việc',
  'Premium work zone / meeting': 'Khu làm việc cao cấp / Phòng họp',
  'Corporate front-of-house': 'Khu vực mặt tiền doanh nghiệp',
  'Premium office / hospitality': 'Văn phòng cao cấp / Không gian dịch vụ',
  'Sales gallery / showcase zone': 'Khu trưng bày bán hàng / Phân khu giới thiệu',
  'Transition path / planning strip': 'Lối đi chuyển tiếp / Dải phân làn thiết kế',
  'Design transition / waypoint': 'Chuyển tiếp thiết kế / Lối dẫn hướng',
  'Feature area / focal point': 'Khu vực điểm nhấn / Điểm hội tụ thị giác',
  'Display / circulation': 'Khu vực trưng bày / Lối lưu thông',
  'Integrated planning scheme': 'Layout quy hoạch tích hợp',
  'Executive office / quiet floor': 'Văn phòng điều hành / Sàn yên tĩnh',
  'Premium workspace / meeting zone': 'Không gian làm việc cao cấp / Khu vực hội nghị',
  'Design office / support zone': 'Văn phòng thiết kế / Khu vực hỗ trợ',
  'Design-led interior / office suite': 'Nội thất thiết kế dẫn đầu / Căn hộ văn phòng',
  'Open office / collaborative area': 'Văn phòng mở / Khu vực cộng tác',
  'Open office / hospitality': 'Văn phòng mở / Không gian dịch vụ',
  'Corporate suite / quiet room': 'Căn hộ doanh nghiệp / Phòng yên tĩnh',
  'Quiet executive setting': 'Không gian điều hành yên tĩnh',
  'Feature connector / design strip': 'Dải kết nối điểm nhấn / Dải thiết kế',
  'Feature insert / zoning': 'Điểm nhấn bổ sung / Phân khu chức năng',
  'Premium planning layout': 'Layout quy hoạch cao cấp',
  'Corporate circulation / support zone': 'Lối lưu thông doanh nghiệp / Phân khu hỗ trợ',
  'Contemporary office / gallery': 'Văn phòng đương đại / Phòng triển lãm',
  'Feature monotone flooring': 'Sàn đơn sắc tạo điểm nhấn',
  'Open planning / collaborative suite': 'Quy hoạch không gian mở / Phân khu cộng tác',
  'Reception / luxury office': 'Khu vực lễ tân / Văn phòng hạng sang',
  'Reception / lounge / office core': 'Lễ tân / Phòng chờ / Khu trung tâm văn phòng',
  'Meeting rooms / collaborative': 'Phòng họp / Phân khu cộng tác',
  'Private office / premium zone': 'Văn phòng tư nhân / Phân khu cao cấp',
  'Quiet workstation / library': 'Trạm làm việc yên tĩnh / Thư viện',
  'Executive workspace': 'Không gian làm việc điều hành',
  'High-traffic corridor / public': 'Hành lang mật độ cao / Khu vực công cộng',
  'Design agency / studio': 'Văn phòng thiết kế / Studio sáng tạo',
  'Interactive zone / hub': 'Khu vực tương tác / Trung tâm kết nối',
  'Shared workspace / café': 'Không gian làm việc chia sẻ / Khu café',
  'Office planning / open plan': 'Quy hoạch văn phòng / Mặt bằng mở',
  'Feature flooring / brand zone': 'Phân khu thương hiệu / Sàn điểm nhấn'
};

function translateText(text) {
  if (!text) return text;
  const trimmed = text.trim();
  if (specDictionary[trimmed]) {
    return specDictionary[trimmed];
  }
  return text;
}

async function run() {
  console.log('Logging in to Supabase...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@carpetsinter.vn',
    password: 'admin123'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }
  console.log('Logged in successfully. Beginning static translation...');

  // Fetch collections
  const { data: collections, error: colError } = await supabase
    .from('collections')
    .select('*')
    .eq('status', 'published');

  if (colError) {
    console.error('Error fetching collections:', colError.message);
    return;
  }

  for (const col of collections) {
    console.log(`\nTranslating Collection: ${col.name} (${col.slug})`);
    const trans = collectionTranslations[col.slug];

    if (trans) {
      const { error: colUpdateErr } = await supabase
        .from('collections')
        .update({
          tagline: trans.tagline,
          summary: trans.summary,
          detail: trans.detail,
          quick_facts: trans.quick_facts,
          value_points: trans.value_facts,
          applications: trans.applications
        })
        .eq('id', col.id);

      if (colUpdateErr) {
        console.error('  Error updating collection columns:', colUpdateErr.message);
      } else {
        console.log('  Collection text translated successfully.');
      }
    } else {
      console.log('  No translation defined for this collection slug, skipping collection text updates.');
    }

    // Fetch and translate products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .eq('collection_id', col.id);

    if (prodError) {
      console.error(`  Error fetching products:`, prodError.message);
      continue;
    }

    console.log(`  Translating specs for ${products.length} products...`);
    for (const p of products) {
      const updatedSpec = { ...p.spec };
      if (updatedSpec.construction) updatedSpec.construction = translateText(updatedSpec.construction);
      if (updatedSpec.backing) updatedSpec.backing = translateText(updatedSpec.backing);
      if (updatedSpec.installation) updatedSpec.installation = translateText(updatedSpec.installation);
      if (updatedSpec.pile) updatedSpec.pile = translateText(updatedSpec.pile);
      if (updatedSpec.useCase) updatedSpec.useCase = translateText(updatedSpec.useCase);

      const { error: prodUpdateErr } = await supabase
        .from('products')
        .update({
          spec: updatedSpec
        })
        .eq('id', p.id);

      if (prodUpdateErr) {
        console.error(`    Error updating product ${p.code} spec:`, prodUpdateErr.message);
      }
    }
    console.log(`  Finished translating products for ${col.name}.`);
  }

  console.log('\nStatic translation complete!');
}

run();
