import type { ShoppingListItem } from './types'

export const STORAGE_KEY = 'grocery-run:shopping-lists:v1'
export const LEGACY_STORAGE_KEY = 'grocery-run:route-planner:v1'

export function sampleItems(): ShoppingListItem[] {
  const seed: Array<[string, string]> = [
    ['Milk', 'Dairy'],
    ['Eggs', 'Dairy'],
    ['Cheese', 'Dairy'],
    ['Bread', 'Bakery'],
    ['Bagels', 'Bakery'],
    ['Apples', 'Produce'],
    ['Bananas', 'Produce'],
  ]
  return seed.map(([name, category]) => ({ id: crypto.randomUUID(), name, category }))
}
