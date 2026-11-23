import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ShoppingListItem } from '../types'

interface ShoppingListEditorProps {
  items: ShoppingListItem[]
  onAddItem: () => void
  onUpdateItem: (id: string, patch: Partial<Pick<ShoppingListItem, 'name' | 'category'>>) => void
  onRemoveItem: (id: string) => void
}

export function ShoppingListEditor({ items, onAddItem, onUpdateItem, onRemoveItem }: ShoppingListEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5">
            <Input
              placeholder="Item name"
              value={item.name}
              onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Category"
              value={item.category}
              onChange={(e) => onUpdateItem(item.id, { category: e.target.value })}
              className="w-32"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove item"
              onClick={() => onRemoveItem(item.id)}
            >
              <XIcon />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onAddItem} className="self-start">
        Add item
      </Button>
    </div>
  )
}
