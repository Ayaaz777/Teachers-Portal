---
name: rme-two-portals
description: >-
  Defines the two user-facing portals in this payslip Electron app — admin vs
  teachers — and when to scope features, UI, IPC, and data to each. Use when
  working on renderer nav modes, dock, auth, Notion payslip views, Supabase
  teacher tables, or when the user mentions admin portal, teachers portal,
  isTeacherNavMode, or who a change is for.
---

# Two portals in this app (always remember)

Even though these two sections of portals in this app are:

- the admin portal (for me, the admin, the dev, who works on it)
- the teachers portal (for the teachers that need to see the specific payslips)

## Agent guidance

- **Admin portal**: full app surface — Notion workspace, Vault, Names & Notion row IDs, dashboard cards, floating draft sheets, admin-only IPC, `hasAdmin()` / allowlist patterns, dev workflows.
- **Teachers portal**: constrained surface — teacher nav (`isTeacherNavMode`), dock without admin-only actions, teacher dashboard, teacher pay slips (filtered to that teacher’s rows), profile; no admin directory or global Notion admin tools unless explicitly bridged and gated.
- When the user does not say which portal, infer from context (teacher account vs admin), or ask once.
- Do not ship admin-only controls, secrets, or unfiltered payslip grids in the teachers portal. Do not require teachers to use admin-only tables or pages to see their own slips.

## Code anchors (non-exhaustive)

- Teacher vs admin UI branching often uses `isTeacherNavMode` and related helpers in `renderer.js`.
- Teacher payslip data path: `loadTeacherPaySlips`, `fetchTeacherPaySlipTable`, Notion person link / `payslip_notion_person_links`, migration `011_teacher_notion_person_resolve.sql`.

For engineering detail and repo-wide rules, pair with `.cursor/skills/rme-teachers-portal/SKILL.md`.
