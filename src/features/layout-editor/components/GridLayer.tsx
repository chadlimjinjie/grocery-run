import { Fragment } from 'react'
import { Circle, Layer, Rect, Text } from 'react-konva'
import { CELL_TYPE_META } from '../constants'
import type { Marker, StoreLayout } from '../types'

export const MARKER_COLORS: Record<'start' | 'end', string> = {
  start: '#16a34a',
  end: '#dc2626',
}

interface GridLayerProps {
  layout: StoreLayout
  cellSize: number
}

export function GridLayer({ layout, cellSize }: GridLayerProps) {
  return (
    <Layer>
      {layout.cells.map((rowCells, row) =>
        rowCells.map((cellType, col) => (
          <Rect
            key={`${row}-${col}`}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill={CELL_TYPE_META[cellType].color}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        )),
      )}
    </Layer>
  )
}

interface MarkerLayerProps {
  markers: Marker[]
  cellSize: number
}

export function MarkerLayer({ markers, cellSize }: MarkerLayerProps) {
  return (
    <Layer listening={false}>
      {markers.map((marker) => {
        const cx = marker.position.col * cellSize + cellSize / 2
        const cy = marker.position.row * cellSize + cellSize / 2
        const color = marker.kind === 'category' ? marker.color : MARKER_COLORS[marker.kind]
        const label =
          marker.kind === 'category' ? marker.label.charAt(0).toUpperCase() : marker.kind === 'start' ? 'S' : 'E'
        return (
          <Fragment key={marker.id}>
            <Circle x={cx} y={cy} radius={cellSize * 0.4} fill={color} stroke="#ffffff" strokeWidth={1.5} />
            <Text
              x={cx - cellSize / 2}
              y={cy - 6}
              width={cellSize}
              align="center"
              text={label}
              fontSize={12}
              fontStyle="bold"
              fill="#ffffff"
            />
          </Fragment>
        )
      })}
    </Layer>
  )
}
