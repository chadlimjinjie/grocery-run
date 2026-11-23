import { useEffect, useState } from 'react'
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

interface ShoppingListFormDialogProps {
  open: boolean
  mode: 'create' | 'rename'
  initialName?: string
  onSubmit: (name: string) => void
  onCancel: () => void
}

export function ShoppingListFormDialog({
  open,
  mode,
  initialName = '',
  onSubmit,
  onCancel,
}: ShoppingListFormDialogProps) {
  const [name, setName] = useState(initialName)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName(initialName)
      setError(null)
    }
  }, [open, initialName])

  function handleSubmit() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name is required.')
      return
    }
    onSubmit(trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'New list' : 'Rename list'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Give your new shopping list a name.'
              : 'Choose a new name for this list.'}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="list-name">Name</Label>
            <Input
              id="list-name"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
            />
          </div>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </form>
        <DialogFooter>
          <Button onClick={handleSubmit}>{mode === 'create' ? 'Create' : 'Rename'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
