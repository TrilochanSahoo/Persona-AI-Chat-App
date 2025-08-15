"use client"

import { motion } from "framer-motion"
import { MessageCircle, Phone, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function PersonaCard({ persona, isSelected, onSelect }) {
  const isDark = persona.theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="w-full"
    >
      <Card
        className={`relative p-6 sm:p-8 cursor-pointer transition-all duration-300 overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700' 
            : 'bg-white text-gray-900 border-gray-200'
        } ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onClick={() => onSelect(persona)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full border-2 ${
            isDark ? 'border-blue-500/20' : 'border-gray-200/50'
          }`} />
          <div className={`absolute -bottom-5 -left-5 w-16 sm:w-20 h-16 sm:h-20 rounded-full border-2 ${
            isDark ? 'border-purple-500/20' : 'border-gray-200/30'
          }`} />
          <div className={`absolute top-1/2 right-6 sm:right-8 w-12 sm:w-16 h-12 sm:h-16 rounded-full border ${
            isDark ? 'border-teal-500/20' : 'border-gray-200/40'
          }`} />
        </div>

        <div className="relative z-10">
          {/* Avatar Section */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className={`p-1 rounded-full ${
                isDark ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-gray-300 to-gray-400'
              }`}>
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage src={persona.avatar} alt={persona.name} />
                  <AvatarFallback>{persona.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </div>
              {/* Online Status */}
              {persona.isOnline && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="h-5 w-5 p-0 bg-green-500 hover:bg-green-500">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{persona.name}</h3>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {persona.role}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <Button
              variant={isDark ? "secondary" : "outline"}
              size="sm"
              className="flex items-center gap-2 flex-1 sm:flex-none"
            >
              <MessageCircle size={16} />
              <span className="hidden sm:inline">Message</span>
            </Button>
            
            
          </div>
        </div>
      </Card>
    </motion.div>
  )
}