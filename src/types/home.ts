/** Homepage CMS content types — defines the shape of each section's editable content */

export interface BaseSectionConfig {
  isVisible: boolean
  style: 'light' | 'dark'
  limit?: number
  manualIds?: string[]
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export interface HeroContent {
  badgeText: string
  title: string
  titleHighlight: string
  subtitle: string
  ctaPrimaryText: string
  ctaPrimaryLink: string
  ctaSecondaryText: string
  ctaSecondaryLink: string
  backgroundImages: string[]  // URLs of hero background images
}

// ─── Navigation Bar ───────────────────────────────────────────────────────────
export interface NavContent {
  logoText: string
  logoSubtext: string
  phone: string
  ctaButtonText: string
  menuItems: { label: string; href: string }[]
}

// ─── Collections Section ──────────────────────────────────────────────────────
export interface CollectionsSectionContent extends BaseSectionConfig {
  sectionTitle: string
  sectionSubtitle: string
}

// ─── Values Section ───────────────────────────────────────────────────────────
export interface ValuesContent extends BaseSectionConfig {
  sectionTitle: string
  values: string[]
  ctaText: string
}

// ─── Specs Section ────────────────────────────────────────────────────────────
export interface SpecsContent extends BaseSectionConfig {
  sectionTitle: string
  sectionSubtitle: string
}

// ─── News Section ─────────────────────────────────────────────────────────────
export interface NewsSectionContent extends BaseSectionConfig {
  sectionTitle: string
  sectionSubtitle: string
}

// ─── Products Section ─────────────────────────────────────────────────────────
export interface ProductsSectionContent extends BaseSectionConfig {
  sectionTitle: string
  sectionSubtitle: string
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
export interface GallerySectionContent extends BaseSectionConfig {
  sectionTitle: string
  sectionSubtitle: string
  collectionId?: string
  selectedImages?: string[]
}

// ─── Contact Section ──────────────────────────────────────────────────────────
export interface ContactContent {
  sectionTitle: string
  sectionSubtitle: string
  phone: string
  email: string
  address: string
  mapEmbedUrl: string
  formFields: { label: string; placeholder: string; type: string }[]
}

// ─── Footer Section ───────────────────────────────────────────────────────────
export interface FooterContent {
  companyName: string
  slogan: string
  copyright: string
  socialLinks: { platform: string; url: string; icon: string }[]
  quickLinks: { label: string; href: string }[]
}

// ─── Combined type for all sections ───────────────────────────────────────────
export interface HomepageContent {
  hero: HeroContent
  nav: NavContent
  collections: CollectionsSectionContent
  values: ValuesContent
  specs: SpecsContent
  news: NewsSectionContent
  products: ProductsSectionContent
  gallery: GallerySectionContent
  contact: ContactContent
  footer: FooterContent
}

/** Section key mapping to site_config keys */
export type HomepageSectionKey =
  | 'homepage_hero'
  | 'homepage_nav'
  | 'homepage_collections'
  | 'homepage_values'
  | 'homepage_specs'
  | 'homepage_news'
  | 'homepage_products'
  | 'homepage_gallery'
  | 'homepage_contact'
  | 'homepage_footer'

export const SECTION_CONFIG: {
  key: HomepageSectionKey
  label: string
  icon: string
  description: string
}[] = [
  { key: 'homepage_hero', label: 'Hero Section', icon: 'MonitorPlay', description: 'Khu vực đầu trang — tiêu đề, slogan, ảnh nền, nút kêu gọi hành động' },
  { key: 'homepage_nav', label: 'Thanh điều hướng', icon: 'Navigation', description: 'Logo, menu, số điện thoại, nút gọi ngay' },
  { key: 'homepage_collections', label: 'Bộ sưu tập', icon: 'Layers', description: 'Tiêu đề và mô tả khu vực bộ sưu tập' },
  { key: 'homepage_values', label: 'Giá trị nổi bật', icon: 'Award', description: 'Danh sách giá trị cốt lõi và lời kêu gọi hành động' },
  { key: 'homepage_specs', label: 'Thông số kỹ thuật', icon: 'Ruler', description: 'Tiêu đề khu vực thông số sản phẩm' },
  { key: 'homepage_news', label: 'Tin tức & Sự kiện', icon: 'Newspaper', description: 'Tiêu đề khu vực tin tức' },
  { key: 'homepage_products', label: 'Danh mục sản phẩm', icon: 'Package', description: 'Tiêu đề khu vực danh mục sản phẩm' },
  { key: 'homepage_gallery', label: 'Gallery hình ảnh', icon: 'Images', description: 'Tiêu đề khu vực hình ảnh bộ sưu tập' },
  { key: 'homepage_contact', label: 'Liên hệ', icon: 'Mail', description: 'Form liên hệ, thông tin liên lạc' },
  { key: 'homepage_footer', label: 'Footer', icon: 'PanelBottom', description: 'Thông tin cuối trang — bản quyền, liên kết nhanh, mạng xã hội' },
]

// ─── Default content (matches current PublicApp.tsx hardcoded text) ────────────
export const DEFAULT_HERO: HeroContent = {
  badgeText: 'Giao hàng và thi công nhanh chóng trên toàn quốc.',
  title: 'HƠN CẢ THẨM MỸ',
  titleHighlight: 'SỰ BỀN VỮNG',
  subtitle: 'Nội thất công cộng Minh Đức đồng hành cùng đối tác quốc tế Carpets Inter, mang giải pháp thảm sàn sinh thái đẳng cấp toàn cầu đến mọi công trình bằng sự chân thành và cam kết chất lượng trọn vẹn.',
  ctaPrimaryText: 'Xem bộ sưu tập',
  ctaPrimaryLink: '#collections',
  ctaSecondaryText: 'Tài liệu kỹ thuật',
  ctaSecondaryLink: '#tai-lieu',
  backgroundImages: [],
}

export const DEFAULT_NAV: NavContent = {
  logoText: 'Carpets Inter',
  logoSubtext: 'THẢM TRẢI SÀN CAO CẤP',
  phone: '0908314939',
  ctaButtonText: 'Gọi ngay',
  menuItems: [
    { label: 'Bộ sưu tập', href: '#collections' },
    { label: 'Tài liệu', href: '#tai-lieu' },
    { label: 'Tin tức', href: '#news' },
    { label: 'Liên hệ', href: '#lien-he-nhanh' },
  ],
}

export const DEFAULT_COLLECTIONS_SECTION: CollectionsSectionContent = {
  isVisible: true, style: 'light', limit: 6,
  sectionTitle: 'Collection',
  sectionSubtitle: 'Khám phá các bộ sưu tập thảm cao cấp',
}

export const DEFAULT_VALUES: ValuesContent = {
  isVisible: true, style: 'dark',
  sectionTitle: 'Giá trị nổi bật mang lại',
  values: [
    'Chất liệu cao cấp, nhập khẩu từ châu Âu',
    'Thân thiện với môi trường, đạt tiêu chuẩn sinh thái quốc tế',
    'Cách âm vượt trội, giảm tiếng ồn hiệu quả',
    'Chống cháy theo tiêu chuẩn an toàn công trình',
    'Đa dạng mẫu mã, phong phú sắc độ',
    'Dễ dàng lắp đặt và bảo trì',
  ],
  ctaText: 'Liên hệ ngay để được tư vấn đúng bộ sưu tập, đúng cấu trúc bề mặt và đúng sắc độ phù hợp với concept công trình của bạn.',
}

export const DEFAULT_SPECS: SpecsContent = {
  isVisible: true, style: 'light',
  sectionTitle: 'Thông số kỹ thuật sản phẩm',
  sectionSubtitle: 'Chọn sản phẩm để xem chi tiết thông số kỹ thuật',
}

export const DEFAULT_NEWS_SECTION: NewsSectionContent = {
  isVisible: true, style: 'light', limit: 4,
  sectionTitle: 'Tin tức & Sự kiện',
  sectionSubtitle: 'Cập nhật tin tức mới nhất về thảm sàn và nội thất',
}

export const DEFAULT_PRODUCTS_SECTION: ProductsSectionContent = {
  isVisible: true, style: 'light', limit: 8,
  sectionTitle: 'Danh mục sản phẩm trong bộ sưu tập',
  sectionSubtitle: 'Click vào sản phẩm để xem chi tiết',
}

export const DEFAULT_GALLERY: GallerySectionContent = {
  isVisible: true,
  style: 'light' as const,
  limit: 10,
  sectionTitle: 'Toàn bộ hình ảnh trong bộ sưu tập',
  sectionSubtitle: 'Bấm vào hình ảnh để xem kích thước lớn',
  collectionId: '',
  selectedImages: [] as string[],
}

export const DEFAULT_CONTACT: ContactContent = {
  sectionTitle: 'Liên hệ tư vấn',
  sectionSubtitle: 'Gửi yêu cầu tư vấn miễn phí — Đội ngũ chuyên gia sẽ liên hệ bạn trong 24h',
  phone: '0908314939',
  email: 'info@carpetsinter.vn',
  address: 'TP. Hồ Chí Minh, Việt Nam',
  mapEmbedUrl: '',
  formFields: [
    { label: 'Họ tên', placeholder: 'Nhập họ tên', type: 'text' },
    { label: 'Số điện thoại', placeholder: 'Nhập số điện thoại', type: 'tel' },
    { label: 'Email / Công ty', placeholder: 'Nhập email hoặc tên công ty', type: 'email' },
    { label: 'Dự án / Bộ sưu tập quan tâm', placeholder: 'Mô tả ngắn', type: 'text' },
    { label: 'Nội dung yêu cầu', placeholder: 'Nhập nội dung chi tiết', type: 'textarea' },
  ],
}

export const DEFAULT_FOOTER: FooterContent = {
  companyName: 'Carpets Inter Việt Nam',
  slogan: 'Hơn cả thẩm mỹ — Đó là sự bền vững',
  copyright: '© 2024 Carpets Inter Vietnam. Phân phối bởi Nội Thất Công Cộng Minh Đức.',
  socialLinks: [
    { platform: 'Facebook', url: 'https://facebook.com', icon: 'Facebook' },
    { platform: 'Zalo', url: 'https://zalo.me', icon: 'MessageCircle' },
  ],
  quickLinks: [
    { label: 'Bộ sưu tập', href: '#collections' },
    { label: 'Tin tức', href: '#news' },
    { label: 'Liên hệ', href: '#lien-he-nhanh' },
  ],
}
