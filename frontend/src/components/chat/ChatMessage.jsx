import { format, isToday } from 'date-fns'
import { Check, CheckCheck } from 'lucide-react'

export default function ChatMessage({ message, isOwn }) {
  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isToday(date)) {
      return format(date, 'HH:mm')
    }
    return format(date, 'dd/MM HH:mm')
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl ${
          isOwn
            ? 'bg-periwinkle-600 text-white rounded-br-md'
            : 'bg-jet-black-100 text-jet-black-900 rounded-bl-md'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/70' : 'text-jet-black-400'}`}>
          <span className="text-[10px]">{formatTime(message.created_at)}</span>
          {isOwn && (
            message.read_at
              ? <CheckCheck className="w-3.5 h-3.5" />
              : <Check className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
    </div>
  )
}
