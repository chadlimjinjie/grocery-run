import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CELL_TYPE_META, DEFAULT_CATEGORIES, DEFAULT_CATEGORY_COLOR, PAINT_TOOL_ORDER } from '../constants'
import type { CellType, Tool } from '../types'

interface ToolbarProps {
  activeTool: Tool
  onToolChange: (tool: Tool) => void
  onNewLayout: () => void
}

export function Toolbar({ activeTool, onToolChange, onNewLayout }: ToolbarProps) {
  const [categoryLabel, setCategoryLabel] = useState(DEFAULT_CATEGORIES[0])
  const [categoryColor, setCategoryColor] = useState(DEFAULT_CATEGORY_COLOR)

  const paintValue = activeTool.kind === 'paint' ? [activeTool.cellType] : []

  function handlePaintChange(values: string[]) {
    const cellType = values[0] as CellType | undefined
    if (cellType) onToolChange({ kind: 'paint', cellType })
  }

  function handleAddCategory() {
    onToolChange({ kind: 'place-category', label: categoryLabel, color: categoryColor })
  }

  return (
    <div className="flex flex-wrap items-end gap-4 border-b p-3">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Paint</span>
        <ToggleGroup value={paintValue} onValueChange={handlePaintChange}>
          {PAINT_TOOL_ORDER.map((cellType) => (
            <Tooltip key={cellType}>
              <TooltipTrigger render={<ToggleGroupItem value={cellType} aria-label={CELL_TYPE_META[cellType].label} />}>
                <span
                  className="size-4 rounded-sm border"
                  style={{ backgroundColor: CELL_TYPE_META[cellType].color }}
                />
              </TooltipTrigger>
              <TooltipContent>{CELL_TYPE_META[cellType].label}</TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Endpoints</span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={
              activeTool.kind === 'place-marker' && activeTool.markerKind === 'start'
                ? 'default'
                : 'outline'
            }
            onClick={() => onToolChange({ kind: 'place-marker', markerKind: 'start' })}
          >
            Place start
          </Button>
          <Button
            type="button"
            variant={
              activeTool.kind === 'place-marker' && activeTool.markerKind === 'end'
                ? 'default'
                : 'outline'
            }
            onClick={() => onToolChange({ kind: 'place-marker', markerKind: 'end' })}
          >
            Place end
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Category marker</span>
        <div className="flex gap-2">
          <input
            type="color"
            value={categoryColor}
            onChange={(e) => setCategoryColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded-md border"
            aria-label="Category color"
          />
          <Select value={categoryLabel} onValueChange={(value) => setCategoryLabel(value as string)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={handleAddCategory}>
            Add
          </Button>
        </div>
      </div>

      <Button type="button" variant="ghost" className="ml-auto" onClick={onNewLayout}>
        New layout
      </Button>
    </div>
  )
}
