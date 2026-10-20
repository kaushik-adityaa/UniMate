import React, { useState, useMemo } from 'react';
import hljs from 'highlight.js';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const cleanLang = (language || 'plaintext').toLowerCase();

  const highlightedCode = useMemo(() => {
    if (!value) return '';
    try {
      if (hljs.getLanguage(cleanLang)) {
        return hljs.highlight(value, { language: cleanLang }).value;
      }
      return hljs.highlightAuto(value).value;
    } catch {
      return value;
    }
  }, [value, cleanLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  return (
    <div className="relative my-4 rounded-xl border border-[#27272A] bg-[#0E0E10] dark:bg-[#0E0E10] dark:border-[#222222] overflow-hidden text-sm shadow-sm group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#222222] bg-[#141416] text-[#A1A1AA] text-xs font-mono select-none">
        <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[11px]">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#222222] transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Copy code to clipboard"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <pre className="m-0 p-0">
          <code
            className={`hljs ${cleanLang}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
}
