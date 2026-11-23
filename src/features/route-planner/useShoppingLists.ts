import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { sampleItems } from './constants'
import { loadShoppingLists, saveShoppingLists, type ShoppingListsState } from './storage'
import type { ShoppingListItem } from './types'

function defaultState(): ShoppingListsState {
  const id = crypto.randomUUID()
  return { lists: [{ id, name: 'Sample List', items: sampleItems() }], selectedId: id }
}

export function useShoppingLists() {
  const [state, setState] = useState<ShoppingListsState>(() => loadShoppingLists() ?? defaultState())
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveShoppingLists(state), 300)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [state])

  const createList = useCallback((name: string) => {
    const id = crypto.randomUUID()
    setState((prev) => ({ lists: [...prev.lists, { id, name, items: [] }], selectedId: id }))
  }, [])

  const renameList = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((list) => (list.id === id ? { ...list, name } : list)),
    }))
  }, [])

  const deleteList = useCallback((id: string) => {
    setState((prev) => {
      const lists = prev.lists.filter((list) => list.id !== id)
      const selectedId = prev.selectedId === id ? (lists[0]?.id ?? null) : prev.selectedId
      return { lists, selectedId }
    })
  }, [])

  const selectList = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedId: id }))
  }, [])

  const addItem = useCallback((listId: string) => {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? { ...list, items: [...list.items, { id: crypto.randomUUID(), name: '', category: '' }] }
          : list,
      ),
    }))
  }, [])

  const updateItem = useCallback(
    (listId: string, itemId: string, patch: Partial<Pick<ShoppingListItem, 'name' | 'category'>>) => {
      setState((prev) => ({
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? { ...list, items: list.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)) }
            : list,
        ),
      }))
    },
    [],
  )

  const removeItem = useCallback((listId: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId ? { ...list, items: list.items.filter((item) => item.id !== itemId) } : list,
      ),
    }))
  }, [])

  const selectedList = useMemo(
    () => state.lists.find((list) => list.id === state.selectedId) ?? null,
    [state.lists, state.selectedId],
  )

  return {
    lists: state.lists,
    selectedId: state.selectedId,
    selectedList,
    createList,
    renameList,
    deleteList,
    selectList,
    addItem,
    updateItem,
    removeItem,
  }
}
