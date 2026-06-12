# CONTEXT.md — Trạng Thái Dự Án

> Snapshot trạng thái hiện tại của dự án.
> **Last Updated:** 2026-06-12
> **Updated By:** Architect Agent

---

## 1. Trạng Thái Tổng Quan
- **Giai đoạn:** Thiết lập môi trường và Agent Architecture (Mới khởi tạo).
- **Core Framework:** React 19, Vite, TypeScript, TailwindCSS v4 đã được cài đặt và config.
- **Thư mục code chính:** Đã có `src/PublicApp.tsx` (Public Site), `src/pages/admin/` (Admin Dashboard).

## 2. Features Đã Hoàn Thành
- [x] Khởi tạo project React + Vite.
- [x] Cài đặt TailwindCSS v4 và Framer Motion.
- [x] Thiết lập `design-system.md` (Color tokens, typography).
- [x] Setup tài liệu Brand DNA (`carpetsinter-dna.md`).
- [x] **Agent Architecture:** Thiết lập file `AGENTS.md`, `ROLES.md`, `WORKFLOWS.md`, `COMMANDS.md`.

## 3. Features Đang Thực Hiện (WIP)
- Chuyển giao từ code HTML/CSS cũ sang React component system.
- Cấu trúc lại `PublicApp.tsx` thành các UI components nhỏ gọn (đang xem xét refactor).

## 4. Known Issues / Tech Debt
- `PublicApp.tsx` hiện tại rất lớn (hơn 55KB), cần được refactor chia nhỏ thành các components (Hero, Footer, CollectionSection...) bởi Public UI Agent.
- Cần dọn dẹp các file rác ở thư mục gốc (như các file `.cjs`, `.txt`, `.zip` không cần thiết) khi dự án đi vào ổn định.

## 5. Architectural Decisions (ADR)
- **ADR-001 (Agent Structure):** Áp dụng mô hình Supervisor với 8 Agents chuyên biệt. Domain ranh giới cứng (Strict Boundaries).
- **ADR-002 (Styling):** Dùng TailwindCSS v4 làm engine chính thay vì Vanilla CSS, vẫn tận dụng CSS variables cho tokens. Không dùng CSS modules.
- **ADR-003 (Animations):** Tập trung dùng Framer Motion, định nghĩa sẵn variants tại `src/styles/animations.ts`.

---

## 📌 Handoff Note
*(Ghi chú cho Agent tiếp theo)*
- **Agent tiếp theo:** Architect / Public UI Agent
- **Nhiệm vụ:** Phân tích `PublicApp.tsx` và tiến hành bóc tách thành các UI components theo chuẩn design system mới. Mọi thứ đã sẵn sàng.
