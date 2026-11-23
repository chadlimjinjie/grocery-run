import { isWalkable, type GridPosition, type StoreLayout } from '../layout-editor/types'

export interface SearchResult {
  dist: number[][]
  prev: (GridPosition | null)[][]
}

const DIRECTIONS: GridPosition[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
]

export function bfsFrom(layout: StoreLayout, source: GridPosition): SearchResult {
  const { rows, cols, cells } = layout
  const dist: number[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => Infinity))
  const prev: (GridPosition | null)[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null))

  dist[source.row][source.col] = 0
  const queue: GridPosition[] = [source]
  let head = 0

  while (head < queue.length) {
    const current = queue[head++]
    for (const dir of DIRECTIONS) {
      const row = current.row + dir.row
      const col = current.col + dir.col
      if (row < 0 || row >= rows || col < 0 || col >= cols) continue
      if (!isWalkable(cells[row][col])) continue
      if (dist[row][col] !== Infinity) continue
      dist[row][col] = dist[current.row][current.col] + 1
      prev[row][col] = current
      queue.push({ row, col })
    }
  }

  return { dist, prev }
}

export function reconstructPath(search: SearchResult, target: GridPosition): GridPosition[] | null {
  if (search.dist[target.row][target.col] === Infinity) return null
  const path: GridPosition[] = [target]
  let current: GridPosition | null = target
  while (current && search.prev[current.row][current.col]) {
    current = search.prev[current.row][current.col]
    if (current) path.push(current)
  }
  return path.reverse()
}
