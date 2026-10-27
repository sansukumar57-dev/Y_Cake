import type { PickupSlot } from "./types";

export const PICKUP_SLOTS: PickupSlot[] = [
  { value: "10:00-12:00", label: "10:00 am – 12:00 pm" },
  { value: "13:00-15:00", label: "1:00 pm – 3:00 pm" },
  { value: "16:00-18:00", label: "4:00 pm – 6:00 pm" },
];

export const MIN_LEAD_DAYS = 3;
export const MAX_LEAD_DAYS = 90;

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDaysIso(days: number) {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

export function getMinPickupDate() {
  return addDaysIso(MIN_LEAD_DAYS);
}

export function getMaxPickupDate() {
  return addDaysIso(MAX_LEAD_DAYS);
}

export function isValidPickupDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || toIsoDate(parsed) !== value) {
    return false;
  }
  return value >= getMinPickupDate() && value <= getMaxPickupDate();
}

export function formatPickupDate(value: string) {
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatShortDate(value: string) {
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function getPickupSlotLabel(value: string) {
  return PICKUP_SLOTS.find((slot) => slot.value === value)?.label ?? value;
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}
