import type { GridPosition } from '../layout-editor/types'

export interface ShoppingListItem {
  id: string
  name: string
  category: string
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingListItem[]
}

export interface RouteStop {
  label: string
  position: GridPosition
  items: ShoppingListItem[]
}

export interface RoutePlan {
  stops: RouteStop[]
  legDistances: number[]
  totalDistance: number
  path: GridPosition[]
  unresolvedLabels: string[]
  unreachable: boolean
}
