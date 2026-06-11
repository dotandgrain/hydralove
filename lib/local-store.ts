"use client";

export function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
}

export function saveLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
