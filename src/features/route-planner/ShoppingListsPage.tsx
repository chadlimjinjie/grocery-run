import { useState } from 'react'
import { DeleteListDialog } from './components/DeleteListDialog'
import { ShoppingListEditor } from './components/ShoppingListEditor'
import { ShoppingListFormDialog } from './components/ShoppingListFormDialog'
import { ShoppingListManager } from './components/ShoppingListManager'
import { useShoppingLists } from './useShoppingLists'

type ListDialogState = { mode: 'create' } | { mode: 'rename'; id: string; name: string }

export default function ShoppingListsPage() {
  const {
    lists,
    selectedId,
    selectedList,
    createList,
    renameList,
    deleteList,
    selectList,
    addItem,
    updateItem,
    removeItem,
  } = useShoppingLists()

  const [listDialog, setListDialog] = useState<ListDialogState | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  function handleCreateList() {
    setListDialog({ mode: 'create' })
  }

  function handleRenameList(id: string) {
    const list = lists.find((l) => l.id === id)
    setListDialog({ mode: 'rename', id, name: list?.name ?? '' })
  }

  function handleDeleteList(id: string) {
    const list = lists.find((l) => l.id === id)
    setDeleteTarget({ id, name: list?.name ?? 'this list' })
  }

  function handleListDialogSubmit(name: string) {
    if (listDialog?.mode === 'rename') {
      renameList(listDialog.id, name)
    } else {
      createList(name)
    }
    setListDialog(null)
  }

  function handleConfirmDelete() {
    if (deleteTarget) {
      deleteList(deleteTarget.id)
    }
    setDeleteTarget(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row">
      <div className="w-full md:w-72">
        <ShoppingListManager
          lists={lists}
          selectedId={selectedId}
          onSelectList={selectList}
          onCreateList={handleCreateList}
          onRenameList={handleRenameList}
          onDeleteList={handleDeleteList}
        />
      </div>
      <div className="flex-1">
        {selectedList ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium">{selectedList.name}</h2>
            <ShoppingListEditor
              items={selectedList.items}
              onAddItem={() => addItem(selectedList.id)}
              onUpdateItem={(itemId, patch) => updateItem(selectedList.id, itemId, patch)}
              onRemoveItem={(itemId) => removeItem(selectedList.id, itemId)}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Create your first list to get started.</p>
        )}
      </div>
      <ShoppingListFormDialog
        open={listDialog !== null}
        mode={listDialog?.mode ?? 'create'}
        initialName={listDialog?.mode === 'rename' ? listDialog.name : ''}
        onSubmit={handleListDialogSubmit}
        onCancel={() => setListDialog(null)}
      />
      <DeleteListDialog
        open={deleteTarget !== null}
        listName={deleteTarget?.name ?? null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
