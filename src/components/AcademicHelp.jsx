import React, { useState } from 'react';
import { ACADEMIC_TOPICS } from '../data/academicData';
import { useChat } from '../context/ChatContext';
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Code,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

export default function AcademicHelp() {
  const { sendMessage, setCurrentView } = useChat();
  const [selectedTopicId, setSelectedTopicId] = useState('dsa');

  const activeTopic =
    ACADEMIC_TOPICS.find((t) => t.id === selectedTopicId) || ACADEMIC_TOPICS[0];

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
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h1 className="text-sm font-semibold text-[#FAFAFA] light:text-slate-900">
              Academic & Technical Tutor
            </h1>
          </div>
        </div>

        <span className="text-[11px] text-[#71717A] hidden sm:inline">
          DSA, OOP, SQL, Web Dev, Viva Preparation
        </span>
      </div>

      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Subject selector sidebar */}
        <div className="lg:w-72 flex-shrink-0 flex flex-col gap-1.5">
          <span className="text-xs uppercase font-semibold text-[#71717A] px-2 mb-2 tracking-wider">
            Curriculum Subjects
          </span>
          {ACADEMIC_TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-600/15 border border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'text-[#A1A1AA] light:text-slate-600 hover:text-[#FAFAFA] light:hover:text-slate-900 hover:bg-[#141416] light:hover:bg-slate-100'
                }`}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="truncate">{topic.title}</span>
                  <span className="text-[10px] text-[#71717A]">{topic.category}</span>
                </div>
                {isSelected && <ArrowRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Detailed Topic View */}
        <div className="flex-1 flex flex-col gap-6 bg-[#111113] dark:bg-[#111113] light:bg-white border border-[#222222] dark:border-[#222222] light:border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-[#222222] dark:border-[#222222] light:border-slate-200 pb-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {activeTopic.category}
              </span>
              <button
                onClick={() => handleAsk(activeTopic.prompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain in Chat</span>
              </button>
            </div>
            <h2 className="text-xl font-bold text-[#FAFAFA] light:text-slate-900">
              {activeTopic.title}
            </h2>
            <p className="text-sm text-[#A1A1AA] light:text-slate-600">
              {activeTopic.description}
            </p>
          </div>

          {/* Key Syllabus Concepts */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-semibold text-[#71717A] tracking-wider flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Core Concepts & Algorithms</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeTopic.keyConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141416] dark:bg-[#141416] light:bg-slate-50 border border-[#222222] dark:border-[#222222] light:border-slate-200 text-xs text-[#D4D4D8] light:text-slate-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typical Viva & Lab Exam Questions */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase font-semibold text-[#71717A] tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Common Viva Voce & Lab Exam Questions</span>
            </h3>
            <div className="flex flex-col gap-2">
              {activeTopic.vivaQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(`Answer this viva question with structured explanation, example, and common pitfalls: "${q}"`)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#141416] dark:bg-[#141416] light:bg-slate-50 border border-[#222222] dark:border-[#222222] light:border-slate-200 hover:border-emerald-500/50 hover:bg-[#18181C] text-left text-xs text-[#FAFAFA] light:text-slate-800 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">Q:</span>
                    <span className="group-hover:text-emerald-300 transition-colors">{q}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#71717A] group-hover:text-emerald-400 transition-all flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Recommended Study Prompt */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/20 to-teal-950/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-[#D4D4D8] light:text-slate-700">
              <span className="font-semibold text-emerald-400 block mb-0.5">Quick Deep-Dive:</span>
              “{activeTopic.prompt}”
            </div>
            <button
              onClick={() => handleAsk(activeTopic.prompt)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex-shrink-0"
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
