import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ShoppingList } from '../types'

interface ShoppingListSelectProps {
  lists: ShoppingList[]
  selectedId: string | null
  onSelectList: (id: string) => void
}

export function ShoppingListSelect({ lists, selectedId, onSelectList }: ShoppingListSelectProps) {
  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
        <p>You don't have any shopping lists yet.</p>
        <Button size="sm" render={<Link to="/shopping-lists" />}>
          Create a shopping list
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedId ?? undefined} onValueChange={(value) => onSelectList(value as string)}>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Select a list">
            {(value: string | null) => {
              const list = lists.find((l) => l.id === value)
              return list ? `${list.name} (${list.items.length})` : null
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {lists.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name} ({list.items.length})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="ghost" size="sm" render={<Link to="/shopping-lists" />}>
        Manage lists
      </Button>
    </div>
  )
}
