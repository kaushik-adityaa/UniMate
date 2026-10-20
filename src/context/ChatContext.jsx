import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const ChatContext = createContext();

const STORAGE_KEY = 'unimate_conversations_v1';
const ACTIVE_CONV_KEY = 'unimate_active_conv_id';

export function ChatProvider({ children }) {
  // Navigation view: 'chat' | 'fresher-guide' | 'academic-help' | 'career' | 'campus-life'
  const [currentView, setCurrentView] = useState('chat');

  // Server API key status
  const [serverStatus, setServerStatus] = useState({
    configured: false,
    model: 'gemini-1.5-flash',
    loading: true,
  });

  // Setup / API key modal state
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  // Conversations state
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse conversations from localStorage:', e);
    }
    return [];
  });

  const [activeId, setActiveId] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_CONV_KEY) || null;
    } catch {
      return null;
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef(null);

  // Check server status on mount
  const checkServerStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setServerStatus({
          configured: Boolean(data.configured),
          model: data.model || 'gemini-1.5-flash',
          loading: false,
        });
      } else {
        setServerStatus((prev) => ({ ...prev, loading: false }));
      }
    } catch {
      setServerStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  // Save conversations to localStorage safely
  useEffect(() => {
    try {
      // Strip large raw base64 images from localStorage persistence to prevent quota overflow
      const safeConversations = conversations.map((conv) => ({
        ...conv,
        messages: conv.messages.map((msg) => {
          if (msg.imagePreview && msg.imagePreview.length > 80000) {
            // Keep a truncated indicator or small placeholder
            return { ...msg, imagePreview: '[Image attached]' };
          }
          return msg;
        }),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeConversations));
    } catch (e) {
      console.warn('LocalStorage save failed (possible storage limit):', e);
    }
  }, [conversations]);

  // Save active conversation id
  useEffect(() => {
    try {
      if (activeId) {
        localStorage.setItem(ACTIVE_CONV_KEY, activeId);
      } else {
        localStorage.removeItem(ACTIVE_CONV_KEY);
      }
    } catch (e) {
      console.warn('Failed to save active conversation id:', e);
    }
  }, [activeId]);

  // Find active conversation
  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  // Start fresh chat
  const startNewChat = () => {
    setActiveId(null);
    setCurrentView('chat');
  };

  // Switch to specific conversation
  const selectConversation = (id) => {
    setActiveId(id);
    setCurrentView('chat');
  };

  // Delete individual conversation
  const deleteConversation = (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  };

  // Rename a conversation
  const renameConversation = (id, newTitle) => {
    if (!newTitle || !newTitle.trim()) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle.trim(), updatedAt: Date.now() } : c))
    );
  };

  // Clear all conversations
  const clearAllConversations = () => {
    setConversations([]);
    setActiveId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_CONV_KEY);
    } catch {
      // ignore
    }
  };

  // Stop currently running generation
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // Auto-generate title from message text
  const generateTitle = (text) => {
    if (!text || !text.trim()) return 'Image Question';
    const clean = text.replace(/[\n\r]+/g, ' ').trim();
    const words = clean.split(' ');
    if (words.length <= 6) return clean;
    return words.slice(0, 6).join(' ') + '...';
  };

  /**
   * Primary Send Message handler
   */
  const sendMessage = async ({ text, image = null, retryFromMessageId = null }) => {
    if (isGenerating) return;

    const trimmedText = (text || '').trim();
    if (!trimmedText && !image) return;

    // Switch to chat view immediately
    setCurrentView('chat');

    let currentConvId = activeId;
    let targetConversation = conversations.find((c) => c.id === currentConvId);

    // If new chat, initialize a new conversation
    if (!targetConversation || !currentConvId) {
      const newId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const newTitle = generateTitle(trimmedText);
      const newConv = {
        id: newId,
        title: newTitle,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(newId);
      currentConvId = newId;
      targetConversation = newConv;
    }

    // Build message objects
    const userMsgId = 'msg_user_' + Date.now();
    const assistantMsgId = 'msg_asst_' + (Date.now() + 1);

    const newUserMessage = {
      id: userMsgId,
      role: 'user',
      content: trimmedText,
      imagePreview: image?.data || null,
      timestamp: Date.now(),
    };

    const newAssistantMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    // Calculate updated messages list
    let updatedMessages;
    if (retryFromMessageId) {
      // Find the index of the message to retry and drop subsequent messages
      const existing = targetConversation.messages;
      const idx = existing.findIndex((m) => m.id === retryFromMessageId);
      if (idx !== -1) {
        updatedMessages = [...existing.slice(0, idx), newUserMessage, newAssistantMessage];
      } else {
        updatedMessages = [...existing, newUserMessage, newAssistantMessage];
      }
    } else {
      updatedMessages = [...(targetConversation.messages || []), newUserMessage, newAssistantMessage];
    }

    // Update state with pending messages
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConvId
          ? { ...c, messages: updatedMessages, updatedAt: Date.now() }
          : c
      )
    );

    // Prepare history payload for server (excluding the new assistant message)
    const historyPayload = (targetConversation.messages || [])
      .filter((m) => !m.isError && m.content)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedText,
          history: historyPayload,
          image: image ? { data: image.data, mimeType: image.mimeType } : null,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errMsg = errorData.message || errorData.error || `Server returned error (${response.status})`;

        if (response.status === 401 || errorData.error === 'GEMINI_API_KEY_MISSING') {
          errMsg = 'Gemini API key is not configured. Please set your key in the Setup modal or .env file.';
          setIsKeyModalOpen(true);
        }

        throw new Error(errMsg);
      }

      // Read SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.chunk) {
                accumulatedText += data.chunk;
                // Live update assistant message
                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id !== currentConvId) return c;
                    return {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId
                          ? { ...m, content: accumulatedText, isStreaming: true }
                          : m
                      ),
                    };
                  })
                );
              }
              if (data.done) {
                // finished
              }
            } catch (err) {
              if (err.message && !err.message.includes('JSON')) {
                throw err;
              }
            }
          }
        }
      }

      // Mark streaming complete
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentConvId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: accumulatedText || 'I processed your request.', isStreaming: false }
                : m
            ),
          };
        })
      );
    } catch (err) {
      if (err.name === 'AbortError' || err.message === 'CLIENT_ABORTED') {
        // Stream aborted by user
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: m.content ? m.content + '\n\n*(Generation stopped by user)*' : '*(Generation stopped)*',
                      isStreaming: false,
                    }
                  : m
              ),
            };
          })
        );
      } else {
        console.error('Chat error:', err);
        const errorText = err.message || 'An unexpected network error occurred.';
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: errorText,
                      isStreaming: false,
                      isError: true,
                      errorMessage: errorText,
                    }
                  : m
              ),
            };
          })
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Retry a message
  const retryLastMessage = () => {
    if (!activeConversation || activeConversation.messages.length < 2) return;
    const msgs = activeConversation.messages;
    const lastUserIdx = [...msgs].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIdx === -1) return;
    const realIndex = msgs.length - 1 - lastUserIdx;
    const userMsg = msgs[realIndex];

    sendMessage({
      text: userMsg.content,
      image: userMsg.imagePreview ? { data: userMsg.imagePreview, mimeType: 'image/jpeg' } : null,
      retryFromMessageId: userMsg.id,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        currentView,
        setCurrentView,
        conversations,
        activeId,
        activeConversation,
        isGenerating,
        serverStatus,
        checkServerStatus,
        isKeyModalOpen,
        setIsKeyModalOpen,
        startNewChat,
        selectConversation,
        deleteConversation,
        renameConversation,
        clearAllConversations,
        sendMessage,
        stopGeneration,
        retryLastMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
