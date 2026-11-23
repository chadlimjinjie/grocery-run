import { ClipboardListIcon, HomeIcon, MapIcon, PencilRulerIcon, type LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Home', url: '/', icon: HomeIcon },
  { title: 'Layout Editor', url: '/editor', icon: PencilRulerIcon },
  { title: 'Shopping Lists', url: '/shopping-lists', icon: ClipboardListIcon },
  { title: 'Route Planner', url: '/route', icon: MapIcon },
]
