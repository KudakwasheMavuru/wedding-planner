"use client";

import {
  CHECKLIST_ITEMS, BUDGET_ITEMS, INITIAL_GUESTS, INITIAL_VENDORS,
  TIMELINE_EVENTS, PAYMENT_ITEMS, INITIAL_NOTES,
  ChecklistItem, BudgetItem, Guest, Vendor, TimelineEvent, PaymentItem, Note
} from "./data";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getChecklist(): ChecklistItem[] {
  return load("wp_checklist", CHECKLIST_ITEMS);
}
export function saveChecklist(items: ChecklistItem[]): void {
  save("wp_checklist", items);
}

export function getBudget(): BudgetItem[] {
  return load("wp_budget", BUDGET_ITEMS);
}
export function saveBudget(items: BudgetItem[]): void {
  save("wp_budget", items);
}

export function getGuests(): Guest[] {
  return load("wp_guests", INITIAL_GUESTS);
}
export function saveGuests(items: Guest[]): void {
  save("wp_guests", items);
}

export function getVendors(): Vendor[] {
  return load("wp_vendors", INITIAL_VENDORS);
}
export function saveVendors(items: Vendor[]): void {
  save("wp_vendors", items);
}

export function getTimeline(): TimelineEvent[] {
  return load("wp_timeline", TIMELINE_EVENTS);
}
export function saveTimeline(items: TimelineEvent[]): void {
  save("wp_timeline", items);
}

export function getPayments(): PaymentItem[] {
  return load("wp_payments", PAYMENT_ITEMS);
}
export function savePayments(items: PaymentItem[]): void {
  save("wp_payments", items);
}

export function getNotes(): Note[] {
  return load("wp_notes", INITIAL_NOTES);
}
export function saveNotes(items: Note[]): void {
  save("wp_notes", items);
}
