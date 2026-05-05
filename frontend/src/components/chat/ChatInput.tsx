import { useState, useRef } from "react";
import { Send, Plus, Smile, Paperclip, Mic, Sparkles } from "lucide-react";
import { socket } from "@/hooks/use-socket";


interface ChatInputProps {
  mode : 'channel' | 'dm'
  id: string;
}

export function ChatInput({ id ,mode}: ChatInputProps) {
  const [value, setValue] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendMessage = () => {
    if (!value.trim()) return;

    if(mode==='channel'){
      socket.emit('send_channel_message', id, value.trim());
      socket.emit('channel_typing_stop', id);
    }else{
      socket.emit('new_dm',id,value.trim())
      socket.emit('typing_stop', id);
    }

    setValue('')
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (newValue.trim()) {
      if (mode === 'channel') {
        socket.emit('channel_typing_start', id);
      } else {
        socket.emit('typing_start', id);
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (mode === 'channel') {
          socket.emit('channel_typing_stop', id);
        } else {
          socket.emit('typing_stop', id);
        }
      }, 2000);
    }
  };

  return (
    <div className="px-8 pb-6 pt-2">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="group relative rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] focus-within:border-primary/40 focus-within:shadow-[0_20px_60px_-15px_oklch(0.72_0.16_255/0.35)] transition-all duration-300"
        >
          <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-fuchsia-500/10 to-primary/20 blur-xl -z-10" />

          <div className="flex items-end gap-2 px-3 py-2.5">
            <button type="button" className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors">
              <Plus className="h-4 w-4" />
            </button>

            <textarea
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={`Message #general — press / for commands`}
              className="flex-1 resize-none bg-transparent text-[14px] leading-6 placeholder:text-muted-foreground/70 focus:outline-none py-2 max-h-40"
            />

            <div className="flex items-center gap-0.5">
              {[Paperclip, Smile, Mic].map((Icon, i) => (
                <button key={i} type="button" className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
              <button
                type="submit"
                className="ml-1 h-9 px-3 rounded-xl flex items-center gap-1.5 text-[12.5px] font-semibold text-primary-foreground bg-gradient-to-br from-primary to-[oklch(0.62_0.20_270)] shadow-[0_8px_20px_-6px_oklch(0.72_0.16_255/0.7)] hover:opacity-95 active:scale-[0.97] transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 pb-2 pt-0.5 border-t border-white/[0.04]">
            <div className="flex items-center gap-2 text-[10.5px] text-muted-foreground/70">
              <Sparkles className="h-3 w-3 text-primary/80" />
              <span>AI suggestions enabled</span>
            </div>
            <div className="text-[10.5px] text-muted-foreground/60">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] font-mono text-[10px]">⏎</kbd>{" "}
              to send ·{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] font-mono text-[10px]">⇧⏎</kbd>{" "}
              new line
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
