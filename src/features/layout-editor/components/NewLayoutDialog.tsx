import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MAX_GRID_DIM, MIN_GRID_DIM } from '../constants'

interface NewLayoutDialogProps {
  open: boolean
  onCreate: (rows: number, cols: number) => void
  onCancel?: () => void
}

export function NewLayoutDialog({ open, onCreate, onCancel }: NewLayoutDialogProps) {
  const [rows, setRows] = useState(10)
  const [cols, setCols] = useState(15)
  const [error, setError] = useState<string | null>(null)

  function handleCreate() {
    if (rows < MIN_GRID_DIM || rows > MAX_GRID_DIM || cols < MIN_GRID_DIM || cols > MAX_GRID_DIM) {
      setError(`Rows and columns must be between ${MIN_GRID_DIM} and ${MAX_GRID_DIM}.`)
      return
    }
    setError(null)
    onCreate(rows, cols)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel?.()}>
      <DialogContent showCloseButton={Boolean(onCancel)}>
        <DialogHeader>
          <DialogTitle>New store layout</DialogTitle>
          <DialogDescription>
            Choose a grid size to start drawing your store's layout.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              type="number"
              min={MIN_GRID_DIM}
              max={MAX_GRID_DIM}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cols">Columns</Label>
            <Input
              id="cols"
              type="number"
              min={MIN_GRID_DIM}
              max={MAX_GRID_DIM}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button onClick={handleCreate}>Create layout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
