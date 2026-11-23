import type { CategoryMarker, GridPosition, Marker, StoreLayout } from '../layout-editor/types'
import { bfsFrom } from './grid-search'
import type { ShoppingListItem } from './types'

export interface ResolvedStop {
  label: string
  marker: CategoryMarker
  items: ShoppingListItem[]
}

export interface ResolutionResult {
  resolved: ResolvedStop[]
  unresolved: string[]
}

function normalize(label: string): string {
  return label.trim().toLowerCase()
}

export function resolveCategories(
  items: ShoppingListItem[],
  markers: Marker[],
  startPosition: GridPosition,
  layout: StoreLayout,
): ResolutionResult {
  const markersByLabel = new Map<string, CategoryMarker[]>()
  for (const marker of markers) {
    if (marker.kind !== 'category') continue
    const key = normalize(marker.label)
    const list = markersByLabel.get(key) ?? []
    list.push(marker)
    markersByLabel.set(key, list)
  }

  const neededLabels = new Map<string, { displayLabel: string; items: ShoppingListItem[] }>()
  for (const item of items) {
    const key = normalize(item.category)
    if (!key) continue
    const existing = neededLabels.get(key)
    if (existing) existing.items.push(item)
    else neededLabels.set(key, { displayLabel: item.category.trim(), items: [item] })
  }

  const resolved: ResolvedStop[] = []
  const unresolved: string[] = []
  let startSearch: ReturnType<typeof bfsFrom> | null = null

  for (const [key, { displayLabel, items: groupItems }] of neededLabels) {
    const candidates = markersByLabel.get(key)
    if (!candidates || candidates.length === 0) {
      unresolved.push(displayLabel)
      continue
    }
    if (candidates.length === 1) {
      resolved.push({ label: displayLabel, marker: candidates[0], items: groupItems })
      continue
    }
    if (!startSearch) startSearch = bfsFrom(layout, startPosition)
    let nearest = candidates[0]
    let nearestDist = startSearch.dist[nearest.position.row][nearest.position.col]
    for (const candidate of candidates.slice(1)) {
      const d = startSearch.dist[candidate.position.row][candidate.position.col]
      if (d < nearestDist) {
        nearestDist = d
        nearest = candidate
      }
    }
    resolved.push({ label: displayLabel, marker: nearest, items: groupItems })
  }

  return { resolved, unresolved }
}
