-- Run this in your Supabase SQL Editor at:
-- https://vkpjoboxhhzvtejrfrtm.supabase.co/project/default/sql

create table if not exists checklist (
  id text primary key,
  task text,
  category text,
  timeline text,
  priority text,
  "assignedTo" text default '',
  status text default 'Not Started',
  notes text default '',
  created_at timestamptz default now()
);

create table if not exists budget (
  id text primary key,
  category text,
  "vendorItem" text,
  "estimatedCost" numeric default 0,
  "actualCost" numeric,
  "depositPaid" numeric,
  "balanceDue" numeric default 0,
  "paymentDueDate" text default '',
  status text default 'Not Paid',
  created_at timestamptz default now()
);

create table if not exists guests (
  id text primary key,
  name text default '',
  "plusOne" text default '',
  "group" text default 'Family',
  "inviteSent" boolean default false,
  "rsvpStatus" text default 'Pending',
  "mealPreference" text default '',
  "dietaryNeeds" text default '',
  "tableNumber" integer,
  "giftReceived" boolean default false,
  "thankYouSent" boolean default false,
  created_at timestamptz default now()
);

create table if not exists vendors (
  id text primary key,
  category text,
  "vendorName" text default '',
  "contactPerson" text default '',
  phone text default '',
  email text default '',
  website text default '',
  "contractSigned" boolean default false,
  "depositPaid" boolean default false,
  notes text default '',
  created_at timestamptz default now()
);

create table if not exists timeline (
  id text primary key,
  time text,
  event text,
  location text,
  responsible text,
  notes text default '',
  created_at timestamptz default now()
);

create table if not exists payments (
  id text primary key,
  vendor text,
  description text,
  amount numeric default 0,
  "dueDate" text default '',
  "datePaid" text default '',
  method text default '',
  status text default 'Pending',
  created_at timestamptz default now()
);

create table if not exists notes (
  id text primary key,
  category text,
  idea text default '',
  source text default '',
  priority text default '',
  created_at timestamptz default now()
);

-- Allow public read/write (the app uses auth at the Next.js middleware level)
alter table checklist enable row level security;
alter table budget enable row level security;
alter table guests enable row level security;
alter table vendors enable row level security;
alter table timeline enable row level security;
alter table payments enable row level security;
alter table notes enable row level security;

create policy "allow all" on checklist for all using (true) with check (true);
create policy "allow all" on budget for all using (true) with check (true);
create policy "allow all" on guests for all using (true) with check (true);
create policy "allow all" on vendors for all using (true) with check (true);
create policy "allow all" on timeline for all using (true) with check (true);
create policy "allow all" on payments for all using (true) with check (true);
create policy "allow all" on notes for all using (true) with check (true);

-- Vendor suggestions (from daily AI research cron)
create table if not exists vendor_suggestions (
  id text primary key,
  category text default '',
  name text default '',
  description text default '',
  website text default '',
  instagram text default '',
  phone text default '',
  source text default '',
  approved boolean default false,
  created_at timestamptz default now()
);

alter table vendor_suggestions enable row level security;
create policy "allow all" on vendor_suggestions for all using (true) with check (true);
