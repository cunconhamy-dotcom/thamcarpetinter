# WORKFLOWS.md — Luồng Làm Việc Của AI Agents

> Tài liệu này định nghĩa các quy trình chuẩn (Standard Operating Procedures - SOPs) cho các Agents khi thực hiện task.

---

## 1. Feature Development Workflow
Dành cho việc phát triển tính năng mới (ví dụ: Thêm trang Collection mới, thêm component phức tạp).

**Quy trình:**
1. **Architect Agent (Plan):** Đọc yêu cầu, phân tích `design-system.md`, xác định scope. Tạo `implementation_plan.md` xin ý kiến user.
2. **Data Agent (Data - If needed):** Update `supabase/migrations/` và Typescript types. Chờ approve.
3. **Public/Admin Agent (Dev):** Nhận task, implement UI component bằng TailwindCSS v4 + Framer Motion.
4. **Content Agent (Copy):** Đảm bảo text chuẩn SEO và đúng tone brand.
5. **Review Agent (QA):** Verify typecheck, linting, và boundaries.
6. **Architect Agent (Wrap-up):** Cập nhật `CONTEXT.md` và `git commit`.

---

## 2. Bug Fix Workflow
Dành cho việc sửa lỗi.

**Quy trình:**
1. **Agent Nhận Việc:** Nhận báo cáo bug.
2. **Investigate:** Dùng `grep_search` hoặc xem log để tìm file lỗi.
3. **Patch:** Tạo fix. KHÔNG thay đổi toàn bộ kiến trúc file chỉ để sửa 1 bug nhỏ.
4. **Verify:** Chạy `npm run tsc` và `npm run lint` để đảm bảo fix không sinh ra lỗi mới.
5. **Commit:** `git commit -m "fix(scope): description"`

---

## 3. Database Migration Workflow
Dành cho việc thay đổi DB schema. Rủi ro cao.

**Quy trình:**
1. **Data Agent:** Nhận yêu cầu thay đổi schema.
2. **Draft:** Viết file migration `.sql` lưu vào `supabase/migrations/`.
3. **Halt & Ask:** Dừng lại, hỏi user: "Bạn có muốn tôi áp dụng migration này lên DB không?"
4. **Apply:** Nếu user đồng ý, chạy lệnh apply. Nếu không, chỉ lưu file SQL.
5. **Sync Types:** Chạy lệnh generate type từ DB về `src/types/`.

---

## 4. Content Update Workflow
Dành cho việc cập nhật chữ, hình ảnh, SEO (thường do Content Agent làm).

**Quy trình:**
1. **Content Agent:** Nhận yêu cầu đổi content.
2. **Review DNA:** Tham khảo `docs/carpetsinter-dna.md` để đảm bảo thông tin chính xác.
3. **Edit:** Tìm đúng string trong file `PublicApp.tsx` hoặc component tương ứng. Thay đổi text (cẩn thận không làm hỏng JSX/HTML tags).
4. **Commit:** `git commit -m "docs(content): update section text"`

---

## 5. Parallel Development Workflow
Khi hệ thống hỗ trợ nhiều agents (Antigravity subagents).

**Quy trình:**
1. **Architect Agent:** Giao 2 task độc lập (VD: 1 cho Admin Agent, 1 cho Public UI Agent) chạy trên 2 workspace/branch riêng biệt.
2. **Subagents:** Thực hiện task độc lập, báo cáo kết quả.
3. **Architect/Review Agent:** Gom lại, kiểm tra conflict, tiến hành merge.

---

## Quy Tắc Chung Cho Mọi Workflow

- Luôn tuân thủ **DOMAINS BOUNDARIES** (xem AGENTS.md).
- Không tự ý xóa code của agent khác (đặc biệt là comments giải thích logic).
- Nếu bị tắc (stuck) quá 2 lần thử, DỪNG LẠI và xin ý kiến user, không thử mù quáng (brute-force).
