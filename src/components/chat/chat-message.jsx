"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"


export function ChatMessage({ message, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex gap-3 sm:gap-4 mb-4 sm:mb-6 ${message.isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
          {message.avatar ? (
            <AvatarImage src={message.avatar} alt="Avatar" />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground">
              {message.isUser ? 'U' : 'AI'}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={`max-w-[280px] sm:max-w-md ${message.isUser ? 'text-right' : ''}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
            message.isUser
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </motion.div>
        <p className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}