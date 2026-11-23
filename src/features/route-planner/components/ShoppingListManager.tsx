import { PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ShoppingList } from '../types'

interface ShoppingListManagerProps {
  lists: ShoppingList[]
  selectedId: string | null
  onSelectList: (id: string) => void
  onCreateList: () => void
  onRenameList: (id: string) => void
  onDeleteList: (id: string) => void
}

export function ShoppingListManager({
  lists,
  selectedId,
  onSelectList,
  onCreateList,
  onRenameList,
  onDeleteList,
}: ShoppingListManagerProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Your lists</h2>
        <Button type="button" variant="outline" size="sm" onClick={onCreateList}>
          New list
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        {lists.length === 0 && <p className="text-sm text-muted-foreground">No lists yet.</p>}
        {lists.map((list) => (
          <div
            key={list.id}
            className={cn(
              'flex items-center gap-1 rounded-md border px-2 py-1.5',
              list.id === selectedId && 'border-primary bg-accent',
            )}
          >
            <button
              type="button"
              onClick={() => onSelectList(list.id)}
              className="flex-1 truncate text-left text-sm"
            >
              {list.name}
              <span className="ml-1.5 text-xs text-muted-foreground">({list.items.length})</span>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Rename list"
              onClick={() => onRenameList(list.id)}
            >
              <PencilIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Delete list"
              onClick={() => onDeleteList(list.id)}
            >
              <TrashIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
