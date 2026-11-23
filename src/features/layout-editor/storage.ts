import { STORAGE_KEY } from './constants'
import type { StoreLayout } from './types'

export function loadLayout(): StoreLayout | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.schemaVersion !== 1 || !Array.isArray(parsed.cells)) return null
    return parsed as StoreLayout
  } catch {
    return null
  }
}

export function saveLayout(layout: StoreLayout): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layout))
}

export function clearLayout(): void {
  localStorage.removeItem(STORAGE_KEY)
}
