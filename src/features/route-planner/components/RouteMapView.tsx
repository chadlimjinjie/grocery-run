import { Circle, Layer, Line, Stage, Text } from 'react-konva'
import { DEFAULT_CELL_SIZE } from '@/features/layout-editor/constants'
import { GridLayer, MarkerLayer } from '@/features/layout-editor/components/GridLayer'
import type { StoreLayout } from '@/features/layout-editor/types'
import type { RoutePlan } from '../types'

interface RouteMapViewProps {
  layout: StoreLayout
  plan: RoutePlan
}

export function RouteMapView({ layout, plan }: RouteMapViewProps) {
  const cellSize = DEFAULT_CELL_SIZE
  const width = layout.cols * cellSize
  const height = layout.rows * cellSize

  const pathPoints = plan.path.flatMap((pos) => [
    pos.col * cellSize + cellSize / 2,
    pos.row * cellSize + cellSize / 2,
  ])

  return (
    <div className="overflow-auto">
      <Stage width={width} height={height}>
        <GridLayer layout={layout} cellSize={cellSize} />
        {pathPoints.length > 0 && (
          <Layer listening={false}>
            <Line points={pathPoints} stroke="#2563eb" strokeWidth={3} lineCap="round" lineJoin="round" />
          </Layer>
        )}
        <MarkerLayer markers={layout.markers} cellSize={cellSize} />
        <Layer listening={false}>
          {plan.stops.map((stop, i) => {
            const cx = stop.position.col * cellSize + cellSize / 2
            const cy = stop.position.row * cellSize - cellSize * 0.3
            return (
              <Circle
                key={`${stop.label}-${i}`}
                x={cx}
                y={cy}
                radius={cellSize * 0.3}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={1}
              />
            )
          })}
          {plan.stops.map((stop, i) => {
            const cx = stop.position.col * cellSize + cellSize / 2
            const cy = stop.position.row * cellSize - cellSize * 0.3
            return (
              <Text
                key={`label-${stop.label}-${i}`}
                x={cx - cellSize / 2}
                y={cy - 6}
                width={cellSize}
                align="center"
                text={String(i + 1)}
                fontSize={11}
                fontStyle="bold"
                fill="#ffffff"
              />
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}
