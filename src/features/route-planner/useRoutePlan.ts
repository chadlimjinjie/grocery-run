import { useMemo } from 'react'
import type { StoreLayout } from '../layout-editor/types'
import { bfsFrom, reconstructPath } from './grid-search'
import { resolveCategories } from './resolve-categories'
import { computeOptimalOrder } from './route-order'
import type { RoutePlan, ShoppingListItem } from './types'

export function useRoutePlan(layout: StoreLayout | null, items: ShoppingListItem[]): RoutePlan | null {
  return useMemo(() => {
    if (!layout) return null
    const start = layout.markers.find((m) => m.kind === 'start')
    const end = layout.markers.find((m) => m.kind === 'end')
    if (!start || !end) return null

    const { resolved, unresolved } = resolveCategories(items, layout.markers, start.position, layout)

    if (resolved.length === 0) {
      return {
        stops: [],
        legDistances: [],
        totalDistance: 0,
        path: [],
        unresolvedLabels: unresolved,
        unreachable: false,
      }
    }

    const startSearch = bfsFrom(layout, start.position)
    const waypointSearches = resolved.map((stop) => bfsFrom(layout, stop.marker.position))

    const distFromStart = resolved.map((stop) => startSearch.dist[stop.marker.position.row][stop.marker.position.col])
    const distToEnd = resolved.map((_, i) => waypointSearches[i].dist[end.position.row][end.position.col])
    const distMatrix = resolved.map((_, i) =>
      resolved.map((_, j) => {
        if (i === j) return 0
        const target = resolved[j].marker.position
        return waypointSearches[i].dist[target.row][target.col]
      }),
    )

    const { order, totalDistance, legDistances } = computeOptimalOrder(distFromStart, distToEnd, distMatrix)

    if (order.length === 0 || totalDistance === Infinity) {
      return {
        stops: [],
        legDistances: [],
        totalDistance: 0,
        path: [],
        unresolvedLabels: unresolved,
        unreachable: true,
      }
    }

    const stops = order.map((idx) => ({ label: resolved[idx].label, position: resolved[idx].marker.position }))

    const path = [
      ...(reconstructPath(startSearch, resolved[order[0]].marker.position) ?? []),
    ]
    for (let i = 1; i < order.length; i++) {
      const fromIdx = order[i - 1]
      const toPos = resolved[order[i]].marker.position
      const segment = reconstructPath(waypointSearches[fromIdx], toPos) ?? []
      path.push(...segment.slice(1))
    }
    const lastIdx = order[order.length - 1]
    const finalSegment = reconstructPath(waypointSearches[lastIdx], end.position) ?? []
    path.push(...finalSegment.slice(1))

    return {
      stops,
      legDistances,
      totalDistance,
      path,
      unresolvedLabels: unresolved,
      unreachable: false,
    }
  }, [layout, items])
}
