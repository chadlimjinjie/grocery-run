import { SnowflakeIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DEFAULT_CATEGORIES } from '../constants'
import type { CategoryMarker } from '../types'

interface CategoryMarkerDialogProps {
  marker: CategoryMarker | null
  onSave: (patch: { label: string; color: string; coldChain: boolean }) => void
  onRemove: () => void
  onCancel: () => void
}

export function CategoryMarkerDialog({ marker, onSave, onRemove, onCancel }: CategoryMarkerDialogProps) {
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('')
  const [coldChain, setColdChain] = useState(false)

  useEffect(() => {
    if (marker) {
      setLabel(marker.label)
      setColor(marker.color)
      setColdChain(marker.coldChain)
    }
  }, [marker])

  return (
    <Dialog open={marker !== null} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category marker</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded-md border"
            aria-label="Category color"
          />
          <Select value={label} onValueChange={(value) => setLabel(value as string)}>
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
          <Tooltip>
            <TooltipTrigger
              render={
                <Toggle
                  variant="outline"
                  pressed={coldChain}
                  onPressedChange={setColdChain}
                  aria-label="Cold chain item"
                />
              }
            >
              <SnowflakeIcon />
            </TooltipTrigger>
            <TooltipContent>Cold chain (visited last)</TooltipContent>
          </Tooltip>
        </div>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={onRemove}>
            Remove
          </Button>
          <Button type="button" onClick={() => onSave({ label, color, coldChain })}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
