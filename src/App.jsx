import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider, useChat } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import FresherGuide from './components/FresherGuide';
import AcademicHelp from './components/AcademicHelp';
import CareerOpportunities from './components/CareerOpportunities';
import CampusLife from './components/CampusLife';
import ApiKeyModal from './components/ApiKeyModal';
import { Menu, GraduationCap, Plus } from 'lucide-react';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentView, setCurrentView, startNewChat, isKeyModalOpen, setIsKeyModalOpen } = useChat();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#FAFAFA]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111111] dark:bg-[#111111] light:bg-white border-b border-[#222222] dark:border-[#222222] light:border-slate-200 z-20 select-none">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#18181B] light:hover:bg-slate-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setCurrentView('chat');
                startNewChat();
              }}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-[#FAFAFA] light:text-slate-900">
                UniMate
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentView('chat');
              startNewChat();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </header>

        {/* View Switcher */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {currentView === 'chat' && <ChatWindow />}
          {currentView === 'fresher-guide' && <FresherGuide />}
          {currentView === 'academic-help' && <AcademicHelp />}
          {currentView === 'career' && <CareerOpportunities />}
          {currentView === 'campus-life' && <CampusLife />}
        </main>
      </div>

      {/* API Key Setup Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <MainLayout />
      </ChatProvider>
    </ThemeProvider>
  );
}
