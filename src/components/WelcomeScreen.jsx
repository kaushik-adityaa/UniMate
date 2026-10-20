import React from 'react';
import { useChat } from '../context/ChatContext';
import {
  Compass,
  Trophy,
  BookOpen,
  Briefcase,
  Users,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const SUGGESTION_CARDS = [
  {
    id: 'fresher-guide',
    title: 'Fresher Starter Guide',
    prompt: "I'm new to Galgotias. Help me get started.",
    icon: Compass,
    color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400',
  },
  {
    id: 'hackathons-internships',
    title: 'Hackathons & Internships',
    prompt: 'How can I find opportunities and prepare for them?',
    icon: Trophy,
    color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400',
  },
  {
    id: 'exam-prep',
    title: 'Exam Preparation',
    prompt: 'Help me prepare for my upcoming exams or viva.',
    icon: BookOpen,
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400',
  },
  {
    id: 'placement-prep',
    title: 'Placement Preparation',
    prompt: 'Create a roadmap for technical placements.',
    icon: Briefcase,
    color: 'from-purple-500/10 to-violet-500/10 border-purple-500/20 text-purple-400',
  },
  {
    id: 'clubs-campus',
    title: 'Clubs & Campus Life',
    prompt: 'How can I explore campus activities and meet people?',
    icon: Users,
    color: 'from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-400',
  },
  {
    id: 'university-life',
    title: 'University Life',
    prompt: 'Explain the university processes I should understand.',
    icon: GraduationCap,
    color: 'from-cyan-500/10 to-sky-500/10 border-cyan-500/20 text-cyan-400',
  },
];

export default function WelcomeScreen() {
  const { sendMessage } = useChat();

  const handleCardClick = (promptText) => {
    sendMessage({ text: promptText });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full select-none">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-4 border border-indigo-400/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA] light:text-slate-900 mb-3">
          UniMate
        </h1>

        <p className="text-xs uppercase tracking-widest font-semibold text-indigo-400 mb-4">
          Your Campus. Your Growth. Your UniMate.
        </p>

        {/* Exact welcome message as requested */}
        <div className="rounded-2xl p-5 bg-[#121214] dark:bg-[#121214] light:bg-slate-50 border border-[#222222] dark:border-[#222222] light:border-slate-200 text-sm leading-relaxed text-[#D4D4D8] light:text-slate-700 shadow-sm text-left">
          <p className="font-medium text-[#FAFAFA] light:text-slate-900 mb-2">
            Hey! I'm UniMate, your Galgotias University companion. 👋
          </p>
          <p className="mb-2">
            Whether you're a fresher figuring out college life, a student preparing for exams, or someone building skills for internships and placements, I'm here to help you move forward.
          </p>
          <p>
            Ask me anything about academics, programming, campus life, hackathons, internships, or your career. Let's make your college journey count!
          </p>
        </div>
      </div>

      {/* 6 Interactive Suggestion Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SUGGESTION_CARDS.map((card) => {
          const IconComponent = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.prompt)}
              className="flex flex-col items-start p-4 rounded-xl text-left bg-[#121214] dark:bg-[#121214] light:bg-white border border-[#222222] dark:border-[#222222] light:border-slate-200 hover:border-indigo-500/60 dark:hover:border-indigo-500/60 light:hover:border-indigo-500 hover:bg-[#161619] dark:hover:bg-[#161619] light:hover:bg-slate-50 transition-all group shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg border bg-gradient-to-br ${card.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-[#FAFAFA] light:text-slate-900 group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] light:text-slate-600 line-clamp-2 leading-relaxed">
                “{card.prompt}”
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
