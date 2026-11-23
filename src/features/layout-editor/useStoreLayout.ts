import { useCallback, useEffect, useRef, useState } from 'react'
import { clearLayout, loadLayout, saveLayout } from './storage'
import type { CategoryMarker, CellType, GridPosition, Marker, StoreLayout } from './types'

function createEmptyLayout(rows: number, cols: number, name: string, cellType: CellType): StoreLayout {
  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    name,
    rows,
    cols,
    cells: Array.from({ length: rows }, () => Array.from({ length: cols }, () => cellType)),
    markers: [],
    updatedAt: new Date().toISOString(),
  }
}

export function useStoreLayout() {
  const [layout, setLayout] = useState<StoreLayout | null>(() => loadLayout())
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!layout) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveLayout(layout), 300)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [layout])

  const createLayout = useCallback(
    (rows: number, cols: number, name = 'My Store') => {
      setLayout(createEmptyLayout(rows, cols, name, 'empty' as CellType))
    },
    [],
  )

  const paintCell = useCallback((row: number, col: number, cellType: CellType) => {
    setLayout((prev) => {
      if (!prev) return prev
      if (prev.cells[row]?.[col] === cellType) return prev
      const nextRow = prev.cells[row].slice()
      nextRow[col] = cellType
      const nextCells = prev.cells.slice()
      nextCells[row] = nextRow
      return { ...prev, cells: nextCells, updatedAt: new Date().toISOString() }
    })
  }, [])

  const placeMarker = useCallback((position: GridPosition, markerKind: 'start' | 'end') => {
    setLayout((prev) => {
      if (!prev) return prev
      const remaining = prev.markers.filter((m) => m.kind !== markerKind)
      const marker: Marker = { id: crypto.randomUUID(), kind: markerKind, position }
      return { ...prev, markers: [...remaining, marker], updatedAt: new Date().toISOString() }
    })
  }, [])

  const placeCategoryMarker = useCallback(
    (position: GridPosition, label: string, color: string, coldChain: boolean) => {
      setLayout((prev) => {
        if (!prev) return prev
        const marker: CategoryMarker = {
          id: crypto.randomUUID(),
          kind: 'category',
          label,
          color,
          position,
          coldChain,
        }
        return { ...prev, markers: [...prev.markers, marker], updatedAt: new Date().toISOString() }
      })
    },
    [],
  )

  const updateCategoryMarker = useCallback(
    (id: string, patch: { label: string; color: string; coldChain: boolean }) => {
      setLayout((prev) => {
        if (!prev) return prev
        const markers = prev.markers.map((m) => (m.id === id && m.kind === 'category' ? { ...m, ...patch } : m))
        return { ...prev, markers, updatedAt: new Date().toISOString() }
      })
    },
    [],
  )

  const removeMarker = useCallback((id: string) => {
    setLayout((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        markers: prev.markers.filter((m) => m.id !== id),
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const resetLayout = useCallback(() => {
    clearLayout()
    setLayout(null)
  }, [])

  return {
    layout,
    createLayout,
    paintCell,
    placeMarker,
    placeCategoryMarker,
    updateCategoryMarker,
    removeMarker,
    resetLayout,
  }
}
