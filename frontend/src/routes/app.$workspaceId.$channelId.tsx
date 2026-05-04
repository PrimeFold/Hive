import { useChannel } from '@/hooks/use-channel'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatInput } from '@/components/chat/ChatInput'
import { MessageList } from '@/components/chat/MessageList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$workspaceId/$channelId')({
  component: ChannelView
})

function ChannelView() {
  console.log('ChannelView rendering');
  const { workspaceId, channelId } = Route.useParams()
  const { typingUsers } = useChannel(channelId)
  
  return (
    <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
      <ChatHeader channelId={channelId} workspaceId={workspaceId} />
      <MessageList id={channelId} mode='channel' typingUsers={typingUsers} />
      <ChatInput id={channelId} mode='channel' />
    </main>
  )
}