import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Image as ImageIcon, X, Square, ShieldAlert } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function MessageInput() {
  const { sendMessage, isGenerating, stopGeneration } = useChat();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // { data: string, mimeType: string, name: string }
  const [errorBanner, setErrorBanner] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 180) + 'px';
    }
  }, [inputText]);

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorBanner('');

    // Check MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      setErrorBanner('Please select a valid image file (PNG, JPEG, WEBP, GIF).');
      return;
    }

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorBanner('Image file is larger than 10MB. Please select a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage({
        data: event.target.result,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);

    // Reset file input value so re-selecting same file triggers change
    e.target.value = '';
  };

  const removeImage = () => {
    setSelectedImage(null);
    setErrorBanner('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isGenerating) return;

    const trimmed = inputText.trim();
    if (!trimmed && !selectedImage) return;

    sendMessage({
      text: trimmed,
      image: selectedImage,
    });

    setInputText('');
    setSelectedImage(null);
    setErrorBanner('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = Boolean(inputText.trim() || selectedImage);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-3 sm:pb-4 pt-1">
      {/* Privacy reminder */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#71717A] mb-2 text-center select-none">
        <ShieldAlert className="w-3.5 h-3.5 text-[#A1A1AA] flex-shrink-0" />
        <span>Privacy notice: Avoid sharing passwords, student IDs, fee receipts, or sensitive personal data.</span>
      </div>

      {/* Error banner */}
      {errorBanner && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center justify-between">
          <span>{errorBanner}</span>
          <button onClick={() => setErrorBanner('')} className="text-rose-400 hover:text-rose-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image Preview Pill */}
      {selectedImage && (
        <div className="mb-2.5 flex items-center gap-3 p-2 rounded-xl bg-[#18181B] dark:bg-[#18181B] light:bg-slate-100 border border-[#27272A] light:border-slate-300 w-fit max-w-md">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/50 flex-shrink-0 border border-white/10">
            <img
              src={selectedImage.data}
              alt="Attachment preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-xs font-medium text-[#FAFAFA] light:text-slate-800 truncate">
              {selectedImage.name}
            </span>
            <span className="text-[10px] text-[#A1A1AA]">Ready to send with your question</span>
          </div>
          <button
            onClick={removeImage}
            className="p-1 rounded-full text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] light:hover:bg-slate-200 transition-colors ml-auto"
            title="Remove attachment"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Composer Box */}
      <div className="relative flex flex-col rounded-2xl bg-[#141416] dark:bg-[#141416] light:bg-white border border-[#27272A] dark:border-[#27272A] light:border-slate-300 shadow-lg focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
        {/* Hidden File Picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif, image/heic"
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask UniMate about Galgotias, coding, exams, placements, or attach an image..."
          rows={1}
          disabled={isGenerating}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm text-[#FAFAFA] dark:text-[#FAFAFA] light:text-slate-900 placeholder-[#71717A] focus:outline-none max-h-48 leading-relaxed"
        />

        {/* Action bar inside composer */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#1E1E22] light:hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-40"
              title="Attach diagram, compiler error, or question image"
            >
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Attach Image</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                type="button"
                onClick={stopGeneration}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all focus:outline-none"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!hasContent || isGenerating}
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                  hasContent && !isGenerating
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-[#222226] text-[#71717A] cursor-not-allowed'
                }`}
                title="Send message (Enter)"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
