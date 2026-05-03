import { useChannel } from '#/hooks/use-channel'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatInput } from '@/components/chat/ChatInput'
import { MessageList } from '@/components/chat/MessageList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$workspaceId/$channelId')({
  component: ChannelView
})

function ChannelView() {
  const { workspaceId,channelId } = Route.useParams()
  const {typingUsers} = useChannel(channelId)
  return (
    <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 flex flex-col min-w-0">
          <ChatHeader channelId={channelId} workspaceId={workspaceId}  />
          <MessageList channelId={channelId} typingUsers={typingUsers}/>
          <ChatInput  channelId={channelId}/>
        </main>
      
    </div>
  )
}