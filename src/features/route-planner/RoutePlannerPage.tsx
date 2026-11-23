import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useStoreLayout } from '@/features/layout-editor/useStoreLayout'
import { RouteMapView } from './components/RouteMapView'
import { RouteSummary } from './components/RouteSummary'
import { ShoppingListSelect } from './components/ShoppingListSelect'
import { useRoutePlan } from './useRoutePlan'
import { useShoppingLists } from './useShoppingLists'

export default function RoutePlannerPage() {
  const { layout } = useStoreLayout()
  const { lists, selectedId, selectedList, selectList } = useShoppingLists()
  const plan = useRoutePlan(layout, selectedList?.items ?? [])

  const hasStartAndEnd =
    layout && layout.markers.some((m) => m.kind === 'start') && layout.markers.some((m) => m.kind === 'end')

  if (!layout || !hasStartAndEnd) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Finish your store layout first — you need a start point and an end point before you can plan a route.
        </p>
        <Button render={<Link to="/editor" />}>Go to layout editor</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row">
      <div className="flex w-full flex-col gap-4 md:w-80">
        <ShoppingListSelect lists={lists} selectedId={selectedId} onSelectList={selectList} />
        {plan && <RouteSummary plan={plan} />}
      </div>
      {plan && <RouteMapView layout={layout} plan={plan} />}
    </div>
  )
}
