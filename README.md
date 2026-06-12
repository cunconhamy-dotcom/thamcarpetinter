# Carpets Inter Vietnam — Official E-Commerce Platform

Dự án Website Thương Mại Điện Tử B2B cho thương hiệu thảm modular cao cấp Carpets Inter (TCM Corporation Plc.) tại thị trường Việt Nam.

## 🎯 Mục Tiêu Dự Án
- Cung cấp trải nghiệm showcase các bộ sưu tập thảm (Foundation, Groundwork, Aspekt...).
- Kết nối B2B với Kiến trúc sư, Nhà thiết kế nội thất, Chủ đầu tư.
- Quản trị nội dung CMS, sản phẩm, và leads qua Admin Dashboard mạnh mẽ.

## 🛠 Tech Stack
- **Framework:** React 19 + Vite 7
- **Language:** TypeScript
- **Styling:** TailwindCSS v4 + Framer Motion
- **Database/Auth:** Supabase
- **Icons:** Lucide React

## 🤖 AI Agent Architecture (Đặc Biệt)
Dự án này được thiết kế và vận hành dưới mô hình **AI Multi-Agent Supervisor Pattern**. Các AI (Claude Code, Google Antigravity, OpenAI Codex) tuân thủ nghiêm ngặt các quy tắc được định nghĩa trong hệ thống:

- Đọc file `AGENTS.md` (root directory) để hiểu quy tắc chung.
- Tham khảo `docs/agents/ROLES.md` để xem phân chia ranh giới code (Public UI vs Admin vs Data).
- Luồng làm việc chuẩn được định nghĩa ở `docs/agents/WORKFLOWS.md`.

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local

### 1. Yêu cầu hệ thống
- Node.js >= 20
- npm >= 10

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Thiết lập biến môi trường
Tạo file `.env.local` ở thư mục gốc (xem mẫu `.env.example`):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Chạy môi trường phát triển (Dev)
```bash
npm run dev
```

### 5. Build cho Production
```bash
npm run build
```

## 📁 Cấu Trúc Thư Mục Chính
```
├── src/
│   ├── components/      # UI components (tách biệt layout admin và public ui)
│   ├── pages/           # Admin pages
│   ├── styles/          # Design tokens, global CSS, animations
│   ├── lib/             # API clients, Supabase
│   ├── contexts/        # React Context
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Main Router
│   └── PublicApp.tsx    # Giao diện chính của website public
├── docs/                # Project & Brand Documentation
│   └── agents/          # AI Agent configurations
└── supabase/            # Database schema & migrations
```

---
*Powered by AI Agentic Workflows. "Elevate Spaces, Empower Living."*
