"use client"

import { useState } from "react"
import { motion } from "framer-motion"
// import { Navbar } from "@/components/navigation/navbar"
import { PersonaCard } from "../components/cards/persona-card"
import { ChatInterface } from "../components/chat/chat-interface"
import { personas } from "../data/personas"

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState(null)
  

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona)
  }


  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      
      <main className="flex-1 flex flex-col">
        {/* Persona Selection Section */}
        <div className="p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Choose Your Assistant</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Select a persona to start your conversation</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {personas.map((persona, index) => (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PersonaCard
                    persona={persona}
                    isSelected={selectedPersona?.id === persona.id}
                    onSelect={handlePersonaSelect}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 relative"
          style={{ minHeight: 'calc(100vh - 500px)' }}
        >
          <ChatInterface selectedPersona={selectedPersona} />
        </motion.div>
      </main>
    </div>
  )
}