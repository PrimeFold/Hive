import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { User, Settings } from 'lucide-react'

export const Route = createFileRoute('/app/profile')({
  component: ProfileLayout,
})

const profileNavLinks = [
  { to: '/app/profile', label: 'Profile', icon: User, exact: true },
  { to: '/app/profile/settings', label: 'Settings', icon: Settings },
]

function ProfileLayout() {
  return (
    <div className="flex-1 flex min-h-0 bg-background">
      <aside className="w-56 shrink-0 border-r border-white/5 p-4">
        <h2 className="text-lg font-semibold tracking-tight mb-4 px-2 text-foreground">
          User Profile
        </h2>
        <nav className="flex flex-col gap-1">
          {profileNavLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: 'bg-white/5 text-foreground' }}
              inactiveProps={{
                className:
                  'text-muted-foreground hover:bg-white/5 hover:text-foreground',
              }}
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}
