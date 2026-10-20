import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import WelcomeScreen from './WelcomeScreen';
import { KeyRound, Sparkles } from 'lucide-react';

export default function ChatWindow() {
  const {
    activeConversation,
    retryLastMessage,
    serverStatus,
    setIsKeyModalOpen,
  } = useChat();

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const messages = activeConversation?.messages || [];
  const hasMessages = messages.length > 0;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, messages[messages.length - 1]?.content]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#FAFAFA] overflow-hidden relative">
      {/* API Key Alert Banner (if key not configured) */}
      {!serverStatus.loading && !serverStatus.configured && (
        <div className="bg-indigo-950/70 border-b border-indigo-800/60 px-4 py-2 text-xs text-indigo-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>
              <strong>Gemini API key not configured:</strong> UniMate needs a free Gemini key to generate live responses.
            </span>
          </div>
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-sm ml-3 flex-shrink-0"
          >
            Setup Key
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-2 sm:px-4 flex flex-col"
      >
        {!hasMessages ? (
          <WelcomeScreen />
        ) : (
          <div className="max-w-4xl w-full mx-auto py-6 flex flex-col gap-2">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRetry={message.isError ? retryLastMessage : null}
              />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Message Composer Area */}
      <div className="border-t border-[#1C1C20] dark:border-[#1C1C20] light:border-slate-200 bg-[#0A0A0A]/95 dark:bg-[#0A0A0A]/95 light:bg-white/95 backdrop-blur-md">
        <MessageInput />
      </div>
    </div>
  );
}
