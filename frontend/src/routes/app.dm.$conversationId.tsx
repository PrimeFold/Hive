import { ChatInput } from '@/components/chat/ChatInput'
import { MessageList } from '@/components/chat/MessageList'
import { useConversation } from '@/hooks/use-conversation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/dm/$conversationId')({
  component: DMView
})

function DMView() {
  const { conversationId } = Route.useParams()
  const {typingUsers} = useConversation(conversationId)
  return (
    <main className="flex-1 flex flex-col min-w-0">
      <MessageList mode='dm' id={conversationId} typingUsers={typingUsers} />
      <ChatInput mode='dm' id={conversationId} />
    </main>
  )
}
