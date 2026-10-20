import React, { useState } from 'react';
import { FRESHER_GUIDE_CATEGORIES } from '../data/fresherData';
import { useChat } from '../context/ChatContext';
import {
  Compass,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export default function FresherGuide() {
  const { sendMessage, setCurrentView } = useChat();
  const [selectedCategoryId, setSelectedCategoryId] = useState('getting-started');

  const activeCategory =
    FRESHER_GUIDE_CATEGORIES.find((cat) => cat.id === selectedCategoryId) ||
    FRESHER_GUIDE_CATEGORIES[0];

  const handleAskQuestion = (question) => {
    sendMessage({ text: question });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#F8FAFC] overflow-y-auto">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 px-4 sm:px-6 py-3.5 bg-[#0A0A0A]/90 dark:bg-[#0A0A0A]/90 light:bg-white/90 backdrop-blur-md border-b border-[#222222] dark:border-[#222222] light:border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#18181B] light:hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Chat</span>
          </button>
          <div className="h-4 w-px bg-[#27272A] light:bg-slate-300" />
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <h1 className="text-sm font-semibold text-[#FAFAFA] light:text-slate-900">
              Galgotias Fresher's Guide
            </h1>
          </div>
        </div>

        <span className="text-[11px] text-[#71717A] hidden sm:inline">
          10 Essential Categories for Incoming Students
        </span>
      </div>

      {/* Main Guide Content */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left Category List / Tabs */}
        <div className="lg:w-72 flex-shrink-0 flex flex-col gap-1.5">
          <span className="text-xs uppercase font-semibold text-[#71717A] px-2 mb-2 tracking-wider">
            Guide Categories
          </span>
          {FRESHER_GUIDE_CATEGORIES.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600/15 border border-indigo-500/40 text-indigo-300 shadow-sm'
                    : 'text-[#A1A1AA] light:text-slate-600 hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#141416] light:hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{cat.title}</span>
                {isSelected && <ArrowRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Right Category Details View */}
        <div className="flex-1 flex flex-col gap-6 bg-[#111113] dark:bg-[#111113] light:bg-white border border-[#222222] dark:border-[#222222] light:border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-[#222222] dark:border-[#222222] light:border-slate-200 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {activeCategory.badge}
              </span>
              <button
                onClick={() => handleAskQuestion(`Explain all details about: ${activeCategory.title} at Galgotias University.`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask UniMate in Chat</span>
              </button>
            </div>
            <h2 className="text-xl font-bold text-[#FAFAFA] light:text-slate-900">
              {activeCategory.title}
            </h2>
            <p className="text-sm text-[#A1A1AA] light:text-slate-600">
              {activeCategory.description}
            </p>
          </div>

          {/* Explanation */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-semibold text-[#71717A] tracking-wider">
              Overview & Advice
            </h3>
            <p className="text-sm leading-relaxed text-[#D4D4D8] light:text-slate-700 bg-[#161619] dark:bg-[#161619] light:bg-slate-50 p-4 rounded-xl border border-[#222222] dark:border-[#222222] light:border-slate-200">
              {activeCategory.explanation}
            </p>
          </div>

          {/* Actionable Next Steps */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-semibold text-[#71717A] tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Actionable Steps for Freshers</span>
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {activeCategory.actionableSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#141416] dark:bg-[#141416] light:bg-slate-50/70 border border-[#222222] dark:border-[#222222] light:border-slate-200 text-xs text-[#D4D4D8] light:text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Notice */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-300 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <strong>Official Notice:</strong> {activeCategory.verificationNote}
            </div>
          </div>

          {/* Starter Questions (Click to Ask) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase font-semibold text-[#71717A] tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Common Starter Questions (Click to Ask UniMate)</span>
            </h3>
            <div className="flex flex-col gap-2">
              {activeCategory.starterQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(q)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141416] dark:bg-[#141416] light:bg-slate-50 border border-[#222222] dark:border-[#222222] light:border-slate-200 hover:border-indigo-500/50 hover:bg-[#18181C] text-left text-xs text-[#FAFAFA] light:text-slate-800 transition-all group cursor-pointer"
                >
                  <span className="group-hover:text-indigo-400 transition-colors">
                    “{q}”
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#71717A] group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
