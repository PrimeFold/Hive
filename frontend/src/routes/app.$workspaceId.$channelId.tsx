import { useChannel } from '@/hooks/use-channel'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatInput } from '@/components/chat/ChatInput'
import { MessageList } from '@/components/chat/MessageList'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/app/$workspaceId/$channelId')({
  component: ChannelView
})

function ChannelView() {
  console.log('ChannelView rendering');
  const { workspaceId, channelId } = Route.useParams()
  const [error, setError] = useState<string | null>(null)

  let typingUsers: string[] = []
  try {
    const result = useChannel(channelId)
    typingUsers = result.typingUsers
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error in useChannel'
    console.error('Error in useChannel:', errorMsg)
    setError(errorMsg)
  }

  if (error) {
    return (
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error loading channel</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </main>
    )
  }

  console.log("Chat area is being rendered..")
  return (
    <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
      <ChatHeader channelId={channelId} workspaceId={workspaceId} />
      <MessageList id={channelId} mode='channel' typingUsers={typingUsers} />
      <ChatInput id={channelId} mode='channel' />
    </main>
  )
}
