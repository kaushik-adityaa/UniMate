import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot, User, Copy, Check, RotateCcw, AlertTriangle } from 'lucide-react';

export default function ChatMessage({ message, onRetry }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`flex w-full py-4 px-3 sm:px-6 transition-colors ${
        isUser
          ? 'justify-end'
          : 'justify-start bg-transparent'
      }`}
    >
      <div
        className={`flex gap-3.5 max-w-[90%] md:max-w-[82%] lg:max-w-[76%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-sm">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#18181B] dark:bg-[#18181B] light:bg-indigo-50 border border-[#27272A] light:border-indigo-200 text-indigo-400 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Bubble & Content */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header with name and timestamp */}
          <div
            className={`flex items-center gap-2 mb-1 text-xs text-[#71717A] ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <span className="font-medium text-[#A1A1AA] light:text-slate-700">
              {isUser ? 'You' : 'UniMate'}
            </span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>

          {/* Body */}
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
              isUser
                ? 'bg-indigo-600 text-white rounded-tr-sm'
                : message.isError
                ? 'bg-rose-950/20 border border-rose-900/50 text-rose-300 rounded-tl-sm'
                : 'bg-[#121214] dark:bg-[#121214] light:bg-slate-50 border border-[#222222] dark:border-[#222222] light:border-slate-200 text-[#FAFAFA] light:text-slate-800 rounded-tl-sm'
            }`}
          >
            {/* Attached Image Thumbnail */}
            {message.imagePreview && (
              <div className="mb-3 overflow-hidden rounded-xl border border-white/20 max-w-sm">
                <img
                  src={message.imagePreview}
                  alt="Student query attachment"
                  className="max-h-60 w-auto object-contain bg-black/40"
                  loading="lazy"
                />
              </div>
            )}

            {/* Error Message Layout */}
            {message.isError ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2 text-rose-400 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{message.errorMessage || message.content || 'An error occurred.'}</span>
                </div>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-colors focus:outline-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Question</span>
                  </button>
                )}
              </div>
            ) : isUser ? (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            ) : (
              <div>
                <MarkdownRenderer content={message.content} />
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse rounded-sm align-middle" />
                )}
              </div>
            )}
          </div>

          {/* Bottom Actions for UniMate messages */}
          {!isUser && !message.isError && message.content && (
            <div className="flex items-center gap-2 mt-1.5 pl-1">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-[#71717A] hover:text-[#FAFAFA] light:hover:text-slate-900 transition-colors"
                title="Copy response"
                aria-label="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
