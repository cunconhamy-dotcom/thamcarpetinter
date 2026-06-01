import { supabase } from './supabase'

export type ProductSpec = {
  pile?: string
  construction?: string
  backing?: string
  size?: string
  useCase?: string
  installation?: string
}

export type Product = {
  code: string
  name: string
  highlights: string[]
  colors?: string[]
  image?: string
  spec: ProductSpec
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
  productImages: string[]
  accent: string
  quickFacts: string[]
  applications: string[]
  valuePoints: string[]
  products: Product[]
  resources: ResourceLink[]
}

const commonSpecs = {
  construction: 'Tufted textured loop / carpet tile thương mại',
  backing: 'Backed for commercial interior application',
  size: '50 x 50 cm',
  installation: 'Quarter turn / ashlar / monolithic tùy định hướng thiết kế',
}

export const collectionHeroRotator = [
  {
    id: 'by-the-shore',
    name: 'By The Shore',
    image: 'https://carpetsinter.com/wp-content/uploads/2026/05/SHR04-ปรับลาย-2-scaled-e1778148683103.jpg',
    accent: '#f2a94b',
    tagline: 'The shoreline is where things naturally come together.',
  },
  {
    id: 'groundwork',
    name: 'Groundwork',
    image: 'https://carpetsinter.com/wp-content/uploads/2024/10/Insight-1-scaled.jpg',
    accent: '#f3a746',
    tagline: 'Nền tảng chuyển động với cấu trúc 50x50 cm linh hoạt, dễ triển khai nhanh.',
  },
  {
    id: 'flatlands',
    name: 'Flatlands',
    image: 'https://carpetsinter.com/wp-content/uploads/2023/04/FL0104242528333738-scaled.jpg',
    accent: '#f0b25b',
    tagline: 'Sự phẳng lặng tinh tế, tối giản nhưng để lại chiều sâu thị giác bền lâu.',
  },
  {
    id: 'waterloo',
    name: 'Waterloo',
    image: 'https://carpetsinter.com/wp-content/uploads/2025/11/Waterloo-WL201-adjust-scaled.jpg',
    accent: '#f0ac48',
    tagline: 'Bright Light Big City · sắc thái đô thị sáng rõ, hiện đại và đắt giá.',
  },
  {
    id: 'architexture-connect',
    name: 'Architexture Connect',
    image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-AC51-Silom-2-scaled-e1713320553884.jpg',
    accent: '#f3b55c',
    tagline: 'Kết nối kiến trúc và xúc cảm bằng bề mặt đậm tính thiết kế.',
  },
  {
    id: 'reuso',
    name: 'Reuso',
    image: 'https://carpetsinter.com/wp-content/uploads/2022/08/RS05-07-09-1-scaled.jpg',
    accent: '#ffc169',
    tagline: 'Khả năng trộn lẫn màu sắc linh hoạt, mang lại bề mặt hoàn thiện độc đáo và thân thiện môi trường.',
  },
  {
    id: 'foundation',
    name: 'Foundation',
    image: 'https://carpetsinter.com/wp-content/uploads/2025/09/FD-04-01-scaled.jpg',
    accent: '#ffb049',
    tagline: 'Stability today opens the door for creativity and excellence tomorrow.',
  },
  {
    id: 'aspekt-insight',
    name: 'Aspekt: Insight',
    image: 'https://carpetsinter.com/wp-content/uploads/2024/04/1-scaled-e1713861484631.jpg',
    accent: '#f6b85b',
    tagline: 'Một góc nhìn sâu hơn về không gian, nơi texture kể câu chuyện thương hiệu.',
  },
  {
    id: 'mesa-alto',
    name: 'Mesa Alto',
    image: 'https://carpetsinter.com/wp-content/uploads/2023/05/MS27_horizontal.jpg',
    accent: '#e0a04e',
    tagline: 'Isolated, flat-topped elevation, ridge or hill, surrounded on all sides by steep escarpments.',
  },
]

export async function fetchCollections(): Promise<CollectionItem[]> {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Lỗi khi tải bộ sưu tập từ Supabase:', error)
      return collections // Fallback mock
    }

    if (data && data.length > 0) {
      // Map DB schema to frontend CollectionItem interface
      return data.map((item: any) => {
        // Find matching mock item to fill in complex nested arrays like 'products' which aren't in DB yet
        // In a real complete DB schema, products would be a separate table.
        const mockMatch = collections.find(c => c.id === item.slug)
        return {
          id: item.slug,
          name: item.name,
          tagline: mockMatch?.tagline || item.tagline || '',
          summary: mockMatch?.summary || item.summary || '',
          detail: mockMatch?.detail || item.detail || '',
          heroImage: item.hero_image || '',
          gallery: mockMatch?.gallery || [],
          productImages: mockMatch?.productImages || [],
          accent: item.accent || '#f29d38',
          quickFacts: mockMatch?.quickFacts || item.quick_facts || [],
          applications: mockMatch?.applications || item.applications || [],
          valuePoints: mockMatch?.valuePoints || item.value_points || [],
          products: mockMatch?.products || [],
          resources: mockMatch?.resources || [],
        }
      })
    }

    return collections // Fallback if no data
  } catch (err) {
    console.error('Exception fetching collections:', err)
    return collections // Fallback mock
  }
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
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD02-Origin.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD03-Base.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD04-Anchor.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD05-Core.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD06-Rebar.jpg',
    ],
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2025/09/Foundation.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD02-Origin-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD04-Anchor-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD05-Core-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD06-Rebar-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/FD06.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD-04-01-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/IMG_6573-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/Image-02-FD01Checkerboard-scaled-e1758188545674.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/FD04-Anchor-1.jpg',
    ],
    accent: '#f2a94b',
    quickFacts: ['Bề mặt thảm tile cao cấp', 'Tạo nền thẩm mỹ ổn định cho không gian hiện đại', 'Phù hợp khu vực làm việc, meeting lounge, showroom'],
    applications: ['Sảnh tiếp khách', 'Văn phòng điều hành', 'Không gian hospitality cao cấp'],
    valuePoints: ['Tạo nền không gian ổn định, sang trọng và dễ phối với nội thất cao cấp.', 'Giúp công trình giữ hình ảnh chuyên nghiệp, bền đẹp và có chiều sâu thị giác rõ ràng.', 'Phù hợp cho dự án cần giải pháp an toàn nhưng vẫn đủ khác biệt để nâng giá trị cảm nhận.'],
    products: [
      { code: 'FD01', name: 'Root', highlights: ['Tạo cảm giác nền tảng vững chắc', 'Texture mềm, sang và dễ phối vật liệu'], colors: ['Nâu đất', 'Xám ấm'], image: 'https://carpetsinter.com/wp-content/uploads/2025/09/FD01-Root.jpg', spec: { ...commonSpecs, pile: 'Textured low loop', useCase: 'Reception / lounge / office core' } },
      { code: 'FD02', name: 'Origin', highlights: ['Ngôn ngữ thiết kế tinh gọn', 'Lý tưởng cho layout chuyên nghiệp, cao cấp'], image: 'https://carpetsinter.com/wp-content/uploads/2025/09/FD02-Origin.jpg', spec: { ...commonSpecs, pile: 'Balanced loop texture', useCase: 'Executive office / meeting zone' } },
      { code: 'FD03', name: 'Base', highlights: ['Giữ nền không gian sâu và sạch', 'Tăng cảm giác giá trị cho nội thất xung quanh'], image: 'https://carpetsinter.com/wp-content/uploads/2025/09/FD03-Base.jpg', spec: { ...commonSpecs, pile: 'Dense loop construction', useCase: 'Corporate circulation / support area' } },
      { code: 'FD04', name: 'Anchor', highlights: ['Hiệu ứng bề mặt mạnh mẽ', 'Tạo điểm tựa thị giác cho toàn bộ concept'], image: 'https://carpetsinter.com/wp-content/uploads/2025/09/FD04-Anchor.jpg', spec: { ...commonSpecs, pile: 'Accent loop pattern', useCase: 'Feature zone / transition zone' } },
      { code: 'FD05', name: 'Core', highlights: ['Tạo cảm giác chắc chắn', 'Nhấn mạnh hình ảnh đầu tư bền vững'], image: 'https://carpetsinter.com/wp-content/uploads/2025/09/FD05-Core.jpg', spec: { ...commonSpecs, pile: 'Commercial loop surface', useCase: 'Open workspace / workstation area' } },
      { code: 'FD06', name: 'Rebar', highlights: ['Cá tính rõ nét hơn', 'Giữ vẻ sang trọng trong không gian hiện đại'], image: 'https://carpetsinter.com/wp-content/uploads/2025/09/FD06-Rebar.jpg', spec: { ...commonSpecs, pile: 'Directional loop texture', useCase: 'Architectural statement flooring' } },
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
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2025/04/GW01-Pinnacle.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/04/GW02-Elevation.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/04/GW03-Altitude.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/04/GW04-Stratum.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/04/GW05-Level.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/04/GW06-Bedrock.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/09/GW07-Blueprint.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/GW08-Terrain.jpg',
    ],
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw0123.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/GW03-SC-Rev-copy-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw04.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw05.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw06.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw0406.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/GW07.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/01/GW08.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/04/shutterstock_578214211-crop-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/03/gw-1.jpg',
    ],
    accent: '#f3a746',
    quickFacts: ['Tile size 50x50 cm', 'Dễ tiếp cận cho dự án diện tích lớn', 'Tăng hiệu quả thi công và bảo trì'],
    applications: ['Open office', 'Hành lang doanh nghiệp', 'Khu vực vận hành linh hoạt'],
    valuePoints: ['Tăng hiệu quả triển khai cho mặt bằng lớn nhờ cấu trúc rõ ràng và khả năng ứng dụng linh hoạt.', 'Mang lại bề mặt hiện đại, gọn gàng, hỗ trợ vận hành liên tục trong không gian làm việc.', 'Giúp chủ đầu tư cân bằng giữa tốc độ hoàn thiện, thẩm mỹ và cảm giác chuyên nghiệp tổng thể.'],
    products: [
      { code: 'GW01', name: 'Pinnacle', highlights: ['Bề mặt mạch lạc', 'Thể hiện tinh thần chuyên nghiệp vững vàng'], image: 'https://carpetsinter.com/wp-content/uploads/2025/04/GW01-Pinnacle.jpg', spec: { ...commonSpecs, pile: 'Structured loop', useCase: 'Office planning / open plan' } },
      { code: 'GW02', name: 'Elevation', highlights: ['Gọn gàng, cân bằng', 'Tạo cảm giác đồng nhất cao cấp'], image: 'https://carpetsinter.com/wp-content/uploads/2025/04/GW02-Elevation.jpg', spec: { ...commonSpecs, pile: 'Linear loop texture', useCase: 'Meeting / work zone' } },
      { code: 'GW03', name: 'Altitude', highlights: ['Phù hợp các khu vực lưu thông', 'Cho cảm giác vận hành trơn tru'], image: 'https://carpetsinter.com/wp-content/uploads/2025/04/GW03-Altitude.jpg', spec: { ...commonSpecs, pile: 'Directional loop', useCase: 'Circulation area / corridor' } },
      { code: 'GW04', name: 'Stratum', highlights: ['Nhịp điệu bề mặt tự nhiên', 'Tạo chiều sâu cho khu vực làm việc'], image: 'https://carpetsinter.com/wp-content/uploads/2025/04/GW04-Stratum.jpg', spec: { ...commonSpecs, pile: 'Textured loop', useCase: 'Workspace / collaboration zone' } },
      { code: 'GW05', name: 'Level', highlights: ['Tăng độ chỉn chu cho bố cục', 'Hỗ trợ phân vùng nhẹ nhàng'], image: 'https://carpetsinter.com/wp-content/uploads/2025/04/GW05-Level.jpg', spec: { ...commonSpecs, pile: 'Fine loop surface', useCase: 'Support zone / planning area' } },
      { code: 'GW06', name: 'Bedrock', highlights: ['Bề mặt mềm nhưng chắc', 'Phù hợp nhiều phong cách nội thất'], image: 'https://carpetsinter.com/wp-content/uploads/2025/04/GW06-Bedrock.jpg', spec: { ...commonSpecs, pile: 'Dense commercial loop', useCase: 'Core area / office circulation' } },
      { code: 'GW07', name: 'Blueprint', highlights: ['Tính ứng dụng cao', 'Nhấn mạnh sự gọn gàng và cao cấp'], image: 'https://carpetsinter.com/wp-content/uploads/2025/09/GW07-Blueprint.jpg', spec: { ...commonSpecs, pile: 'Balanced line texture', useCase: 'Design-led office / showroom' } },
      { code: 'GW08', name: 'Terrain', highlights: ['Gợi chuyển động nhẹ', 'Giúp mặt sàn giàu cảm xúc hơn'], image: 'https://carpetsinter.com/wp-content/uploads/2025/12/GW08-Terrain.jpg', spec: { ...commonSpecs, pile: 'Directional expressive loop', useCase: 'Feature flooring / statement path' } },
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
    heroImage: 'https://carpetsinter.com/wp-content/uploads/2024/10/01.jpg',
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2024/10/01-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/02.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/03.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/04-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/05.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/06.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/07.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/08-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/09.jpg',
    ],
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2024/10/Untitled-2-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKI08.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/01.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/05-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/04.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Insight-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Untitled-4.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Insight-1-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Untitled-2-e1728363599398.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/06/seo.jpg',
    ],
    accent: '#f6b85b',
    quickFacts: ['Thiết kế mang tính đương đại', 'Đề cao chiều sâu ánh nhìn', 'Phù hợp không gian cần bản sắc mạnh'],
    applications: ['Showroom vật liệu', 'Khu vực reception cao cấp', 'Studio thiết kế & sales gallery'],
    valuePoints: ['Làm nổi bật chiều sâu vật liệu và cá tính không gian ngay từ điểm chạm đầu tiên.', 'Giúp kiến trúc sư và nhà thiết kế chọn đúng nhịp màu, đúng cấu trúc bề mặt cho concept hiện đại.', 'Tăng khả năng thuyết phục khách hàng bằng hình ảnh tinh tế, sang trọng và có định hướng thẩm mỹ rõ ràng.'],
    products: [
      { code: 'AKI01', name: 'Perceive', highlights: ['Tông màu tinh tế', 'Tạo độ sang trọng tự nhiên cho mặt sàn'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/01-1.jpg', spec: { ...commonSpecs, pile: 'Fine directional loop', useCase: 'Reception / design-led workspace' } },
      { code: 'AKI04', name: 'Aware', highlights: ['Nhịp màu cân bằng', 'Dễ ứng dụng cho không gian hiện đại'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/04-1.jpg', spec: { ...commonSpecs, pile: 'Commercial loop texture', useCase: 'Workspace / support zone' } },
      { code: 'AKI07', name: 'Resonance', highlights: ['Giữ nhịp thị giác tinh tế', 'Phù hợp thiết kế tối giản có chiều sâu'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/07.jpg', spec: { ...commonSpecs, pile: 'Directional loop surface', useCase: 'Circulation / planning zone' } },
      { code: 'AKI02', name: 'Enlight', highlights: ['Hiệu ứng bề mặt giàu lớp lang', 'Làm nổi bật nội thất cao cấp'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/02.jpg', spec: { ...commonSpecs, pile: 'Layered loop texture', useCase: 'High-end corporate interior' } },
      { code: 'AKI05', name: 'Inspire', highlights: ['Bề mặt giàu chất liệu', 'Tăng cảm giác đầu tư chỉn chu'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/05.jpg', spec: { ...commonSpecs, pile: 'Textured tonal loop', useCase: 'Corporate workspace / executive area' } },
      { code: 'AKI08', name: 'Empower', highlights: ['Điểm nhấn mạnh hơn', 'Tăng cá tính cho khu vực trưng bày'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/08-1.jpg', spec: { ...commonSpecs, pile: 'Bold directional loop', useCase: 'Showroom / statement path' } },
      { code: 'AKI03', name: 'Vision', highlights: ['Tăng chiều sâu không gian', 'Phù hợp phối cùng ánh sáng ấm'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/03.jpg', spec: { ...commonSpecs, pile: 'Balanced pattern loop', useCase: 'Studio / presentation zone' } },
      { code: 'AKI06', name: 'Intuit', highlights: ['Tạo nền trung tính cao cấp', 'Hỗ trợ nội thất nổi bật hơn'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/06.jpg', spec: { ...commonSpecs, pile: 'Dense loop construction', useCase: 'Workspace / support area' } },
      { code: 'AKI09', name: 'Drive', highlights: ['Kết thúc bảng màu bằng chiều sâu mạnh', 'Thể hiện bản sắc thiết kế rõ ràng'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/09.jpg', spec: { ...commonSpecs, pile: 'Expressive premium loop', useCase: 'Feature flooring / sales gallery' } },
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
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2025/11/WL201-ADJUST-COLOR.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL202-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL203.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL204-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL205-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL206.jpg',
    ],
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2025/11/WL201.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL202.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL204.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/WL205.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/11/Waterloo-WL201-adjust-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/10/Waterloo.WL203.Random-scaled-e1760409033712.jpg',
      '/images/waterloo/room-1.png',
      '/images/waterloo/room-2.png',
      '/images/waterloo/room-3.png',
      '/images/waterloo/room-4.png',
    ],
    accent: '#f0ac48',
    quickFacts: ['Phong vị urban contemporary', '6 mã tiêu biểu dễ triển khai', 'Tạo hình ảnh năng động nhưng vẫn sang trọng'],
    applications: ['Trụ sở công ty', 'Coworking premium', 'Không gian thương mại hiện đại'],
    valuePoints: ['Mang tinh thần đô thị hiện đại vào mặt sàn, tạo cảm giác chuyên nghiệp và năng động.', 'Giúp không gian thương mại, văn phòng và khu tiếp khách trở nên sắc sảo, có chiều sâu hơn.', 'Là lựa chọn mạnh cho dự án cần gây ấn tượng trực tiếp nhưng vẫn giữ sự tinh tế lâu dài.'],
    products: [
      { code: 'WL201', name: 'Waterloo 201', highlights: ['Tạo nền sắc sảo', 'Dễ kết hợp vật liệu kim loại và gỗ tối'], image: 'https://carpetsinter.com/wp-content/uploads/2025/11/WL201-ADJUST-COLOR.jpg', spec: { ...commonSpecs, pile: 'Urban directional loop', useCase: 'Corporate reception / lounge' } },
      { code: 'WL202', name: 'Waterloo 202', highlights: ['Đem lại cảm giác sáng rõ hơn', 'Phù hợp khu vực tiếp xúc cao'], image: 'https://carpetsinter.com/wp-content/uploads/2025/10/WL202-1.jpg', spec: { ...commonSpecs, pile: 'Fine commercial loop', useCase: 'High traffic business area' } },
      { code: 'WL203', name: 'Waterloo 203', highlights: ['Nhịp texture đô thị', 'Tăng cảm giác chiều sâu'], image: 'https://carpetsinter.com/wp-content/uploads/2025/10/WL203.jpg', spec: { ...commonSpecs, pile: 'Structured loop texture', useCase: 'Open office / brand zone' } },
      { code: 'WL204', name: 'Waterloo 204', highlights: ['Mạnh mẽ, cao cấp', 'Phù hợp làm lựa chọn chủ đạo'], image: 'https://carpetsinter.com/wp-content/uploads/2025/10/WL204-1.jpg', spec: { ...commonSpecs, pile: 'Dense directional loop', useCase: 'Main flooring concept' } },
      { code: 'WL205', name: 'Waterloo 205', highlights: ['Tinh chỉnh ánh sáng nền', 'Tạo trải nghiệm cao cấp trực tiếp'], image: 'https://carpetsinter.com/wp-content/uploads/2025/10/WL205-1.jpg', spec: { ...commonSpecs, pile: 'Refined tonal loop', useCase: 'Premium workspace / boardroom' } },
      { code: 'WL206', name: 'Waterloo 206', highlights: ['Nhấn chất hiện đại', 'Tăng độ chuyên nghiệp cho không gian'], image: 'https://carpetsinter.com/wp-content/uploads/2025/10/WL206.jpg', spec: { ...commonSpecs, pile: 'Directional statement loop', useCase: 'Statement feature flooring' } },
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
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC01-Baku.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC02-Malabar.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC03-Bucharest.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC04-Shanghai.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-2-m-x-97-cm.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC06-Istanbul.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC07-Paris.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC51-Silom.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC61-Vefa.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC71-SoMa.jpg',
    ],
    gallery: [
      '/images/architexture-connect/ac-scene-1.png',
      '/images/architexture-connect/ac-scene-2.png',
      '/images/architexture-connect/ac-scene-3.png',
      '/images/architexture-connect/ac-scene-4.png',
      '/images/architexture-connect/ac-scene-5.png',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-AC51-Silom-2-scaled-e1713320553884.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC03-AC04-AC-41-1-scaled-e1713322583733.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/Architexture-Connect-01-scaled-e1723717295548.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-FL2738-1-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/04/AC06-AC61-1-scaled-e1713321299486.jpg',
    ],
    accent: '#f3b55c',
    quickFacts: ['Tập trung vào tính kết nối thiết kế', 'Thích hợp không gian thương hiệu mạnh', 'Kết hợp tốt với concept cao cấp hiện đại'],
    applications: ['Sales gallery', 'Không gian trưng bày', 'Văn phòng sáng tạo'],
    valuePoints: ['Tăng sức mạnh nhận diện thương hiệu bằng bề mặt sàn giàu cấu trúc và ngôn ngữ thiết kế riêng.', 'Hỗ trợ phân vùng không gian mềm mại mà vẫn liền mạch, sang trọng và hiện đại.', 'Tạo hiệu ứng trình bày thuyết phục cho showroom, sales gallery và văn phòng sáng tạo.'],
    products: [
      { code: 'AC01', name: 'Baku', highlights: ['Cân bằng giữa texture và sự gọn gàng', 'Dễ sử dụng trên nhiều mặt bằng'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC01-Baku.jpg', spec: { ...commonSpecs, pile: 'Architectural loop texture', useCase: 'Design office / reception' } },
      { code: 'AC02', name: 'Malabar', highlights: ['Gợi cảm giác tự nhiên', 'Tăng độ ấm cho không gian'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC02-Malabar.jpg', spec: { ...commonSpecs, pile: 'Soft directional loop', useCase: 'Lounge / quiet workspace' } },
      { code: 'AC03', name: 'Bucharest', highlights: ['Cá tính rõ rệt', 'Thích hợp khu vực điểm nhấn'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC03-Bucharest.jpg', spec: { ...commonSpecs, pile: 'Expressive pattern loop', useCase: 'Feature flooring / brand zone' } },
      { code: 'AC04', name: 'Shanghai', highlights: ['Hiện đại và tinh vi', 'Tạo độ sang cho khu vực giao tiếp'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC04-Shanghai.jpg', spec: { ...commonSpecs, pile: 'Refined loop structure', useCase: 'Corporate front-of-house' } },
      { code: 'AC05', name: 'Bangkok', highlights: ['Tính đô thị tinh tế', 'Tạo nhịp điệu sang trọng cho mặt sàn'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC05-Bangkok-2-m-x-97-cm.jpg', spec: { ...commonSpecs, pile: 'Urban directional loop', useCase: 'Premium office / hospitality' } },
      { code: 'AC06', name: 'Istanbul', highlights: ['Đậm chất thiết kế', 'Tăng tính nhận diện thương hiệu'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC06-Istanbul.jpg', spec: { ...commonSpecs, pile: 'Dynamic loop construction', useCase: 'Sales gallery / showcase zone' } },
      { code: 'AC07', name: 'Paris', highlights: ['Kết nối các vùng chức năng', 'Giúp layout liền mạch hơn'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC07-Paris.jpg', spec: { ...commonSpecs, pile: 'Connector pattern loop', useCase: 'Transition path / planning strip' } },
      { code: 'AC41', name: 'JingAn', highlights: ['Nhấn sắc độ chuyển tiếp', 'Tạo liên kết tinh tế giữa các khu chức năng'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC41-JingAn.jpg', spec: { ...commonSpecs, pile: 'Connector accent loop', useCase: 'Design transition / waypoint' } },
      { code: 'AC51', name: 'Silom', highlights: ['Bề mặt giàu cá tính', 'Nổi bật trong các khu vực điểm nhấn'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC51-Silom.jpg', spec: { ...commonSpecs, pile: 'Accent loop surface', useCase: 'Feature area / focal point' } },
      { code: 'AC61', name: 'Vefa', highlights: ['Gợi nhịp kiến trúc mạnh', 'Bổ sung chiều sâu cho bề mặt trình bày'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC61-Vefa.jpg', spec: { ...commonSpecs, pile: 'Architectural accent loop', useCase: 'Display / circulation' } },
      { code: 'AC71', name: 'SoMa', highlights: ['Tạo liên kết thị giác rõ ràng', 'Tăng chất hiện đại cho không gian thương hiệu'], image: 'https://carpetsinter.com/wp-content/uploads/2024/04/AC71-SoMa.jpg', spec: { ...commonSpecs, pile: 'Directional connector loop', useCase: 'Integrated planning scheme' } },
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
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR01-Brook-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR02-Billabong-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR03-Mangrove-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR04-Loch-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR05-Reef-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR21.png',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR22.png',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR31.png',
    ],
    gallery: [
      '/images/ebb-flow/ecosoft-2-better.png',
      'https://carpetsinter.com/wp-content/uploads/2026/04/EB42-FL10.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/04/EB02-EB04-EB05.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/04/FW04.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/04/FW02-FW05.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/04/EB33-EB43.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/12/EBR001-05-Random-brick-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2025/01/Mangrove-Herringbone-lr.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/04/EB04-EB43.jpg',
      'https://carpetsinter.com/wp-content/uploads/2026/04/EB04_EB05.jpg',
    ],
    accent: '#e0a04e',
    quickFacts: ['Ngôn ngữ mềm mại, thư giãn', 'Phù hợp hospitality & lounge', 'Giàu giá trị cảm xúc cho người xem'],
    applications: ['Lounge cao cấp', 'Phòng chờ', 'Resort office & hospitality'],
    valuePoints: ['Tạo cảm giác thư giãn, mềm mại và cao cấp cho các không gian cần tính trải nghiệm.', 'Làm dịu nhịp không gian nhưng vẫn giữ độ sang trọng rõ rệt trong từng bề mặt.', 'Phù hợp cho dự án muốn tăng cảm xúc sử dụng và giá trị tiếp đón khách hàng.'],
    products: [
      { code: 'EB01', name: 'Spring', highlights: ['Khơi nguồn sức sống', 'Tông màu tươi sáng'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/EB01-Spring.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'EB02', name: 'Creek', highlights: ['Dòng chảy tự nhiên', 'Dịu mát, thanh lịch'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/EB02-Creek.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'EB04', name: 'Estuary', highlights: ['Giao thoa mềm mại', 'Dễ dàng kết hợp nội thất'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/EB04-Estuary.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'EB05', name: 'Ocean', highlights: ['Sâu thẳm, tĩnh lặng', 'Tạo điểm nhấn mạnh mẽ'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/EB05-Ocean.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'EB32', name: 'River Emerald', highlights: ['Sắc xanh ngọc bích', 'Mang thiên nhiên vào nhà'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/EB32RiverEmerald1.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'EB33', name: 'River Sand', highlights: ['Màu cát ấm áp', 'Thư giãn, gần gũi'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/EB33RiverSand3.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'EB34', name: 'River Sunset', highlights: ['Hoàng hôn rực rỡ', 'Sắc độ phong phú'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/EB34RiverSunset3.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'EB42', name: 'Estuary Emerald', highlights: ['Đan xen tinh tế', 'Tăng chiều sâu không gian'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/EB42-Estuary-Emerald.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'EB43', name: 'Estuary Sand', highlights: ['Sáng sủa, mở rộng', 'Phù hợp diện tích lớn'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/EB43-Estuary-Sand.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'FW02', name: 'Backwash', highlights: ['Hiệu ứng nước rút', 'Sự chuyển động nhịp nhàng'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/FW02-Backwash.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'FW03', name: 'Wake', highlights: ['Đánh thức giác quan', 'Tông màu hiện đại'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/FW03-Wake.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'FW04', name: 'Tide', highlights: ['Thủy triều lên xuống', 'Pattern độc đáo'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/FW04-Tide.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
      { code: 'FW05', name: 'Drift', highlights: ['Sự trôi dạt tự nhiên', 'Hoàn thiện hoàn hảo'], image: 'https://carpetsinter.com/wp-content/uploads/2023/04/FW05-Drift.jpg', spec: { ...commonSpecs, pile: 'Multi Level Texture Tufted', useCase: 'Corporate / Hospitality' } },
    ],
    resources: [
      { label: 'Spec Sheet Upstream EBB & Flow', type: 'spec', url: 'https://carpetsinter.com/wp-content/uploads/2025/07/v25-Upstream-EBB-Flow.pdf' },
      { label: 'Brochure EcoSoft', type: 'brochure', url: 'https://carpetsinter.com/wp-content/uploads/2023/03/EcoSoftBrochurebyCarpetsInter-4.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSoft', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/03/EcoSoftCarpetTileInstallationGuideline-11.pdf' },
      { label: 'Hướng dẫn lắp đặt EcoSquare', type: 'guide', url: 'https://carpetsinter.com/wp-content/uploads/2023/08/EcoSquare-Carpet-Tile-Installation-Guideline-July-2023.pdf' },
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
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV100CAVE..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV102..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV103..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV104..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV200MOUNTAIN..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV201..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV202..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV204..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV300..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV900..jpg',
    ],
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV100CAVE..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV102..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV103..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV104..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV200MOUNTAIN..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV201..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV202..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV204..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV300..jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/DV900..jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/04/DV300-DV201.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/05/DV100_DV102.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/05/DV200_202-e1684310233612.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/WATERFALL-DV-900.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/CAVE-DV100-and-CALLIGRAPHY-DV102.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/MOUNTAIN-DV200-and-MOSAIC-DV202.jpg',
    ],
    accent: '#ffb049',
    quickFacts: ['Danh mục phong phú, dễ lựa chọn nhanh', 'Nhiều mã thiết kế cho từng câu chuyện không gian', 'Phù hợp tư vấn bán hàng trực tiếp'],
    applications: ['Văn phòng sáng tạo', 'Không gian bán lẻ', 'Khu vực trải nghiệm thương hiệu'],
    valuePoints: ['Mang đến nhiều lựa chọn hình ảnh và sắc thái để khách hàng dễ chốt theo phong cách mong muốn.', 'Giúp quá trình tư vấn trực quan hơn nhờ danh mục mã đa dạng, dễ so sánh và dễ hình dung.', 'Tăng khả năng cá nhân hóa không gian, từ nghệ thuật, tự nhiên đến nhịp chuyển động hiện đại.'],
    products: [
      { code: 'DV100', name: 'Cave', highlights: ['Cảm hứng tự nhiên', 'Mang lại nền sang trọng và ấm'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV100CAVE..jpg', spec: { ...commonSpecs, pile: 'Organic commercial loop', useCase: 'Creative office / brand reception' } },
      { code: 'DV102', name: 'Calligraphy', highlights: ['Nhịp nét mềm như thư pháp', 'Tăng tính nghệ thuật cho mặt sàn'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV102..jpg', spec: { ...commonSpecs, pile: 'Pattern loop expression', useCase: 'Feature floor / gallery path' } },
      { code: 'DV103', name: 'Tattoo', highlights: ['Cá tính rõ nét', 'Phù hợp không gian muốn tạo dấu ấn'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV103..jpg', spec: { ...commonSpecs, pile: 'Graphic loop texture', useCase: 'Statement design interior' } },
      { code: 'DV104', name: 'Henna', highlights: ['Chi tiết tinh tế', 'Mang sắc thái thủ công cao cấp'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV104..jpg', spec: { ...commonSpecs, pile: 'Decorative loop surface', useCase: 'Boutique / luxury lounge' } },
      { code: 'DV200', name: 'Mountain', highlights: ['Tạo chiều sâu địa hình', 'Giúp không gian vững và sang'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV200MOUNTAIN..jpg', spec: { ...commonSpecs, pile: 'Topographic loop pattern', useCase: 'Corporate / experience area' } },
      { code: 'DV201', name: 'Batik', highlights: ['Chất cảm văn hoá đương đại', 'Gia tăng độ độc đáo cho dự án'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV201..jpg', spec: { ...commonSpecs, pile: 'Cultural pattern loop', useCase: 'Brand-led presentation zone' } },
      { code: 'DV202', name: 'Mosaic', highlights: ['Nhịp điệu trang trí mạnh', 'Tăng sức hút ở khu vực trưng bày'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV202..jpg', spec: { ...commonSpecs, pile: 'Accent mosaic loop', useCase: 'Display / showroom' } },
      { code: 'DV204', name: 'Relic', highlights: ['Chi tiết bề mặt có chiều sâu', 'Tạo cảm giác nghệ thuật đương đại cho công trình'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV204..jpg', spec: { ...commonSpecs, pile: 'Art-inspired loop texture', useCase: 'Feature gallery / statement office' } },
      { code: 'DV300', name: 'Storyline', highlights: ['Tạo cảm giác kể chuyện', 'Phù hợp điểm chạm thương hiệu'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV300..jpg', spec: { ...commonSpecs, pile: 'Narrative directional loop', useCase: 'Integrated concept flooring' } },
      { code: 'DV900', name: 'Waterfall', highlights: ['Mềm mại như dòng chảy', 'Tạo cảm giác thư giãn cao cấp'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/DV900..jpg', spec: { ...commonSpecs, pile: 'Fluid tonal loop', useCase: 'Soft hospitality / feature zone' } },
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
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL01Gola-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL02Ganges-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL04Omo-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL11Lena-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL15Yukon-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL27YilanReplaceFL23NM005-2150x50cm-3.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL28StoraReplaceFL06NM007-2150x50cm-3.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL29NurraReplaceFL09NM020-2150X50CM-1.jpeg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL30MessaraNM009-2250X50CM-1.jpeg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL36Niger-1.jpg',
    ],
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL01Gola-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL02Ganges-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL04Omo-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL11Lena-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL15Yukon-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL27YilanReplaceFL23NM005-2150x50cm-3.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL28StoraReplaceFL06NM007-2150x50cm-3.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL29NurraReplaceFL09NM020-2150X50CM-1.jpeg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL30MessaraNM009-2250X50CM-1.jpeg',
      'https://carpetsinter.com/wp-content/uploads/2022/09/FL36Niger-1.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/04/FL0104242528333738-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/01/FL0104363839-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/11/Flatlands-scaled.jpg',
      'https://carpetsinter.com/wp-content/uploads/2023/06/FL0110242837.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/FL11-with-Breaking-Waves-Collection.jpg',
      'https://carpetsinter.com/wp-content/uploads/2022/08/FL02-FL11-and-FL15-e1668747237702.jpg',
    ],
    accent: '#f0b25b',
    quickFacts: ['Thiết kế tinh giản, thanh lịch', 'Có tùy chọn Limited Stock/Made to Order Colors', 'Rất phù hợp không gian cao cấp tiết chế'],
    applications: ['Office suite', 'Không gian điều hành', 'Boutique showroom'],
    valuePoints: ['Tạo nền tĩnh, sâu và sạch cho công trình theo phong cách tối giản sang trọng.', 'Giúp nội thất và ánh sáng nổi bật hơn mà không làm tổng thể trở nên rối mắt.', 'Phù hợp cho khách hàng cần hình ảnh trưởng thành, bền vững và có gu thẩm mỹ rõ ràng.'],
    products: [
      { code: 'FL01', name: 'Gola', highlights: ['Tông nền sạch và sâu', 'Nâng giá trị trực quan cho nội thất'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL01Gola-2.jpg', spec: { ...commonSpecs, pile: 'Monotone fine loop', useCase: 'Executive office / quiet floor' } },
      { code: 'FL02', name: 'Ganges', highlights: ['Tối giản nhưng không đơn điệu', 'Tạo cảm giác trưởng thành'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL02Ganges-2.jpg', spec: { ...commonSpecs, pile: 'Balanced commercial loop', useCase: 'Premium workspace / meeting zone' } },
      { code: 'FL03', name: 'Arusha', highlights: ['Tăng độ chuyển nhẹ của bề mặt', 'Phù hợp các concept tối giản hiện đại'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL03Arusha-2.jpg', spec: { ...commonSpecs, pile: 'Soft tonal loop', useCase: 'Design office / support zone' } },
      { code: 'FL04', name: 'Omo', highlights: ['Texture mảnh và tinh tế', 'Phù hợp nhiều không gian hiện đại'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL04Omo-2.jpg', spec: { ...commonSpecs, pile: 'Refined low loop', useCase: 'Design-led interior / office suite' } },
      { code: 'FL08', name: 'Taza', highlights: ['Sáng vừa phải, dễ phối', 'Giúp không gian thoáng và thanh lịch hơn'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL08Taza-2.jpg', spec: { ...commonSpecs, pile: 'Refined tonal loop', useCase: 'Open office / collaborative area' } },
      { code: 'FL11', name: 'Lena', highlights: ['Dễ phối đa vật liệu', 'Phù hợp nhiều diện tích'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL11Lena-2.jpg', spec: { ...commonSpecs, pile: 'Soft directional loop', useCase: 'Open office / hospitality' } },
      { code: 'FL14', name: 'Banco', highlights: ['Tạo nền trầm và vững', 'Tăng độ chỉn chu cho công trình trưởng thành'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL14Banco.jpg', spec: { ...commonSpecs, pile: 'Dense tonal loop', useCase: 'Corporate suite / quiet room' } },
      { code: 'FL15', name: 'Yukon', highlights: ['Giữ nền sâu và êm', 'Tăng cảm giác sang trọng nền tảng'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL15Yukon-2.jpg', spec: { ...commonSpecs, pile: 'Dense tonal loop', useCase: 'Quiet executive setting' } },
      { code: 'FL24', name: 'Rieti', highlights: ['Điểm chuyển sắc tinh tế', 'Tốt cho các khu vực cần nhấn nhịp nhẹ nhàng'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL24RietiReplaceFL14NM019-2250X50CM-2.jpeg', spec: { ...commonSpecs, pile: 'Transition loop texture', useCase: 'Feature connector / design strip' } },
      { code: 'FL27', name: 'Yilan', highlights: ['Tạo cá tính nhẹ', 'Phù hợp khu vực muốn điểm nhấn tiết chế'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL27YilanReplaceFL23NM005-2150x50cm-3.jpg', spec: { ...commonSpecs, pile: 'Pattern accent loop', useCase: 'Feature insert / zoning' } },
      { code: 'FL28', name: 'Stora', highlights: ['Cân bằng tốt giữa sáng và tối', 'Dễ dùng trong bố cục cao cấp'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL28StoraReplaceFL06NM007-2150x50cm-3.jpg', spec: { ...commonSpecs, pile: 'Medium contrast loop', useCase: 'Premium planning layout' } },
      { code: 'FL29', name: 'Nurra', highlights: ['Gọn gàng, sâu sắc', 'Tạo sự chỉn chu rõ rệt'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL29NurraReplaceFL09NM020-2150X50CM-1.jpeg', spec: { ...commonSpecs, pile: 'Structured tonal loop', useCase: 'Corporate circulation / support zone' } },
      { code: 'FL30', name: 'Messara', highlights: ['Nét tối giản mạnh', 'Thích hợp concept trưởng thành'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL30MessaraNM009-2250X50CM-1.jpeg', spec: { ...commonSpecs, pile: 'Architectural loop texture', useCase: 'Contemporary office / gallery' } },
      { code: 'FL36', name: 'Niger', highlights: ['Nhấn nhẹ texture', 'Đem lại sự sang trọng tinh vi'], image: 'https://carpetsinter.com/wp-content/uploads/2022/09/FL36Niger-1.jpg', spec: { ...commonSpecs, pile: 'Directional elegant loop', useCase: 'Feature monotone flooring' } },
      { code: 'FL38', name: 'Shiraki', highlights: ['Bảng màu sáng hiện đại', 'Phù hợp không gian cần cảm giác nhẹ và mở'], image: 'https://carpetsinter.com/wp-content/uploads/2023/09/FL38-Shiraki.jpg', spec: { ...commonSpecs, pile: 'Light modern loop', useCase: 'Open planning / collaborative suite' } },
      { code: 'FL39', name: 'Depsang', highlights: ['Hoàn thiện bảng màu với sắc độ sâu vừa', 'Giữ tính tối giản nhưng không nhạt'], image: 'https://carpetsinter.com/wp-content/uploads/2023/09/FL39-Depsang.jpg', spec: { ...commonSpecs, pile: 'Refined tonal loop', useCase: 'Integrated flooring scheme' } },
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
    productImages: [
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV01-AMBITION.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV02-IMAGINE.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV03-CLARITY.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV04-ENERGY.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV05-ELEVATE.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV06-DEFINE.jpg',
    ],
    gallery: [
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV01-AMBITION.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV02-IMAGINE.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV03-CLARITY.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV04-ENERGY.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV05-ELEVATE.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/AKV06-DEFINE.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/Vue-e1728381708911.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-1-e1730109126599.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-2-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-2.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-5.jpg',
      'https://carpetsinter.com/wp-content/uploads/2024/10/vue-6.jpg',
    ],
    accent: '#ffc169',
    quickFacts: ['Hiện đại, thanh mảnh, giàu chiều sâu', 'Tạo ấn tượng trực tiếp cho người xem', 'Rất hợp phong cách luxury tối giản'],
    applications: ['Sảnh tiếp đón', 'Showroom thương hiệu', 'Không gian tư vấn cao cấp'],
    valuePoints: ['Mang lại cảm giác thanh mảnh, tinh tế và hiện đại cho những không gian cần ấn tượng đầu tiên mạnh mẽ.', 'Làm nổi bật chiều sâu thẩm mỹ mà vẫn giữ được sự tối giản và sang trọng.', 'Rất phù hợp khi cần một bộ sưu tập dễ trình bày với khách hàng nhưng vẫn đủ chất thiết kế.'],
    products: [
      { code: 'AKV01', name: 'Ambition', highlights: ['Đường nét tinh tế', 'Tăng độ thanh lịch cho toàn bộ không gian'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV01-AMBITION.jpg', spec: { ...commonSpecs, pile: 'Fine directional loop', useCase: 'Reception / luxury office' } },
      { code: 'AKV02', name: 'Imagine', highlights: ['Gợi chiều sâu nhẹ', 'Mang lại cảm giác cao cấp dễ nhận thấy'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV02-IMAGINE.jpg', spec: { ...commonSpecs, pile: 'Soft tonal loop', useCase: 'Showroom / advisory space' } },
      { code: 'AKV03', name: 'Clarity', highlights: ['Phù hợp các dự án cần điểm nhấn thẩm mỹ', 'Giữ được tính ứng dụng cao'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV03-CLARITY.jpg', spec: { ...commonSpecs, pile: 'Balanced contemporary loop', useCase: 'Design office / collaboration zone' } },
      { code: 'AKV04', name: 'Energy', highlights: ['Tăng nhịp sống thị giác', 'Làm không gian sinh động nhưng vẫn tinh tế'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV04-ENERGY.jpg', spec: { ...commonSpecs, pile: 'Pattern loop accent', useCase: 'Creative interior / feature path' } },
      { code: 'AKV05', name: 'Elevate', highlights: ['Cảm giác cao cấp rõ nét', 'Phù hợp các khu vực trình bày thương hiệu'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV05-ELEVATE.jpg', spec: { ...commonSpecs, pile: 'Elegant tonal loop', useCase: 'Brand presentation / premium suite' } },
      { code: 'AKV06', name: 'Define', highlights: ['Định hình tính cách không gian', 'Giữ bố cục rõ ràng và hiện đại'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV06-DEFINE.jpg', spec: { ...commonSpecs, pile: 'Directional commercial loop', useCase: 'Integrated architectural flooring' } },
      { code: 'AKV04', name: 'Energy', highlights: ['Tăng nhịp sống thị giác', 'Làm không gian sinh động nhưng vẫn tinh tế'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV04-ENERGY.jpg', spec: { ...commonSpecs, pile: 'Pattern loop accent', useCase: 'Creative interior / feature path' } },
      { code: 'AKV05', name: 'Elevate', highlights: ['Cảm giác cao cấp rõ nét', 'Phù hợp các khu vực trình bày thương hiệu'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV05-ELEVATE.jpg', spec: { ...commonSpecs, pile: 'Elegant tonal loop', useCase: 'Brand presentation / premium suite' } },
      { code: 'AKV06', name: 'Define', highlights: ['Định hình tính cách không gian', 'Giữ bố cục rõ ràng và hiện đại'], image: 'https://carpetsinter.com/wp-content/uploads/2024/10/AKV06-DEFINE.jpg', spec: { ...commonSpecs, pile: 'Directional commercial loop', useCase: 'Integrated architectural flooring' } },
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
  { label: 'Hồ sơ phối hợp bộ sưu tập', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/MixMatchbyCarpetsInterFeb2020LR.pdf' },
  { label: 'Hồ sơ thiết kế tùy chỉnh', type: 'portfolio', url: 'https://carpetsinter.com/wp-content/uploads/2023/04/CarpetTileCustomDesignPortfolioAug2021lr.pdf' },
]

export const contactInfo: ContactInfo = {
  company: 'Nội Thất Công Cộng Minh Đức',
  hotline: '0908314939',
  email: 'gd@mdsf.vn',
  address: 'Số 47/153/30, Phú Đô, Nam Từ Liêm, Hà Nội, Việt Nam',
  hours: 'Văn phòng: G04-L04 An Quý Villa - KĐT Mới Dương Nội, P. Dương Nội, Hà Nội.',
}
