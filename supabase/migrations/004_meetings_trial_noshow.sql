-- ============================================================================
-- Murtaqa — Meetings table enhancements (trial sessions & no_show status)
-- ============================================================================

-- 1. Add is_trial column to distinguish trial sessions from regular ones
alter table public.meetings
  add column if not exists is_trial boolean not null default false;

-- 2. Expand meetings.status to include 'no_show'
-- Current constraint is checking ('scheduled','completed','cancelled')
alter table public.meetings
  drop constraint if exists meetings_status_check;

alter table public.meetings
  add constraint meetings_status_check
  check (status in ('scheduled','completed','cancelled','no_show'));
