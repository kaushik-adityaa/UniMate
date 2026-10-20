import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { ExternalLink } from 'lucide-react';

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="prose prose-invert max-w-none text-inherit leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');

            if (!inline && (match || value.includes('\n'))) {
              return (
                <CodeBlock
                  language={match ? match[1] : ''}
                  value={value}
                />
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded-md text-[13px] font-mono bg-[#1E1E22] dark:bg-[#1C1C20] light:bg-[#E2E8F0] text-indigo-400 dark:text-indigo-300 light:text-indigo-600 border border-[#27272A] dark:border-[#27272A] light:border-slate-300"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/40 hover:decoration-indigo-400 transition-colors"
              >
                <span>{children}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-xl border border-[#27272A] light:border-slate-300 shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-[#18181B] light:bg-slate-100 text-[#FAFAFA] light:text-slate-800 font-semibold border-b border-[#27272A] light:border-slate-300">
                {children}
              </thead>
            );
          },
          th({ children }) {
            return <th className="px-4 py-2.5 text-xs uppercase tracking-wider font-semibold">{children}</th>;
          },
          td({ children }) {
            return (
              <td className="px-4 py-2.5 border-t border-[#222222] light:border-slate-200 text-sm">
                {children}
              </td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-3 border-l-4 border-indigo-500 bg-indigo-950/20 light:bg-indigo-50/50 px-4 py-2 rounded-r-lg text-sm text-[#D4D4D8] light:text-slate-700 italic">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold mt-6 mb-3 text-[#FAFAFA] light:text-slate-900 border-b border-[#27272A] light:border-slate-200 pb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-semibold mt-5 mb-2.5 text-[#FAFAFA] light:text-slate-900">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-semibold mt-4 mb-2 text-[#F4F4F5] light:text-slate-800">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="list-disc list-outside pl-5 my-2 space-y-1.5">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-outside pl-5 my-2 space-y-1.5">{children}</ol>;
          },
          p({ children }) {
            return <p className="my-2.5 leading-relaxed">{children}</p>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
