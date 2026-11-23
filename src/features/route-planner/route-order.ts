export interface OrderResult {
  order: number[]
  totalDistance: number
  legDistances: number[]
}

const EXACT_SOLVE_LIMIT = 13

export function computeOptimalOrder(
  distFromStart: number[],
  distToEnd: number[],
  distMatrix: number[][],
): OrderResult {
  const n = distFromStart.length
  if (n === 0) return { order: [], totalDistance: 0, legDistances: [] }
  return n <= EXACT_SOLVE_LIMIT
    ? heldKarp(distFromStart, distToEnd, distMatrix)
    : nearestNeighborThenTwoOpt(distFromStart, distToEnd, distMatrix)
}

function legDistancesFor(order: number[], distFromStart: number[], distToEnd: number[], distMatrix: number[][]) {
  const legs: number[] = []
  let total = 0
  let prevDist = distFromStart[order[0]]
  legs.push(prevDist)
  total += prevDist
  for (let i = 1; i < order.length; i++) {
    const d = distMatrix[order[i - 1]][order[i]]
    legs.push(d)
    total += d
  }
  const last = distToEnd[order[order.length - 1]]
  legs.push(last)
  total += last
  return { legs, total }
}

function heldKarp(distFromStart: number[], distToEnd: number[], distMatrix: number[][]): OrderResult {
  const n = distFromStart.length
  const numMasks = 1 << n
  const dp: number[][] = Array.from({ length: numMasks }, () => Array.from({ length: n }, () => Infinity))
  const parent: number[][] = Array.from({ length: numMasks }, () => Array.from({ length: n }, () => -1))

  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = distFromStart[i]
  }

  for (let mask = 1; mask < numMasks; mask++) {
    for (let i = 0; i < n; i++) {
      if (!(mask & (1 << i))) continue
      const current = dp[mask][i]
      if (current === Infinity) continue
      for (let j = 0; j < n; j++) {
        if (mask & (1 << j)) continue
        const nextMask = mask | (1 << j)
        const candidate = current + distMatrix[i][j]
        if (candidate < dp[nextMask][j]) {
          dp[nextMask][j] = candidate
          parent[nextMask][j] = i
        }
      }
    }
  }

  const fullMask = numMasks - 1
  let best = Infinity
  let bestLast = -1
  for (let i = 0; i < n; i++) {
    const candidate = dp[fullMask][i] + distToEnd[i]
    if (candidate < best) {
      best = candidate
      bestLast = i
    }
  }

  if (bestLast === -1 || best === Infinity) {
    return { order: [], totalDistance: Infinity, legDistances: [] }
  }

  const order: number[] = []
  let mask = fullMask
  let last = bestLast
  while (last !== -1) {
    order.push(last)
    const prevLast = parent[mask][last]
    mask ^= 1 << last
    last = prevLast
  }
  order.reverse()

  const { legs, total } = legDistancesFor(order, distFromStart, distToEnd, distMatrix)
  return { order, totalDistance: total, legDistances: legs }
}

function nearestNeighborThenTwoOpt(
  distFromStart: number[],
  distToEnd: number[],
  distMatrix: number[][],
): OrderResult {
  const n = distFromStart.length
  const visited = new Array<boolean>(n).fill(false)
  let order: number[] = []
  let current = -1

  for (let step = 0; step < n; step++) {
    let bestNext = -1
    let bestDist = Infinity
    for (let candidate = 0; candidate < n; candidate++) {
      if (visited[candidate]) continue
      const d = current === -1 ? distFromStart[candidate] : distMatrix[current][candidate]
      if (d < bestDist) {
        bestDist = d
        bestNext = candidate
      }
    }
    if (bestNext === -1) break
    visited[bestNext] = true
    order.push(bestNext)
    current = bestNext
  }

  const legCost = (seq: number[]) => legDistancesFor(seq, distFromStart, distToEnd, distMatrix).total

  let improved = true
  let iterations = 0
  const MAX_ITERATIONS = 500
  while (improved && iterations < MAX_ITERATIONS) {
    improved = false
    iterations++
    for (let i = 0; i < order.length - 1; i++) {
      for (let j = i + 1; j < order.length; j++) {
        const candidate = order.slice(0, i).concat(order.slice(i, j + 1).reverse(), order.slice(j + 1))
        if (legCost(candidate) < legCost(order)) {
          order = candidate
          improved = true
        }
      }
    }
  }

  const { legs, total } = legDistancesFor(order, distFromStart, distToEnd, distMatrix)
  return { order, totalDistance: total, legDistances: legs }
}
