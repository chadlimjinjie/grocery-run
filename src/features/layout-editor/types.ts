export const CellType = {
  Empty: 'empty',
  Aisle: 'aisle',
  Shelf: 'shelf',
  Wall: 'wall',
  EntranceCheckout: 'entrance_checkout',
} as const
export type CellType = (typeof CellType)[keyof typeof CellType]

export const OBSTACLE_CELL_TYPES: ReadonlySet<CellType> = new Set([CellType.Shelf, CellType.Wall])
export const isWalkable = (cell: CellType) => !OBSTACLE_CELL_TYPES.has(cell)

export interface GridPosition {
  row: number
  col: number
}

export interface CategoryMarker {
  id: string
  kind: 'category'
  label: string
  color: string
  position: GridPosition
  coldChain: boolean
}

export interface EndpointMarker {
  id: string
  kind: 'start' | 'end'
  position: GridPosition
}

export type Marker = CategoryMarker | EndpointMarker

export interface StoreLayout {
  schemaVersion: 1
  id: string
  name: string
  rows: number
  cols: number
  cells: CellType[][]
  markers: Marker[]
  updatedAt: string
}

export function findMarkerAt(markers: Marker[], position: GridPosition): Marker | undefined {
  return markers.find((m) => m.position.row === position.row && m.position.col === position.col)
}

export type Tool =
  | { kind: 'paint'; cellType: CellType }
  | { kind: 'place-marker'; markerKind: 'start' | 'end' }
  | { kind: 'place-category'; label: string; color: string; coldChain: boolean }
  | { kind: 'select' }
