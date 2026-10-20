import React, { useState } from 'react';
import { CAREER_GUIDES } from '../data/careerData';
import { useChat } from '../context/ChatContext';
import {
  Briefcase,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function CareerOpportunities() {
  const { sendMessage, setCurrentView } = useChat();
  const [selectedGuideId, setSelectedGuideId] = useState('dsa-roadmap');

  const activeGuide =
    CAREER_GUIDES.find((g) => g.id === selectedGuideId) || CAREER_GUIDES[0];

  const handleAsk = (prompt) => {
    sendMessage({ text: prompt });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0A0A] dark:bg-[#0A0A0A] light:bg-[#F8FAFC] overflow-y-auto">
      {/* Top Navbar */}
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
            <Briefcase className="w-4 h-4 text-purple-400" />
            <h1 className="text-sm font-semibold text-[#FAFAFA] light:text-slate-900">
              Career & Opportunities
            </h1>
          </div>
        </div>

        <span className="text-[11px] text-[#71717A] hidden sm:inline">
          Placements, Internships, Hackathons, GSoC, Resumes
        </span>
      </div>

      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Guides List */}
        <div className="lg:w-72 flex-shrink-0 flex flex-col gap-1.5">
          <span className="text-xs uppercase font-semibold text-[#71717A] px-2 mb-2 tracking-wider">
            Career Tracks
          </span>
          {CAREER_GUIDES.map((guide) => {
            const isSelected = guide.id === selectedGuideId;
            return (
              <button
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-600/15 border border-purple-500/40 text-purple-300 shadow-sm'
                    : 'text-[#A1A1AA] light:text-slate-600 hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#141416] light:hover:bg-slate-100'
                }`}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="truncate">{guide.title}</span>
                  <span className="text-[10px] text-[#71717A]">{guide.tag}</span>
                </div>
                {isSelected && <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Detailed Guide View */}
        <div className="flex-1 flex flex-col gap-6 bg-[#111113] dark:bg-[#111113] light:bg-white border border-[#222222] dark:border-[#222222] light:border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-[#222222] dark:border-[#222222] light:border-slate-200 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {activeGuide.tag}
              </span>
              <button
                onClick={() => handleAsk(activeGuide.starterPrompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Personalized Plan</span>
              </button>
            </div>
            <h2 className="text-xl font-bold text-[#FAFAFA] light:text-slate-900">
              {activeGuide.title}
            </h2>
            <p className="text-sm text-[#A1A1AA] light:text-slate-600">
              {activeGuide.description}
            </p>
          </div>

          {/* Actionable Milestones */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-semibold text-[#71717A] tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Milestones & Action Plan</span>
            </h3>
            <div className="flex flex-col gap-2.5">
              {activeGuide.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141416] dark:bg-[#141416] light:bg-slate-50 border border-[#222222] dark:border-[#222222] light:border-slate-200 text-xs text-[#D4D4D8] light:text-slate-700"
                >
                  <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification / Authenticity Notice */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/40 text-purple-200 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-400" />
            <div>
              <strong>Career Guidance Notice:</strong> Application deadlines, company eligibility, cutoffs, and hiring criteria must always be confirmed on official employer portals and the Galgotias Career Planning & Development Division (CPDD).
            </div>
          </div>

          {/* Prompt Trigger */}
          <div className="p-4 rounded-xl bg-[#161619] dark:bg-[#161619] light:bg-slate-50 border border-[#27272A] light:border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-[#D4D4D8] light:text-slate-700">
              <span className="font-semibold text-purple-400 block mb-0.5">Explore with UniMate:</span>
              “{activeGuide.starterPrompt}”
            </div>
            <button
              onClick={() => handleAsk(activeGuide.starterPrompt)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex-shrink-0"
            >
              Ask Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
