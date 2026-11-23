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

    const coldIdx: number[] = []
    const nonColdIdx: number[] = []
    resolved.forEach((stop, i) => (stop.marker.coldChain ? coldIdx.push(i) : nonColdIdx.push(i)))

    let order: number[]
    let legDistances: number[]
    let totalDistance: number

    if (coldIdx.length === 0) {
      const result = computeOptimalOrder(distFromStart, distToEnd, distMatrix)
      order = result.order
      legDistances = result.legDistances
      totalDistance = result.totalDistance
    } else {
      const phase1 = computeOptimalOrder(
        nonColdIdx.map((i) => distFromStart[i]),
        nonColdIdx.map(() => 0),
        nonColdIdx.map((i) => nonColdIdx.map((j) => distMatrix[i][j])),
      )
      const order1 = phase1.order.map((localIdx) => nonColdIdx[localIdx])

      const entrySearch = order1.length > 0 ? waypointSearches[order1[order1.length - 1]] : startSearch

      const phase2 = computeOptimalOrder(
        coldIdx.map((i) => entrySearch.dist[resolved[i].marker.position.row][resolved[i].marker.position.col]),
        coldIdx.map((i) => distToEnd[i]),
        coldIdx.map((i) => coldIdx.map((j) => distMatrix[i][j])),
      )
      const order2 = phase2.order.map((localIdx) => coldIdx[localIdx])

      const phase1Unreachable = order1.length !== nonColdIdx.length
      const phase2Unreachable = order2.length !== coldIdx.length || phase2.totalDistance === Infinity

      if (phase1Unreachable || phase2Unreachable) {
        order = []
        legDistances = []
        totalDistance = Infinity
      } else {
        order = [...order1, ...order2]
        legDistances = [...phase1.legDistances.slice(0, -1), ...phase2.legDistances]
        totalDistance = legDistances.reduce((sum, d) => sum + d, 0)
      }
    }

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
