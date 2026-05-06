import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/context/authContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const Route = createFileRoute('/app/profile/')({
  component: ProfileIndexComponent,
})

function ProfileIndexComponent() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading user information...</div>
  }

  const userInitial = (user.displayName || user.username)?.charAt(0).toUpperCase() || 'U'

  return (
    <main className="p-8">
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/40 to-fuchsia-400/40">
            {userInitial}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {user.displayName || user.username}
          </h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Email: {user.email}</p>
            <p>This is a placeholder for the user's bio or other profile information.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}