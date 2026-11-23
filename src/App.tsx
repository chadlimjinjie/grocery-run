import { Route, Routes } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import LayoutEditorPage from '@/features/layout-editor/LayoutEditorPage'
import RoutePlannerPage from '@/features/route-planner/RoutePlannerPage'
import ShoppingListsPage from '@/features/route-planner/ShoppingListsPage'

function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
      <h2 className="text-xl font-semibold">Welcome to Grocery Run</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Use the sidebar to draw your store's layout and plan the fastest route through your shopping list.
      </p>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<LayoutEditorPage />} />
        <Route path="/shopping-lists" element={<ShoppingListsPage />} />
        <Route path="/route" element={<RoutePlannerPage />} />
      </Route>
    </Routes>
  )
}

export default App
