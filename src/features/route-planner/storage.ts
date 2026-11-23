import { LEGACY_STORAGE_KEY, STORAGE_KEY } from './constants'
import type { ShoppingList, ShoppingListItem } from './types'

export interface ShoppingListsState {
  lists: ShoppingList[]
  selectedId: string | null
}

function isValidItem(item: unknown): item is ShoppingListItem {
  return (
    !!item &&
    typeof (item as ShoppingListItem).id === 'string' &&
    typeof (item as ShoppingListItem).name === 'string' &&
    typeof (item as ShoppingListItem).category === 'string'
  )
}

function isValidState(parsed: unknown): parsed is ShoppingListsState {
  if (!parsed || typeof parsed !== 'object') return false
  const state = parsed as ShoppingListsState
  if (!Array.isArray(state.lists)) return false
  return state.lists.every(
    (list) =>
      list &&
      typeof list.id === 'string' &&
      typeof list.name === 'string' &&
      Array.isArray(list.items) &&
      list.items.every(isValidItem),
  )
}

function migrateLegacyList(): ShoppingListsState | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isValidItem)) return null
    const id = crypto.randomUUID()
    const state: ShoppingListsState = { lists: [{ id, name: 'My List', items: parsed }], selectedId: id }
    saveShoppingLists(state)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    return state
  } catch {
    return null
  }
}

export function loadShoppingLists(): ShoppingListsState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (isValidState(parsed)) return parsed
    }
  } catch {
    // fall through to migration
  }
  return migrateLegacyList()
}

export function saveShoppingLists(state: ShoppingListsState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearShoppingLists(): void {
  localStorage.removeItem(STORAGE_KEY)
}
