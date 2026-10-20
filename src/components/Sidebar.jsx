import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import ConfirmDialog from './ConfirmDialog';
import {
  Plus,
  MessageSquare,
  Compass,
  BookOpen,
  Briefcase,
  Users,
  Sun,
  Moon,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  KeyRound,
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const {
    currentView,
    setCurrentView,
    conversations,
    activeId,
    startNewChat,
    selectConversation,
    deleteConversation,
    renameConversation,
    clearAllConversations,
    serverStatus,
    setIsKeyModalOpen,
  } = useChat();

  const { theme, toggleTheme, isDark } = useTheme();

  // Dialog & edit states
  const [editingConvId, setEditingConvId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [deleteIdTarget, setDeleteIdTarget] = useState(null);

  const handleStartRename = (conv, e) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = (convId, e) => {
    e?.stopPropagation();
    if (editingTitle.trim()) {
      renameConversation(convId, editingTitle.trim());
    }
    setEditingConvId(null);
    setEditingTitle('');
  };

  const handleCancelRename = (e) => {
    e?.stopPropagation();
    setEditingConvId(null);
    setEditingTitle('');
  };

  const handleRequestDelete = (id, e) => {
    e.stopPropagation();
    setDeleteIdTarget(id);
  };

  const handleConfirmDelete = () => {
    if (deleteIdTarget) {
      deleteConversation(deleteIdTarget);
      setDeleteIdTarget(null);
    }
  };

  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, view: 'chat' },
    { id: 'fresher', label: "Fresher's Guide", icon: Compass, view: 'fresher-guide' },
    { id: 'academic', label: 'Academic Help', icon: BookOpen, view: 'academic-help' },
    { id: 'career', label: 'Career & Opportunities', icon: Briefcase, view: 'career' },
    { id: 'campus', label: 'Campus Life', icon: Users, view: 'campus-life' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 flex-shrink-0 flex flex-col bg-[#111111] dark:bg-[#111111] light:bg-[#F8FAFC] border-r border-[#222222] dark:border-[#222222] light:border-slate-200 transition-transform duration-200 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Wordmark */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#222222] dark:border-[#222222] light:border-slate-200">
          <button
            onClick={() => {
              setCurrentView('chat');
              startNewChat();
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-[#FAFAFA] light:text-slate-900">
                  UniMate
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-400">
                  GU
                </span>
              </div>
              <p className="text-[10px] text-[#71717A] leading-none">
                Galgotias AI Companion
              </p>
            </div>
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-[#FAFAFA] light:hover:text-slate-800 md:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              startNewChat();
              if (window.innerWidth < 768) setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Section Navigation Links */}
        <div className="px-3 py-1 flex flex-col gap-1 border-b border-[#222222] dark:border-[#222222] light:border-slate-200">
          <span className="text-[10px] uppercase font-semibold text-[#71717A] px-2 py-1 tracking-wider">
            Explore
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.view);
                  if (item.view === 'chat' && !activeId) {
                    startNewChat();
                  }
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1E1E22] dark:bg-[#1E1E22] light:bg-indigo-50 text-indigo-400 light:text-indigo-600 font-semibold'
                    : 'text-[#A1A1AA] light:text-slate-600 hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#161618] light:hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400 light:text-indigo-600' : 'text-[#71717A]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Recent Chat History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] uppercase font-semibold text-[#71717A] tracking-wider">
              Recent Chats
            </span>
            {conversations.length > 0 && (
              <button
                onClick={() => setClearConfirmOpen(true)}
                className="text-[10px] text-[#71717A] hover:text-rose-400 transition-colors"
                title="Clear all chats"
              >
                Clear all
              </button>
            )}
          </div>

          {conversations.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[#71717A]">
              No conversations yet. Start asking UniMate!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = activeId === conv.id && currentView === 'chat';
              const isEditing = editingConvId === conv.id;

              if (isEditing) {
                return (
                  <div
                    key={conv.id}
                    className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#1C1C20] border border-indigo-500/50"
                  >
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(conv.id, e);
                        if (e.key === 'Escape') handleCancelRename(e);
                      }}
                      autoFocus
                      className="flex-1 bg-transparent px-2 py-1 text-xs text-[#FAFAFA] focus:outline-none"
                    />
                    <button
                      onClick={(e) => handleSaveRename(conv.id, e)}
                      className="p-1 text-emerald-400 hover:text-emerald-300"
                      title="Save title"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCancelRename}
                      className="p-1 text-[#71717A] hover:text-rose-400"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    selectConversation(conv.id);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#1E1E22] dark:bg-[#1E1E22] light:bg-indigo-50/80 text-[#FAFAFA] light:text-slate-900 border border-[#27272A] light:border-indigo-100 font-medium'
                      : 'text-[#A1A1AA] light:text-slate-600 hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#161618] light:hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#71717A] flex-shrink-0" />
                    <span className="truncate">{conv.title || 'Untitled Chat'}</span>
                  </div>

                  {/* Actions (Rename, Delete) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={(e) => handleStartRename(conv, e)}
                      className="p-1 rounded text-[#71717A] hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#27272A] light:hover:bg-slate-200 transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleRequestDelete(conv.id, e)}
                      className="p-1 rounded text-[#71717A] hover:text-rose-400 hover:bg-[#27272A] light:hover:bg-slate-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area with Theme Toggle, Key Config, Tagline */}
        <div className="p-3 border-t border-[#222222] dark:border-[#222222] light:border-slate-200 flex flex-col gap-2">
          {/* Action Row: Theme toggle & API Key Modal */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] light:text-slate-600 hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#18181B] light:hover:bg-slate-100 transition-colors cursor-pointer"
              title="API Key Configuration"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>API Key</span>
              {serverStatus.configured && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] light:text-slate-600 hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#18181B] light:hover:bg-slate-100 transition-colors cursor-pointer"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[11px]">Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Official Tagline Footer */}
          <div className="px-2 pt-1 text-center">
            <p className="text-[10px] text-[#71717A] leading-tight font-medium">
              “Your Campus. Your Growth. Your UniMate.”
            </p>
          </div>
        </div>
      </aside>

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={clearConfirmOpen}
        title="Clear All Chat History?"
        message="This will permanently delete all conversations stored in your browser's local storage. This action cannot be undone."
        confirmText="Clear History"
        isDestructive={true}
        onConfirm={() => {
          clearAllConversations();
          setClearConfirmOpen(false);
        }}
        onCancel={() => setClearConfirmOpen(false)}
      />

      {/* Delete Single Conversation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteIdTarget)}
        title="Delete Conversation?"
        message="Are you sure you want to delete this conversation from your history?"
        confirmText="Delete"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteIdTarget(null)}
      />
    </>
  );
}
