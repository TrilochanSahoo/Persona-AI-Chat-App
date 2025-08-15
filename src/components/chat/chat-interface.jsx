"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ChatMessage } from "./chat-message"



export function ChatInterface({ selectedPersona }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [streaming,setStreming] = useState("")
  const [streamResponse, setStreamResponse] = useState("")
  const [loading, setLoading] = useState("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedPersona) {
      setMessages([
        {
          id: '1',
          content: `Hi there! I'm ${selectedPersona.name}. How can I assist you today? 😊`,
          isUser: false,
          timestamp: new Date(),
          avatar: selectedPersona.avatar
        }
      ])
    }
  }, [selectedPersona])

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !selectedPersona) return

    const newMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I understand what you're looking for. Here's what I think...",
        "Thanks for sharing that with me. Based on my experience...",
        "That's an interesting perspective. Let me provide some insights.",
        "I'd be happy to help you with that. Here's my recommendation..."
      ]
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
        avatar: selectedPersona.avatar
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleStreamChat()
    }
  }

  
    const handleStreamChat = async ()=>{
      if (inputMessage.trim() === '' || !selectedPersona) return
      setStreming(true)
      try {
        const newMessage = {
          id: Date.now().toString(),
          content: inputMessage,
          isUser: true,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, newMessage])
        setInputMessage('')
        setIsLoading(true)

        const res = await fetch("api/chat-stream",{
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({
            persona : selectedPersona.name.toLowerCase(),
            message : inputMessage
          })
        })
  
        const reader = res.body.getReader()
  
        const decoder = new TextDecoder()
        let finalResponse = "";
  
        while(true){
          const {done,value} = await reader.read()
          if(done) break;
  
          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")
          for(const line of lines){
            if(line.startsWith("data :")){
              const data = JSON.parse(line.slice(6))
              finalResponse += data.content;
              setStreamResponse((prev) => prev + data.content)
            }
          }
        }

        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: finalResponse,
          isUser: false,
          timestamp: new Date(),
          avatar: selectedPersona.avatar
        }

        setMessages(prev => [...prev, aiResponse])
        setIsLoading(false)

      } catch (error) {
        setStreamResponse("error : " + error.message)
      }
  
      setLoading(false)
    }

  if (!selectedPersona) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center p-4"
      >
        <Card className="p-8 text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Welcome to PersonaChat</h3>
          <p className="text-muted-foreground">Select a persona above to start your conversation</p>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-muted-foreground/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center py-8 sm:py-12 px-4 sm:px-6"
      >
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">Your personal assistant</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          A personal assistant streamlines your life by managing tasks, schedules, and communications efficiently.
        </p>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <ChatMessage key={message.id} message={message} index={index} />
            ))}
            {streamResponse}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 mb-6"
            >
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center">
                {/* <LoadingSpinner size="sm" /> */}
              </div>
              <div className="bg-muted px-4 py-3 rounded-2xl">
                {/* <LoadingSpinner /> */}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 sm:gap-3 items-center"
          >
            <Card className="flex-1 p-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a message"
                  className="flex-1 bg-transparent placeholder:text-muted-foreground px-2 sm:px-4 py-2 sm:py-3 focus:outline-none text-sm sm:text-base"
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 sm:p-3"
                  disabled={isLoading}
                >
                  
                </Button>
              </div>
            </Card>
            <Button
              onClick={handleStreamChat}
              disabled={isLoading || inputMessage.trim() === ''}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
            >
              <span className="hidden sm:inline mr-2">Send</span>
              <Send size={16} className="sm:w-4 sm:h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}