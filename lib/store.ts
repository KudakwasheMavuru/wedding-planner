import { supabase } from "./supabase";
import {
  CHECKLIST_ITEMS, BUDGET_ITEMS, INITIAL_GUESTS, INITIAL_VENDORS,
  TIMELINE_EVENTS, PAYMENT_ITEMS, INITIAL_NOTES,
  ChecklistItem, BudgetItem, Guest, Vendor, TimelineEvent, PaymentItem, Note,
} from "./data";

async function fetchOrSeed<T extends { id: string }>(
  table: string,
  seed: T[],
): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("*").order("created_at" as never, { ascending: true });
  if (error) {
    // table might not have created_at — fall back
    const { data: d2 } = await supabase.from(table).select("*");
    if (d2 && d2.length > 0) return d2 as T[];
    // Empty — seed it
    await supabase.from(table).insert(seed as never[]);
    return seed;
  }
  if (data && data.length > 0) return data as T[];
  await supabase.from(table).insert(seed as never[]);
  return seed;
}

async function fullSync<T extends { id: string }>(table: string, items: T[]): Promise<void> {
  await supabase.from(table).delete().neq("id", "__never__");
  if (items.length > 0) await supabase.from(table).insert(items as never[]);
}

// Checklist
export async function getChecklist(): Promise<ChecklistItem[]> {
  return fetchOrSeed("checklist", CHECKLIST_ITEMS);
}
export async function saveChecklist(items: ChecklistItem[]): Promise<void> {
  await fullSync("checklist", items);
}

// Budget
export async function getBudget(): Promise<BudgetItem[]> {
  return fetchOrSeed("budget", BUDGET_ITEMS);
}
export async function saveBudget(items: BudgetItem[]): Promise<void> {
  await fullSync("budget", items);
}

// Guests
export async function getGuests(): Promise<Guest[]> {
  return fetchOrSeed("guests", INITIAL_GUESTS);
}
export async function saveGuests(items: Guest[]): Promise<void> {
  await fullSync("guests", items);
}

// Vendors
export async function getVendors(): Promise<Vendor[]> {
  return fetchOrSeed("vendors", INITIAL_VENDORS);
}
export async function saveVendors(items: Vendor[]): Promise<void> {
  await fullSync("vendors", items);
}

// Timeline
export async function getTimeline(): Promise<TimelineEvent[]> {
  return fetchOrSeed("timeline", TIMELINE_EVENTS);
}
export async function saveTimeline(items: TimelineEvent[]): Promise<void> {
  await fullSync("timeline", items);
}

// Payments
export async function getPayments(): Promise<PaymentItem[]> {
  return fetchOrSeed("payments", PAYMENT_ITEMS);
}
export async function savePayments(items: PaymentItem[]): Promise<void> {
  await fullSync("payments", items);
}

// Notes
export async function getNotes(): Promise<Note[]> {
  return fetchOrSeed("notes", INITIAL_NOTES);
}
export async function saveNotes(items: Note[]): Promise<void> {
  await fullSync("notes", items);
}
