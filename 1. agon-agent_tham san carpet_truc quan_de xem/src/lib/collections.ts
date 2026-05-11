export type Product = {
  code: string
  name: string
  highlights: string[]
  colors?: string[]
}

export type ResourceLink = {
  label: string
  type: 'brochure' | 'spec' | 'guide' | 'portfolio'
  url: string
}

export type ContactInfo = {
  company: string
  hotline: string
  email: string
  address: string
  hours: string
}

export type CollectionItem = {
  id: string
  name: string
  tagline: string
  summary: string
  detail: string
  heroImage: string
  gallery: string[]
  accent: string
  quickFacts: string[]
  applications: string[]
  products: Product[]
  resources: ResourceLink[]
}

export const collections: CollectionItem[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    tagline: 'Breaking Ground · mở ra nền tảng không gian bền vững và trang nhã.',
    summary:
      'Bộ sưu tập Foundation mang ngôn ngữ thiết kế nền tảng, cân bằng giữa tính chuyên nghiệp, độ bền và vẻ đẹp tinh tế cho văn phòng, khách sạn và khu vực đón tiếp.',
    detail:
      'Foundation phù hợp cho chiến lược thiết kế đề cao cảm giác ổn định, sạch sẽ và sang trọng. Các gam màu và texture được lựa chọn để tạo nên một mặt sàn có chiều sâu, giúp không gian ghi dấu ấn ngay từ ánh nhìn đầu tiên nhưng vẫn dễ ứng dụng trên diện rộng.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root-1.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD-04-01-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/shutterstock_331925027-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/IMG_6573-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/Capture.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD02-Origin-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD04-Anchor-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD06-Rebar-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD05-Core-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/FD06.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD02-Origin.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD03-Base.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD04-Anchor.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD05-Core.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD06-Rebar.jpg',
    ],
    accent: '#f2a94b',
    quickFacts: ['Bề mặt thảm tile cao cấp', 'Tạo nền thẩm mỹ ổn định cho không gian hiện đại', 'Phù hợp khu vực làm việc, meeting lounge, showroom'],
    applications: ['Sảnh tiếp khách', 'Văn phòng điều hành', 'Không gian hospitality cao cấp'],
    products: [
      { code: 'FD01', name: 'Root', highlights: ['Tạo cảm giác nền tảng vững chắc', 'Texture mềm, sang và dễ phối vật liệu'], colors: ['Nâu đất', 'Xám ấm'] },
      { code: 'FD02', name: 'Origin', highlights: ['Ngôn ngữ thiết kế tinh gọn', 'Lý tưởng cho layout chuyên nghiệp, cao cấp'] },
      { code: 'FD03', name: 'Base', highlights: ['Giữ nền không gian sâu và sạch', 'Tăng cảm giác giá trị cho nội thất xung quanh'] },
      { code: 'FD04', name: 'Anchor', highlights: ['Hiệu ứng bề mặt mạnh mẽ', 'Tạo điểm tựa thị giác cho toàn bộ concept'] },
      { code: 'FD05', name: 'Core', highlights: ['Tạo cảm giác chắc chắn', 'Nhấn mạnh hình ảnh đầu tư bền vững'] },
      { code: 'FD06', name: 'Rebar', highlights: ['Cá tính rõ nét hơn', 'Giữ vẻ sang trọng trong không gian hiện đại'] },
    ],
    resources: [
      { label: 'Brochure Foundation', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2025/09/Foundation-Collection-by-Carpets-Inter.pdf' },
      { label: 'Spec Sheet Foundation', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/10/Foundation-Spec-Sheet.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
    ],
  },
  {
    id: 'groundwork',
    name: 'Groundwork',
    tagline: 'Nền tảng chuyển động với cấu trúc 50x50 cm linh hoạt, dễ triển khai nhanh.',
    summary:
      'Groundwork là lựa chọn cho các dự án cần tốc độ tiếp cận, bố trí nhanh và vẫn giữ được vẻ lịch thiệp của một bộ sưu tập thương mại cao cấp.',
    detail:
      'Tinh thần của Groundwork nằm ở sự rõ ràng, hiệu quả và khả năng thích ứng mạnh. Bộ sưu tập này giúp nhà đầu tư và đơn vị thiết kế tạo nên mặt sàn đồng nhất, bền vững và hỗ trợ trải nghiệm di chuyển liên tục trong môi trường làm việc hiện đại.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2026/01/GW08.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW03-SC-Rev-copy-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw0.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/04/shutterstock_578214211-crop-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/01/GW08.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/GW07.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw05.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw06.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw04.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw0123.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw0406.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW01.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW02.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW03.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW04.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW05.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW06.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW07.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW08.jpg',
    ],
    accent: '#f3a746',
    quickFacts: ['Tile size 50x50 cm', 'Dễ tiếp cận cho dự án diện tích lớn', 'Tăng hiệu quả thi công và bảo trì'],
    applications: ['Open office', 'Hành lang doanh nghiệp', 'Khu vực vận hành linh hoạt'],
    products: [
      { code: 'GW01', name: 'Contour', highlights: ['Bề mặt mạch lạc', 'Thể hiện tinh thần chuyên nghiệp vững vàng'] },
      { code: 'GW02', name: 'Linework', highlights: ['Gọn gàng, cân bằng', 'Tạo cảm giác đồng nhất cao cấp'] },
      { code: 'GW03', name: 'Transit', highlights: ['Phù hợp các khu vực lưu thông', 'Cho cảm giác vận hành trơn tru'] },
      { code: 'GW04', name: 'Strata', highlights: ['Nhịp điệu bề mặt tự nhiên', 'Tạo chiều sâu cho khu vực làm việc'] },
      { code: 'GW05', name: 'Frame', highlights: ['Tăng độ chỉn chu cho bố cục', 'Hỗ trợ phân vùng nhẹ nhàng'] },
      { code: 'GW06', name: 'Layer', highlights: ['Bề mặt mềm nhưng chắc', 'Phù hợp nhiều phong cách nội thất'] },
      { code: 'GW07', name: 'Axis', highlights: ['Tính ứng dụng cao', 'Nhấn mạnh sự gọn gàng và cao cấp'] },
      { code: 'GW08', name: 'Terrain', highlights: ['Gợi chuyển động nhẹ', 'Giúp mặt sàn giàu cảm xúc hơn'] },
    ],
    resources: [
      { label: 'Brochure Groundwork', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/Groundwork-Brochure-22-07-2025-Ebook.pdf' },
      { label: 'Spec Sheet Groundwork', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/v25-Groundwork.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
    ],
  },
  {
    id: 'aspekt-insight',
    name: 'Aspekt: Insight',
    tagline: 'Một góc nhìn sâu hơn về không gian, nơi texture kể câu chuyện thương hiệu.',
    summary:
      'Aspekt: Insight truyền tải tinh thần đương đại, giàu chiều sâu thị giác và phù hợp với các dự án muốn nhấn mạnh bản sắc thiết kế.',
    detail:
      'Sự hấp dẫn của Insight nằm ở khả năng tạo ra bề mặt tinh tế nhưng không phô trương. Từng lựa chọn trong bộ sưu tập hỗ trợ kiến trúc sư và chủ đầu tư xây dựng trải nghiệm không gian cao cấp, hiện đại và có dấu ấn thẩm mỹ riêng.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2024/10/Insight-1-scaled.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2024/10/Insight-1-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Aspekt-1.png',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Untitled-2-e1728363599398.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Insight-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Untitled-4.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Untitled-2-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKI08.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/01.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/05-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/04.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/01-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/04-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/07.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKI01.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKI02.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKI03.jpg',
    ],
    accent: '#f6b85b',
    quickFacts: ['Thiết kế mang tính đương đại', 'Đề cao chiều sâu ánh nhìn', 'Phù hợp không gian cần bản sắc mạnh'],
    applications: ['Showroom vật liệu', 'Khu vực reception cao cấp', 'Studio thiết kế & sales gallery'],
    products: [
      { code: 'AKI01', name: 'Insight One', highlights: ['Tông màu tinh tế', 'Tạo độ sang trọng tự nhiên cho mặt sàn'] },
      { code: 'AKI02', name: 'Insight Two', highlights: ['Hiệu ứng bề mặt giàu lớp lang', 'Làm nổi bật nội thất cao cấp'] },
      { code: 'AKI03', name: 'Insight Three', highlights: ['Tăng chiều sâu không gian', 'Phù hợp phối cùng ánh sáng ấm'] },
      { code: 'AKI08', name: 'Insight Eight', highlights: ['Điểm nhấn mạnh hơn', 'Tăng cá tính cho khu vực trưng bày'] },
    ],
    resources: [
      { label: 'Brochure Aspekt: Insight', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2024/10/Aspekt-Insight-by-Carpets-Inter.pdf' },
      { label: 'Spec Sheet Aspekt: Insight', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/v25-Aspekt-Insight.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
    ],
  },
  {
    id: 'waterloo',
    name: 'Waterloo',
    tagline: 'Bright Light Big City · sắc thái đô thị sáng rõ, hiện đại và đắt giá.',
    summary:
      'Waterloo được xây dựng cho những không gian muốn thể hiện nhịp sống thành thị, tinh thần đương đại và tiêu chuẩn thẩm mỹ rõ ràng.',
    detail:
      'Bộ sưu tập Waterloo mang cảm hứng thành phố lớn, nơi nhịp chuyển động và ánh sáng kiến tạo nên cảm xúc chuyên nghiệp. Khi đưa vào dự án, Waterloo nâng cấp cảm nhận về chất lượng không gian, đồng thời giữ được tính linh hoạt cho nhiều loại layout.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2025/11/Waterloo-WL201-adjust-scaled.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2025/11/Waterloo-WL201-adjust-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/2.jpeg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/Waterloo.WL203.Random-scaled-e1760409033712.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/5.jpeg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL204.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL202.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/11/WL201.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL205.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/11/WL201-ADJUST-COLOR.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL202-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL203.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL204-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL205-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL206.jpg',
    ],
    accent: '#f0ac48',
    quickFacts: ['Phong vị urban contemporary', '6 mã tiêu biểu dễ triển khai', 'Tạo hình ảnh năng động nhưng vẫn sang trọng'],
    applications: ['Trụ sở công ty', 'Coworking premium', 'Không gian thương mại hiện đại'],
    products: [
      { code: 'WL201', name: 'Waterloo 201', highlights: ['Tạo nền sắc sảo', 'Dễ kết hợp vật liệu kim loại và gỗ tối'] },
      { code: 'WL202', name: 'Waterloo 202', highlights: ['Đem lại cảm giác sáng rõ hơn', 'Phù hợp khu vực tiếp xúc cao'] },
      { code: 'WL203', name: 'Waterloo 203', highlights: ['Nhịp texture đô thị', 'Tăng cảm giác chiều sâu'] },
      { code: 'WL204', name: 'Waterloo 204', highlights: ['Mạnh mẽ, cao cấp', 'Phù hợp làm lựa chọn chủ đạo'] },
      { code: 'WL205', name: 'Waterloo 205', highlights: ['Tinh chỉnh ánh sáng nền', 'Tạo trải nghiệm cao cấp trực tiếp'] },
      { code: 'WL206', name: 'Waterloo 206', highlights: ['Nhấn chất hiện đại', 'Tăng độ chuyên nghiệp cho không gian'] },
    ],
    resources: [
      { label: 'Brochure Waterloo', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2025/10/Waterloo-BLBC-by-Carpets-Inter.pdf' },
      { label: 'Spec Sheet Waterloo', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/10/v25-BLBC-London-Waterloo-EcoSoftEcoSquare.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
    ],
  },
  {
    id: 'architexture-connect',
    name: 'Architexture Connect',
    tagline: 'Kết nối kiến trúc và xúc cảm bằng bề mặt đậm tính thiết kế.',
    summary:
      'Architexture Connect được định vị cho những dự án muốn khẳng định đẳng cấp thiết kế thông qua kết cấu bề mặt khác biệt và giàu tính kết nối.',
    detail:
      'Đây là bộ sưu tập lý tưởng khi mục tiêu không chỉ là lát sàn mà còn là kể câu chuyện thương hiệu. Architexture Connect giúp không gian trở nên tinh vi, có chiều sâu và tạo ra cảm giác đầu tư chỉn chu trong từng chi tiết.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-AC51-Silom-2-scaled-e1713320553884.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2024/04/1-scaled-e1713861484631.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-AC51-Silom-2-scaled-e1713320553884.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC03-AC04-AC-41-1-scaled-e1713322583733.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/dreamstime_l_88475857-Copy-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC07-AC71-FL36-scaled-e1713322322463.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-FL2738-1-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC06-AC61-1-scaled-e1713321299486.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC01-Baku.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC02-Malabar.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC03-Bucharest.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC04-Shanghai.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-2-m-x-97-cm.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC06-Istanbul.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC07-Paris.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC41-JingAn.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC51-Silom.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC61-Taksim.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC71-Montmartre.jpg',
    ],
    accent: '#f3b55c',
    quickFacts: ['Tập trung vào tính kết nối thiết kế', 'Thích hợp không gian thương hiệu mạnh', 'Kết hợp tốt với concept cao cấp hiện đại'],
    applications: ['Sales gallery', 'Không gian trưng bày', 'Văn phòng sáng tạo'],
    products: [
      { code: 'AC01', name: 'Baku', highlights: ['Cân bằng giữa texture và sự gọn gàng', 'Dễ sử dụng trên nhiều mặt bằng'] },
      { code: 'AC02', name: 'Malabar', highlights: ['Gợi cảm giác tự nhiên', 'Tăng độ ấm cho không gian'] },
      { code: 'AC03', name: 'Bucharest', highlights: ['Cá tính rõ rệt', 'Thích hợp khu vực điểm nhấn'] },
      { code: 'AC04', name: 'Shanghai', highlights: ['Hiện đại và tinh vi', 'Tạo độ sang cho khu vực giao tiếp'] },
      { code: 'AC05', name: 'Bangkok', highlights: ['Tính đô thị tinh tế', 'Tạo nhịp điệu sang trọng cho mặt sàn'] },
      { code: 'AC06', name: 'Istanbul', highlights: ['Đậm chất thiết kế', 'Tăng tính nhận diện thương hiệu'] },
      { code: 'AC07', name: 'Paris', highlights: ['Kết nối các vùng chức năng', 'Giúp layout liền mạch hơn'] },
      { code: 'AC51', name: 'Silom', highlights: ['Bề mặt giàu cá tính', 'Nổi bật trong các khu vực điểm nhấn'] },
    ],
    resources: [
      { label: 'Brochure Architexture Connect', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/Architexture-Connect-Collection-by-Carpets-Inter.pdf' },
      { label: 'Spec Sheet Architexture Connect', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/v25-Architexture-Connect.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
    ],
  },
  {
    id: 'ebb-retreat',
    name: 'EBB Retreat',
    tagline: 'Upstream EBB & Flow · cảm hứng nghỉ dưỡng tinh tế cho không gian thương mại.',
    summary:
      'EBB Retreat hướng đến trải nghiệm êm dịu, thư thái nhưng vẫn thể hiện chuẩn mực của một không gian đầu tư bài bản và cao cấp.',
    detail:
      'Bộ sưu tập gợi nhịp chảy tự nhiên, rất phù hợp với những không gian cần cảm giác mềm mại, dễ chịu và có chiều sâu cảm xúc. EBB Retreat giúp người xem cảm nhận được sự chăm chút, giá trị lâu dài và đẳng cấp tinh tế ngay từ bề mặt sàn.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2025/12/EBR04-42-Herringbone-roomscene-1.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2022/08/EB01_EB02.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/04/EB04_EB05.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/04/Blue-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/01/EBR31-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR04-42-Herringbone-roomscene-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR001-05-Random-brick-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/01/EBR22-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/EB03EB04andSM01-e1669097682284.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/01/EBR21-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/01/Mangrove-Herringbone-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/20160901_141152-e1669097741564.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR01-Brook-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR02-Billabong-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR03-Mangrove-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR04-Loch-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR05-Reef-1.jpg',
    ],
    accent: '#e0a04e',
    quickFacts: ['Ngôn ngữ mềm mại, thư giãn', 'Phù hợp hospitality & lounge', 'Giàu giá trị cảm xúc cho người xem'],
    applications: ['Lounge cao cấp', 'Phòng chờ', 'Resort office & hospitality'],
    products: [
      { code: 'EBR01', name: 'Brook', highlights: ['Êm dịu và cân bằng', 'Phù hợp khu vực đón tiếp sang trọng'] },
      { code: 'EBR02', name: 'Billabong', highlights: ['Hiệu ứng mềm', 'Tạo cảm giác nghỉ dưỡng tinh tế'] },
      { code: 'EBR03', name: 'Mangrove', highlights: ['Chuyển động tự nhiên', 'Cho mặt sàn chiều sâu giàu cảm xúc'] },
      { code: 'EBR04', name: 'Loch', highlights: ['Tăng độ ấm và chiều sâu', 'Phù hợp không gian hospitality'] },
      { code: 'EBR05', name: 'Reef', highlights: ['Tạo cá tính nhẹ nhàng', 'Làm giàu trải nghiệm thị giác'] },
      { code: 'EBR21', name: 'Retreat 21', highlights: ['Màu sắc dịu', 'Phù hợp không gian nghỉ và tiếp khách'] },
      { code: 'EBR22', name: 'Retreat 22', highlights: ['Tinh chỉnh chiều sâu ánh sáng', 'Mang lại sự ấm áp tinh tế'] },
      { code: 'EBR31', name: 'Flow 31', highlights: ['Nhịp bề mặt tự nhiên', 'Tăng cảm giác sang trọng mềm'] },
    ],
    resources: [
      { label: 'Spec Sheet Upstream EBB & Flow', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/v25-Upstream-EBB-Flow.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/03/EcoSoftCarpetTileInstallationGuideline-11.pdf' },
      { label: 'Brochure EcoSoft', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2023/03/EcoSoftBrochurebyCarpetsInter-4.pdf' },
    ],
  },
  {
    id: 'discover',
    name: 'Discover',
    tagline: 'Take a Journey of Discovery · mỗi mã thiết kế là một câu chuyện thương hiệu riêng.',
    summary:
      'Discover là bộ sưu tập đa dạng, nổi bật với nhiều mẫu mã giàu cá tính, phù hợp cho khách hàng muốn lựa chọn nhanh nhưng vẫn đạt được hiệu ứng thẩm mỹ cao.',
    detail:
      'Discover mở ra nhiều khả năng kể chuyện cho không gian: từ chiều sâu tự nhiên, đường nét thủ công đến cảm hứng địa hình và nghệ thuật. Đây là lựa chọn rất mạnh cho chiến lược bán hàng nhấn vào sự phong phú, cảm hứng và giá trị trực tiếp mà khách hàng có thể hình dung ngay.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2023/05/DV200_202-e1684310233612.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2023/04/DV300-DV201.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/05/DV100_DV102.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/04/shutterstock_1101171464-ใหม่-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/05/DV200_202-e1684310233612.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/WATERFALL-DV-900.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/CAVE-DV100-and-CALLIGRAPHY-DV102.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/MOUNTAIN-DV200-and-MOSAIC-DV202.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV100CAVE..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV102..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV103..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV104..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV200MOUNTAIN..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV201..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV202..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV300..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV900..jpg',
    ],
    accent: '#ffb049',
    quickFacts: ['Danh mục phong phú, dễ lựa chọn nhanh', 'Nhiều mã thiết kế cho từng câu chuyện không gian', 'Phù hợp tư vấn bán hàng trực tiếp'],
    applications: ['Văn phòng sáng tạo', 'Không gian bán lẻ', 'Khu vực trải nghiệm thương hiệu'],
    products: [
      { code: 'DV100', name: 'Cave', highlights: ['Cảm hứng tự nhiên', 'Mang lại nền sang trọng và ấm'] },
      { code: 'DV102', name: 'Calligraphy', highlights: ['Nhịp nét mềm như thư pháp', 'Tăng tính nghệ thuật cho mặt sàn'] },
      { code: 'DV103', name: 'Tattoo', highlights: ['Cá tính rõ nét', 'Phù hợp không gian muốn tạo dấu ấn'] },
      { code: 'DV104', name: 'Henna', highlights: ['Chi tiết tinh tế', 'Mang sắc thái thủ công cao cấp'] },
      { code: 'DV200', name: 'Mountain', highlights: ['Tạo chiều sâu địa hình', 'Giúp không gian vững và sang'] },
      { code: 'DV201', name: 'Batik', highlights: ['Chất cảm văn hoá đương đại', 'Gia tăng độ độc đáo cho dự án'] },
      { code: 'DV202', name: 'Mosaic', highlights: ['Nhịp điệu trang trí mạnh', 'Tăng sức hút ở khu vực trưng bày'] },
      { code: 'DV300', name: 'Storyline', highlights: ['Tạo cảm giác kể chuyện', 'Phù hợp điểm chạm thương hiệu'] },
      { code: 'DV900', name: 'Waterfall', highlights: ['Mềm mại như dòng chảy', 'Tạo cảm giác thư giãn cao cấp'] },
    ],
    resources: [
      { label: 'Brochure Discover', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/Discover-Collection-by-Carpets-Inter-Sept-2025.pdf' },
      { label: 'Spec Sheet Discover', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/v25-Discover.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
    ],
  },
  {
    id: 'flatlands',
    name: 'Flatlands',
    tagline: 'Sự phẳng lặng tinh tế, tối giản nhưng để lại chiều sâu thị giác bền lâu.',
    summary:
      'Flatlands phù hợp với chiến lược thiết kế tối giản sang trọng, nơi mọi chi tiết đều được tiết chế để làm nổi bật chất lượng tổng thể của không gian.',
    detail:
      'Bộ sưu tập này phát huy sức mạnh trong các không gian cần cảm giác gọn, sạch, tinh tế và trưởng thành. Flatlands giúp các dự án thương mại đạt được hình ảnh chỉn chu, cao cấp mà không cần quá nhiều chi tiết phô trương.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2023/04/FL0104242528333738-scaled.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2023/04/FL0104242528333738-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/01/FL0104363839-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/11/Flatlands-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/06/FL0110242837.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/FL11-with-Breaking-Waves-Collection.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/Flatlands-is-an-overall-texture-that-is-ideal-for-a-monotone-look-on-the-floor.-Flatlands-can-be-used-by-itself-or-coordinate-it-with-the-other-patterns..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/FL02-FL11-and-FL15-e1668747237702.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL27YilanReplaceFL23NM005-2150x50cm-3.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL28StoraReplaceFL06NM007-2150x50cm-3.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL30MessaraNM009-2250X50CM-1.jpeg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL04Omo-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL29NurraReplaceFL09NM020-2150X50CM-1.jpeg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL01Gola-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL25ManitotoReplacePH02NM014-2150x50cm-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL02Ganges-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL11Lena-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL15Yukon-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL36Niger-1.jpg',
    ],
    accent: '#f0b25b',
    quickFacts: ['Thiết kế tinh giản, thanh lịch', 'Có tùy chọn Limited Stock/Made to Order Colors', 'Rất phù hợp không gian cao cấp tiết chế'],
    applications: ['Office suite', 'Không gian điều hành', 'Boutique showroom'],
    products: [
      { code: 'FL01', name: 'Gola', highlights: ['Tông nền sạch và sâu', 'Nâng giá trị trực quan cho nội thất'] },
      { code: 'FL02', name: 'Ganges', highlights: ['Tối giản nhưng không đơn điệu', 'Tạo cảm giác trưởng thành'] },
      { code: 'FL04', name: 'Omo', highlights: ['Texture mảnh và tinh tế', 'Phù hợp nhiều không gian hiện đại'] },
      { code: 'FL11', name: 'Lena', highlights: ['Dễ phối đa vật liệu', 'Phù hợp nhiều diện tích'] },
      { code: 'FL15', name: 'Yukon', highlights: ['Giữ nền sâu và êm', 'Tăng cảm giác sang trọng nền tảng'] },
      { code: 'FL27', name: 'Yilan', highlights: ['Tạo cá tính nhẹ', 'Phù hợp khu vực muốn điểm nhấn tiết chế'] },
      { code: 'FL28', name: 'Stora', highlights: ['Cân bằng tốt giữa sáng và tối', 'Dễ dùng trong bố cục cao cấp'] },
      { code: 'FL29', name: 'Nurra', highlights: ['Gọn gàng, sâu sắc', 'Tạo sự chỉn chu rõ rệt'] },
      { code: 'FL30', name: 'Messara', highlights: ['Nét tối giản mạnh', 'Thích hợp concept trưởng thành'] },
      { code: 'FL36', name: 'Niger', highlights: ['Nhấn nhẹ texture', 'Đem lại sự sang trọng tinh vi'] },
    ],
    resources: [
      { label: 'Brochure Flatlands', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2024/02/Flatlands-by-Carpets-Inter.pdf' },
      { label: 'Spec Sheet Flatlands', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/v25-Flatlands.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
      { label: 'Lưu ý mối nối Modular Carpet Tile', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/06/Visibility-of-Modular-Carpet-Tile-Joints.pdf' },
    ],
  },
  {
    id: 'aspekt-vue',
    name: 'Aspekt: Vue',
    tagline: 'Một tầm nhìn tinh tế, cân bằng giữa nghệ thuật thị giác và giá trị ứng dụng.',
    summary:
      'Aspekt: Vue tạo nên ngôn ngữ mặt sàn mềm mại, hiện đại và sang trọng, phù hợp với những công trình cần dấu ấn thẩm mỹ rõ rệt nhưng vẫn dễ tiếp cận.',
    detail:
      'Vue là lựa chọn lý tưởng để tạo ấn tượng trực tiếp cho khách hàng khi bước vào không gian. Bề mặt vừa thanh mảnh vừa có độ sâu, giúp công trình thể hiện hình ảnh đẳng cấp và có gu thiết kế rõ ràng.',
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2024/10/Vue-e1728381708911.jpg',
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2024/10/Vue-e1728381708911.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-1-e1730109126599.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-2-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-5.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-6.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV02-Imagine-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV03-Clarity-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV01-Ambition-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV02-Imagine-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV01-AMBITION.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV02-IMAGINE.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV03-CLARITY.jpg',
    ],
    accent: '#ffc169',
    quickFacts: ['Hiện đại, thanh mảnh, giàu chiều sâu', 'Tạo ấn tượng trực tiếp cho người xem', 'Rất hợp phong cách luxury tối giản'],
    applications: ['Sảnh tiếp đón', 'Showroom thương hiệu', 'Không gian tư vấn cao cấp'],
    products: [
      { code: 'AKV01', name: 'Ambition', highlights: ['Đường nét tinh tế', 'Tăng độ thanh lịch cho toàn bộ không gian'] },
      { code: 'AKV02', name: 'Imagine', highlights: ['Gợi chiều sâu nhẹ', 'Mang lại cảm giác cao cấp dễ nhận thấy'] },
      { code: 'AKV03', name: 'Clarity', highlights: ['Phù hợp các dự án cần điểm nhấn thẩm mỹ', 'Giữ được tính ứng dụng cao'] },
    ],
    resources: [
      { label: 'Brochure Aspekt: Vue', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2024/10/Aspekt-Vue-by-Carpets-Inter.pdf' },
      { label: 'Spec Sheet Aspekt: Vue', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/v25-Aspekt-Vue.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSoft-Carpet-Tile-Installation-Guideline-Nov-2023-AL.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
    ],
  },
]

export const featuredResources: ResourceLink[] = [
  { label: 'Mix & Match Portfolio', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/MixMatchbyCarpetsInterFeb2020LR.pdf' },
  { label: 'Custom Design Portfolio', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/CarpetTileCustomDesignPortfolioAug2021lr.pdf' },
]

export const contactInfo: ContactInfo = {
  company: 'Luxury Carpet Collections Việt Nam',
  hotline: '0909 888 668',
  email: 'sales@luxurycarpet.vn',
  address: 'Showroom tư vấn vật liệu cao cấp, Quận 1, TP. Hồ Chí Minh',
  hours: '08:30 - 18:30 | Thứ 2 - Thứ 7',
}
