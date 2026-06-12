# COMMANDS.md — Registry Lệnh CLI & Quy Tắc An Toàn

> Bảng phân loại mức độ rủi ro của các lệnh terminal trong dự án.
> Mọi agent phải tuân thủ phân loại này khi chạy `run_command`.

---

## ✅ Lệnh Cấp Độ 1: An Toàn (Auto-approved)
Các lệnh chỉ đọc (read-only) hoặc chạy dev environment. Agent có thể tự do chạy mà không cần hỏi.

- **Khám phá & Tìm kiếm:**
  - `grep -r "..."` (nên ưu tiên tool `grep_search` nếu có)
  - `cat <file>` (ưu tiên tool `view_file` nếu có)
- **Kiểm tra trạng thái Git:**
  - `git status`
  - `git log -n 5`
  - `git branch`
  - `git diff`
- **Kiểm tra Code (Verification):**
  - `npx tsc --noEmit` (Kiểm tra TypeScript)
  - `npm run lint` (Kiểm tra ESLint)
- **Chạy Dev Server:**
  - `npm run dev`

---

## ⚠️ Lệnh Cấp Độ 2: Cần Cẩn Trọng (Requires checkpoint)
Các lệnh làm thay đổi state của dự án. Yêu cầu agent phải chắc chắn công việc đã hoàn tất và test kỹ trước khi chạy.

- **Git Operations:**
  - `git add .`
  - `git commit -m "..."`
  - *Lưu ý: Luôn chạy `git diff` trước khi add để đảm bảo không commit rác.*
- **Dependencies:**
  - `npm install <package>`
  - `npm uninstall <package>`
  - *Lưu ý: Chỉ cài package khi thực sự cần thiết và đã báo cho user.*
- **Build:**
  - `npm run build`

---

## 🔴 Lệnh Cấp Độ 3: Nguy Hiểm (Requires human approval)
Các lệnh có tính chất phá hủy, thay đổi dữ liệu hoặc thay đổi kiến trúc lớn. **BẮT BUỘC phải xin phép user trước khi chạy.**

- **Git Destructive:**
  - `git reset --hard`
  - `git checkout -- <file>`
  - `git clean -fd`
  - `git push`
- **File System Destructive:**
  - `rm -rf <dir>`
  - Xóa hàng loạt file.
- **Database Operations:**
  - Các lệnh Supabase CLI làm thay đổi DB thật (push migration lên production).
  - Lệnh drop table, delete data số lượng lớn.

---

## Quy Trình Chạy Lệnh

1. **Xác định lệnh:** Agent chọn lệnh cần chạy.
2. **Kiểm tra cấp độ:** Đối chiếu với danh sách trên.
3. **Thực thi (Action):**
   - Nếu ✅: Chạy ngay.
   - Nếu ⚠️: Chạy nhưng kèm giải thích rõ trong terminal summary.
   - Nếu 🔴: KHÔNG CHẠY. Dùng tool xuất thông báo cho user: *"Tôi cần chạy lệnh `[lệnh]`, nhưng đây là lệnh nguy hiểm. Bạn vui lòng xác nhận."* Mới chạy sau khi user YES.
