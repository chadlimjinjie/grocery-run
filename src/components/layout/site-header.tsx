import { useLocation } from 'react-router'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { NAV_ITEMS } from './nav-items'

export function SiteHeader() {
  const { pathname } = useLocation()
  const current = NAV_ITEMS.find((item) => item.url === pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
      <h1 className="text-base font-medium">{current?.title ?? 'Grocery Run'}</h1>
    </header>
  )
}
