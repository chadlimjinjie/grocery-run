import { useState } from 'react'
import { DiscardLayoutDialog } from './components/DiscardLayoutDialog'
import { LayoutCanvas } from './components/LayoutCanvas'
import { NewLayoutDialog } from './components/NewLayoutDialog'
import { Toolbar } from './components/Toolbar'
import { CellType } from './types'
import type { GridPosition, Tool } from './types'
import { useStoreLayout } from './useStoreLayout'

export default function LayoutEditorPage() {
  const { layout, createLayout, paintCell, placeMarker, placeCategoryMarker, removeMarker, resetLayout } =
    useStoreLayout()
  const [activeTool, setActiveTool] = useState<Tool>({ kind: 'paint', cellType: CellType.Aisle })
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false)

  function handlePaintCell(position: GridPosition) {
    if (activeTool.kind !== 'paint') return
    paintCell(position.row, position.col, activeTool.cellType)
  }

  function handlePlaceMarker(position: GridPosition) {
    if (activeTool.kind === 'place-marker') {
      placeMarker(position, activeTool.markerKind)
    } else if (activeTool.kind === 'place-category') {
      placeCategoryMarker(position, activeTool.label, activeTool.color)
    }
  }

  function handleNewLayout() {
    if (layout) {
      setConfirmDiscardOpen(true)
      return
    }
    resetLayout()
  }

  function handleConfirmDiscard() {
    resetLayout()
    setConfirmDiscardOpen(false)
  }

  if (!layout) {
    return <NewLayoutDialog open onCreate={createLayout} />
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <Toolbar activeTool={activeTool} onToolChange={setActiveTool} onNewLayout={handleNewLayout} />
      <div className="flex-1 p-4">
        <LayoutCanvas
          layout={layout}
          activeTool={activeTool}
          onPaintCell={handlePaintCell}
          onPlaceMarker={handlePlaceMarker}
          onRemoveMarker={removeMarker}
        />
      </div>
      <DiscardLayoutDialog
        open={confirmDiscardOpen}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setConfirmDiscardOpen(false)}
      />
    </div>
  )
}
