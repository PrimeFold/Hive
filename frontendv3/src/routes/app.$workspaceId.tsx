import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ChannelSidebar } from '@/components/chat/ChannelSidebar'
import { useEffect } from 'react'
import { socket } from '@/hooks/use-socket'

export const Route = createFileRoute('/app/$workspaceId')({
  component: WorkspaceLayout
})

function WorkspaceLayout() {
  const { workspaceId } = Route.useParams()

  useEffect(()=>{
    socket.emit('join_workspace',workspaceId)
  },[workspaceId])

  return (
    <>
      <ChannelSidebar workspaceId={workspaceId} />
      <Outlet />
    </>
  )
}