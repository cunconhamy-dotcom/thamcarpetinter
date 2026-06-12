# AGENTS.md — Carpets Inter Vietnam
> **Behavioral Contract cho tất cả AI Agents** (Antigravity · Claude Code · Codex)
> Đây là file duy nhất được đọc đầu tiên. Mọi agent PHẢI tuân theo tài liệu này.

---

## 1. PROJECT OVERVIEW (WHAT)

**Tên dự án:** Carpets Inter Vietnam — Website thương mại điện tử thảm sàn modular cao cấp
**Thương hiệu:** Carpets Inter (TCM Corporation Plc.) — Đại diện phân phối tại Việt Nam
**Slogan:** *"Elevate Spaces, Empower Living"*

### Codebase Map
```
D:\Thiết kế website thảm sàn carpet\
├── AGENTS.md                    ← File này — đọc trước tiên
├── .cursorrules                 ← Agent behavior rules
├── docs/
│   ├── agents/
│   │   ├── ROLES.md             ← Định nghĩa vai trò agent
│   │   ├── WORKFLOWS.md         ← Luồng làm việc chi tiết
│   │   ├── COMMANDS.md          ← Registry lệnh CLI
│   │   └── CONTEXT.md           ← Trạng thái dự án hiện tại
│   ├── carpetsinter-dna.md      ← Brand DNA, collections, tone of voice
│   ├── design-system.md         ← Color tokens, typography, components
│   └── content-guide.md         ← Hướng dẫn viết content
├── src/
│   ├── PublicApp.tsx            ← 🌐 PUBLIC: Toàn bộ website công khai
│   ├── App.tsx                  ← Router root (public + admin)
│   ├── components/
│   │   ├── layout/              ← Admin layout components
│   │   └── ui/                  ← Shared UI components
│   ├── pages/admin/             ← 🔧 ADMIN: Dashboard, quản lý
│   ├── styles/                  ← Design tokens, animations
│   ├── lib/                     ← Utilities, helpers
│   ├── types/                   ← TypeScript type definitions
│   └── contexts/                ← React Context providers
├── supabase/                    ← Database migrations, schema
└── docs/                        ← Tài liệu dự án
```

---

## 2. PURPOSE (WHY)

- **Website công khai (Public):** Giới thiệu 9+ bộ sưu tập thảm, tạo leads, liên hệ B2B với kiến trúc sư, nhà thiết kế nội thất, chủ đầu tư tại Việt Nam
- **Admin Dashboard:** Quản lý sản phẩm, collections, leads, nội dung CMS
- **Target audience:** Kiến trúc sư, nhà thiết kế nội thất, chủ đầu tư dự án thương mại

---

## 3. TECH STACK (HOW)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Build Tool | Vite | 7.x |
| Language | TypeScript | 5.9.x |
| Styling | **TailwindCSS v4** | 4.2.x |
| Animation | Framer Motion | 12.x |
| Database | Supabase | 2.x |
| AI SDK | @google/genai | 2.x |
| Forms | React Hook Form + Zod | latest |
| Icons | Lucide React | latest |
| Testing | Playwright | 1.60.x |
| Routing | React Router DOM | 7.x |
| Toasts | Sonner | latest |

---

## 4. MANDATORY CODING RULES

### 4.1 Styling
- ✅ **DÙNG TailwindCSS v4** — là CSS engine chính của dự án
- ✅ Design tokens trong `src/styles/tokens.ts` — luôn tham khảo trước
- ✅ Animation variants trong `src/styles/animations.ts`
- ❌ KHÔNG viết CSS-in-JS hoặc inline styles trừ khi bất khả kháng
- ❌ KHÔNG tạo file `.css` mới cho components — dùng Tailwind class

### 4.2 Component Patterns
- ✅ Functional components + TypeScript interfaces (không dùng `any`)
- ✅ Framer Motion cho mọi animation — tham khảo `src/styles/animations.ts`
- ✅ Custom hooks trong `src/hooks/` khi logic phức tạp
- ✅ Zod schema cho mọi form validation
- ❌ KHÔNG dùng class components
- ❌ KHÔNG dùng `useEffect` để fetch data — dùng React Query nếu có, hoặc Supabase real-time

### 4.3 File Conventions
- Component files: `PascalCase.tsx`
- Hook files: `useCamelCase.ts`
- Utility files: `camelCase.ts`
- Type files: `camelCase.types.ts`

### 4.4 Design System
- **Primary color:** `#f29d38` (amber/gold)
- **Background:** `#120b08` (deep dark brown)
- **Fonts:** Playfair Display (headings) + Inter (body)
- **Glass card:** `backdrop-blur-xl bg-white/6 border border-white/10 rounded-[24px]`

---

## 5. DOMAIN BOUNDARIES (STRICT)

```
┌─────────────────────────────────────────────────────────┐
│ PUBLIC DOMAIN                                           │
│ Files: PublicApp.tsx, src/components/ui/               │
│ Owner: Public UI Agent                                  │
│ ← KHÔNG AI khác được modify nếu không có lệnh rõ ràng  │
├─────────────────────────────────────────────────────────┤
│ ADMIN DOMAIN                                            │
│ Files: src/pages/admin/, src/components/layout/        │
│ Owner: Admin Agent                                      │
│ ← KHÔNG AI khác được modify nếu không có lệnh rõ ràng  │
├─────────────────────────────────────────────────────────┤
│ DATA DOMAIN                                             │
│ Files: supabase/, src/lib/, src/types/                 │
│ Owner: Data Agent                                       │
│ ← Schema changes phải có human approval                 │
├─────────────────────────────────────────────────────────┤
│ SHARED DOMAIN (Đọc thoải mái, sửa cẩn thận)            │
│ Files: src/styles/, src/contexts/, src/hooks/          │
│ Owner: Any agent (nhưng phải thông báo trước)           │
└─────────────────────────────────────────────────────────┘
```

---

## 6. VERIFICATION CHECKLIST

Trước khi kết thúc bất kỳ task nào, agent PHẢI verify:

```bash
# 1. TypeScript check (không có type errors)
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Dev server khởi động được (nếu thay đổi lớn)
npm run dev

# 4. Commit checkpoint
git add .
git commit -m "feat/fix/chore: [mô tả ngắn gọn]"
```

---

## 7. GIT COMMIT CONVENTIONS

Format: `<type>(<scope>): <description>`

| Type | Khi nào dùng |
|------|-------------|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `style` | Thay đổi UI/CSS |
| `refactor` | Tái cấu trúc code |
| `docs` | Cập nhật tài liệu |
| `chore` | Config, dependencies |
| `data` | Supabase schema/migrations |

**Ví dụ:** `feat(public): add Groundwork collection hero section`

---

## 8. HANDOFF PROTOCOL

Khi một agent hoàn thành task và cần chuyển sang agent khác:

1. **Commit** tất cả thay đổi
2. **Cập nhật** `docs/agents/CONTEXT.md` với trạng thái hiện tại
3. **Ghi rõ** trong commit message: `handoff: [agent-role-tiếp-theo] - [task-cần-làm]`

---

## 9. REFERENCES

- Brand DNA: [`docs/carpetsinter-dna.md`](./docs/carpetsinter-dna.md)
- Design System: [`docs/design-system.md`](./docs/design-system.md)
- Agent Roles: [`docs/agents/ROLES.md`](./docs/agents/ROLES.md)
- Workflows: [`docs/agents/WORKFLOWS.md`](./docs/agents/WORKFLOWS.md)
- Commands: [`docs/agents/COMMANDS.md`](./docs/agents/COMMANDS.md)
- Project Status: [`docs/agents/CONTEXT.md`](./docs/agents/CONTEXT.md)
