import type Konva from 'konva'
import { useRef } from 'react'
import { Stage } from 'react-konva'
import { DEFAULT_CELL_SIZE } from '../constants'
import { findMarkerAt, type CategoryMarker, type GridPosition, type StoreLayout, type Tool } from '../types'
import { GridLayer, MarkerLayer } from './GridLayer'

interface LayoutCanvasProps {
  layout: StoreLayout
  activeTool: Tool
  onPaintCell: (position: GridPosition) => void
  onPlaceMarker: (position: GridPosition) => void
  onEditMarker: (marker: CategoryMarker) => void
}

export function LayoutCanvas({
  layout,
  activeTool,
  onPaintCell,
  onPlaceMarker,
  onEditMarker,
}: LayoutCanvasProps) {
  const isPaintingRef = useRef(false)
  const lastPaintedRef = useRef<string | null>(null)

  const cellSize = DEFAULT_CELL_SIZE
  const width = layout.cols * cellSize
  const height = layout.rows * cellSize

  function cellFromEvent(e: Konva.KonvaEventObject<MouseEvent>): GridPosition | null {
    const stage = e.target.getStage()
    const pos = stage?.getPointerPosition()
    if (!pos) return null
    const col = Math.floor(pos.x / cellSize)
    const row = Math.floor(pos.y / cellSize)
    if (row < 0 || row >= layout.rows || col < 0 || col >= layout.cols) return null
    return { row, col }
  }

  function handleCellInteraction(position: GridPosition) {
    if (activeTool.kind === 'paint') {
      onPaintCell(position)
      return
    }
    if (activeTool.kind === 'select') {
      const existing = findMarkerAt(layout.markers, position)
      if (existing && existing.kind === 'category') {
        onEditMarker(existing)
      }
      return
    }
    const existing = findMarkerAt(layout.markers, position)
    if (existing) return
    onPlaceMarker(position)
  }

  function handleMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    const position = cellFromEvent(e)
    if (!position) return
    if (activeTool.kind === 'paint') {
      isPaintingRef.current = true
      lastPaintedRef.current = `${position.row}-${position.col}`
    }
    handleCellInteraction(position)
  }

  function handleMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!isPaintingRef.current || activeTool.kind !== 'paint') return
    const position = cellFromEvent(e)
    if (!position) return
    const key = `${position.row}-${position.col}`
    if (key === lastPaintedRef.current) return
    lastPaintedRef.current = key
    onPaintCell(position)
  }

  function endPainting() {
    isPaintingRef.current = false
    lastPaintedRef.current = null
  }

  return (
    <div className="overflow-auto">
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endPainting}
        onMouseLeave={endPainting}
      >
        <GridLayer layout={layout} cellSize={cellSize} />
        <MarkerLayer markers={layout.markers} cellSize={cellSize} />
      </Stage>
    </div>
  )
}
