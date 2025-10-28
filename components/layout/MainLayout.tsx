'use client'

import { motion } from 'framer-motion'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { SortVisualizer } from '@/components/visualizer/SortVisualizer'
import { VisualizerControls } from '@/components/visualizer/VisualizerControls'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { useAppStore } from '@/store/useAppStore'
import { useSortingAnimation } from '@/hooks/useSortingAnimation'
import { Button } from '@/components/ui/button'
import { MessageSquare, BarChart3 } from 'lucide-react'

export function MainLayout() {
  const { activeTab, setActiveTab, isSidebarOpen } = useAppStore()
  
  // Enable sorting animation
  useSortingAnimation()

  return (
    <div className="flex h-screen flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        {/* Desktop: 2-column layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* Visualizer Column */}
          <div className="flex flex-1 flex-col border-r">
            <div className="border-b p-4">
              <VisualizerControls />
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <SortVisualizer />
            </div>
          </div>
          
          {/* Chat Column */}
          <div className="w-[400px] flex flex-col">
            <ChatPanel />
          </div>
        </div>

        {/* Mobile: Tabbed layout */}
        <div className="lg:hidden flex flex-1 flex-col overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex border-b">
            <Button
              variant={activeTab === 'visualizer' ? 'secondary' : 'ghost'}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab('visualizer')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Visualizer
            </Button>
            <Button
              variant={activeTab === 'chat' ? 'secondary' : 'ghost'}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'visualizer' ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <div className="border-b p-4">
                  <VisualizerControls />
                </div>
                <div className="flex-1 overflow-hidden p-4">
                  <SortVisualizer />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ChatPanel />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
