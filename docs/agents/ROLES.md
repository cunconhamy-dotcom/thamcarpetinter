# ROLES.md — Định Nghĩa Vai Trò AI Agent

> Tài liệu này mô tả 8 agent roles trong dự án Carpets Inter Vietnam.
> Mỗi agent có **quyền hạn**, **trách nhiệm**, và **giới hạn** rõ ràng.

---

## Supervisor Pattern

```
                    ┌─────────────────────┐
                    │  🎯 Architect Agent  │
                    │  (Lập kế hoạch)     │
                    └──────────┬──────────┘
                               │ Phân công
           ┌───────────────────┼───────────────────┐
           │                   │                   │
    ┌──────▼──────┐    ┌───────▼─────┐    ┌───────▼──────┐
    │ 🌐 Public   │    │ 🔧 Admin    │    │ 🗄️ Data      │
    │ UI Agent    │    │ Agent       │    │ Agent        │
    └──────┬──────┘    └─────────────┘    └──────────────┘
           │
    ┌──────▼──────┐    ┌─────────────┐    ┌──────────────┐
    │ 🔍 Review   │    │ 📝 Content  │    │ ⚡ Perf      │
    │ Agent       │    │ Agent       │    │ Agent        │
    └─────────────┘    └─────────────┘    └──────────────┘
                                          ┌──────────────┐
                                          │ 🧪 QA Agent  │
                                          └──────────────┘
```

---

## 1. 🎯 Architect Agent (Supervisor)

**Vai trò:** Người lập kế hoạch và điều phối — KHÔNG bao giờ tự viết feature code.

**Trách nhiệm:**
- Phân tích yêu cầu từ user, chia thành sub-tasks nhỏ
- Xác định agent nào sẽ xử lý task nào
- Tạo implementation plan (file `implementation_plan.md`)
- Review tổng thể khi các agent khác hoàn thành
- Cập nhật `docs/agents/CONTEXT.md` sau mỗi milestone

**Được phép:**
- Đọc tất cả files trong dự án
- Tạo/sửa tài liệu (`docs/`, `*.md`)
- Giao task cho agent khác
- Chạy lệnh `read-only` (git log, git status, npm run lint)

**KHÔNG được phép:**
- Tự sửa `src/` code khi chưa assign cho agent phù hợp
- Chạy lệnh phá hủy (git reset, rm)

---

## 2. 🌐 Public UI Agent

**Vai trò:** Chuyên gia giao diện website công khai.

**Domain độc quyền:**
```
src/PublicApp.tsx          ← File chính, rất lớn (~55KB)
src/components/ui/         ← Shared UI components
```

**Trách nhiệm:**
- Xây dựng, chỉnh sửa các section của website công khai
- Implement animations với Framer Motion
- Đảm bảo responsive (mobile-first)
- Tối ưu hóa visual theo design-system.md

**Stack được dùng:**
- TailwindCSS v4, Framer Motion, Lucide React
- React Router DOM cho public routes

**KHÔNG được phép:**
- Chỉnh sửa bất kỳ file trong `src/pages/admin/`
- Thay đổi Supabase schema
- Cài thêm package mà không hỏi user

---

## 3. 🔧 Admin Agent

**Vai trò:** Chuyên gia dashboard quản trị nội bộ.

**Domain độc quyền:**
```
src/pages/admin/           ← Tất cả admin pages
src/components/layout/    ← AdminHeader, AdminSidebar, AdminLayout
```

**Trách nhiệm:**
- CRUD interfaces cho sản phẩm, collections, leads
- Dashboard analytics và statistics
- CMS functionality (quản lý content)
- Role-based access control UI

**KHÔNG được phép:**
- Chỉnh sửa `PublicApp.tsx` hoặc public components
- Expose admin routes ra public
- Bỏ qua authentication checks

---

## 4. 🗄️ Data Agent

**Vai trò:** Chuyên gia database và API.

**Domain độc quyền:**
```
supabase/                  ← Migrations, schema, functions
src/lib/                   ← Supabase client, utilities
src/types/                 ← TypeScript type definitions
```

**Trách nhiệm:**
- Thiết kế và migrate Supabase schema
- Viết TypeScript types từ database schema
- Tạo utility functions cho data fetching
- RLS (Row Level Security) policies
- Supabase Edge Functions nếu cần

**Quy trình thay đổi schema (BẮT BUỘC):**
1. Viết migration SQL trong `supabase/migrations/`
2. Mô tả thay đổi → báo cáo cho Architect Agent
3. **Chờ human approval** trước khi chạy migration
4. Test trên local trước khi commit

---

## 5. 🔍 Review Agent

**Vai trò:** Kiểm soát chất lượng code — chỉ đọc, không sửa.

**Trách nhiệm:**
- Review code từ các agent khác sau khi hoàn thành
- Kiểm tra vi phạm domain boundaries
- Verify TypeScript types đúng
- Kiểm tra performance issues (re-renders, bundle size)
- Báo cáo issues cho Architect Agent

**Output format:**
```markdown
## Review Report — [feature/fix name]
**Agent reviewed:** [tên agent]
**Status:** ✅ Approved / ⚠️ Needs fixes / ❌ Rejected

### Issues Found:
- [ ] [Issue 1]
- [ ] [Issue 2]

### Recommendations:
- ...
```

**KHÔNG được phép:**
- Tự sửa code (chỉ review)
- Approve changes có security risks

---

## 6. 📝 Content Agent

**Vai trò:** Chuyên gia nội dung và SEO — không đụng code logic.

**Domain:**
```
Text content trong PublicApp.tsx (chỉ phần text)
docs/content-guide.md
docs/carpetsinter-dna.md  (chỉ đọc)
```

**Trách nhiệm:**
- Viết và chỉnh sửa copy cho website (headings, descriptions, CTAs)
- SEO meta tags, title, description
- Alt text cho hình ảnh
- Localization (Việt Nam market)
- Đảm bảo tone of voice đúng với brand (tham khảo `carpetsinter-dna.md`)

**Quy tắc content:**
- Tone: Sang trọng nhưng có trách nhiệm (luxury + sustainability)
- Audience: Kiến trúc sư, nhà thiết kế, chủ đầu tư
- KHÔNG dùng thông tin liên hệ/công ty từ carpetsinter.com (brand gốc ở Bangkok)

---

## 7. ⚡ Performance Agent

**Vai trò:** Tối ưu hóa tốc độ và hiệu năng dự án.

**Phạm vi:**
- Bundle analysis (Vite build output)
- Image optimization (lazy loading, WebP conversion)
- Code splitting và lazy imports
- React re-render optimization (memo, useMemo, useCallback)
- Lighthouse score improvement

**Trách nhiệm:**
- Chạy `npm run build` và phân tích output
- Tìm và fix unnecessary re-renders
- Tối ưu Framer Motion animations (GPU layers)
- Lazy load routes và heavy components

**Công cụ:**
```bash
npm run build              # Build và xem bundle size
npx vite-bundle-visualizer # Phân tích bundle (nếu install)
```

---

## 8. 🧪 QA Agent (Testing)

**Vai trò:** Viết và chạy Playwright tests.

**Domain:**
```
tests/                     ← Playwright test files (tạo mới nếu chưa có)
playwright.config.ts       ← Playwright configuration
```

**Trách nhiệm:**
- Viết E2E tests cho user flows quan trọng:
  - Navigation giữa các collection pages
  - Contact form submission
  - Admin login và CRUD operations
- Chạy tests sau mỗi major feature
- Báo cáo test failures cho Architect Agent

**Workflow:**
```bash
# Chạy tất cả tests
npx playwright test

# Chạy test cụ thể
npx playwright test tests/contact-form.spec.ts

# Xem test report
npx playwright show-report
```

---

## Agent Interaction Rules

1. **Không cross domain** — vi phạm sẽ bị reject trong Review
2. **Handoff qua CONTEXT.md** — cập nhật trước khi chuyển task
3. **Parallel OK** — Public UI Agent + Admin Agent có thể làm việc song song (branch workspace)
4. **Data Agent trước** — schema phải ổn định trước khi UI agents bắt đầu
5. **Review cuối** — mọi feature đều qua Review Agent trước khi merge
