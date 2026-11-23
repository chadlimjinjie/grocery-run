import { CellType } from './types'

export const STORAGE_KEY = 'grocery-run:layout-editor:v1'

export const DEFAULT_CELL_SIZE = 28
export const MIN_GRID_DIM = 5
export const MAX_GRID_DIM = 60

export const CELL_TYPE_META: Record<CellType, { label: string; color: string }> = {
  [CellType.Empty]: { label: 'Empty', color: '#ffffff' },
  [CellType.Aisle]: { label: 'Aisle', color: '#dbeafe' },
  [CellType.Shelf]: { label: 'Shelf', color: '#d6b98c' },
  [CellType.Wall]: { label: 'Wall', color: '#44403c' },
  [CellType.EntranceCheckout]: { label: 'Entrance/Checkout', color: '#86efac' },
}

export const PAINT_TOOL_ORDER: CellType[] = [
  CellType.Aisle,
  CellType.Shelf,
  CellType.Wall,
  CellType.EntranceCheckout,
  CellType.Empty,
]

export const DEFAULT_CATEGORY_COLOR = '#f97316'

export const DEFAULT_CATEGORIES: string[] = [
  'Dairy',
  'Produce',
  'Bakery',
  'Meat & Seafood',
  'Frozen',
  'Beverages',
  'Snacks',
  'Household',
  'Pharmacy',
  'Deli',
  'Pantry',
]
