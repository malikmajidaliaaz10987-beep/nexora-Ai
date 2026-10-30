/**
 * NEXORA AI — Public Homepage (Page 1)
 * Dark Cinematic SaaS presentation with hero, live playground,
 * 7 studios breakdown, workflow personas, and interactive FAQs.
 */

import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { ActivePage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Sparkles, 
  ArrowRight, 
  PenTool, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Bot, 
  Megaphone, 
  Briefcase, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  Coins, 
  CheckCircle2, 
  ChevronRight,
  Play,
  RotateCw,
  Copy,
  Users
} from 'lucide-react';

interface HomePageProps {
  setActivePage: (page: ActivePage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Live Interactive Playground State
  const [playPrompt, setPlayPrompt] = useState('Draft a 3-point strategy for launching an AI SaaS startup in 2026');
  const [playOutput, setPlayOutput] = useState('');
  const [isPlayTesting, setIsPlayTesting] = useState(false);

  const handleLivePlayground = async () => {
    if (!playPrompt.trim()) return;
    setIsPlayTesting(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          studio: 'writing',
          tool: 'Executive Strategy Synthesizer',
          prompt: playPrompt,
          creditCost: 5,
          parameters: { length: 'Concise Bullet Points', tone: 'Strategic & High Impact' }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPlayOutput(data.output);
        showToast('Generated live using Gemini 3.8 Flash!', 'success');
      } else {
        showToast(data.error || 'Playground execution failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Execution error', 'error');
    } finally {
      setIsPlayTesting(false);
    }
  };

  const studios = [
    {
      id: 'studio-writing' as ActivePage,
      name: 'AI Writing Studio',
      desc: '18 generative modes: SEO articles, blog posts, persuasive cold emails, viral social carousels, and YouTube video scripts.',
      icon: PenTool,
      accent: 'from-[#8B5CF6] to-[#6366F1]',
      textColor: 'text-[#8B5CF6]',
      toolsCount: '18 Tools'
    },
    {
      id: 'studio-image' as ActivePage,
      name: 'AI Image Studio',
      desc: 'Text-to-image synthesis, style presets (Cinematic, Photorealistic, 3D), aspect ratio controls, and product concept assets.',
      icon: ImageIcon,
      accent: 'from-[#06B6D4] to-[#3B82F6]',
      textColor: 'text-[#06B6D4]',
      toolsCount: 'Photorealistic 8K'
    },
    {
      id: 'studio-video' as ActivePage,
      name: 'AI Video Studio',
      desc: 'Reels and YouTube Shorts storyboards, visual scene breakdowns, voiceover scripting, and asynchronous render queue management.',
      icon: Video,
      accent: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400',
      toolsCount: 'Shorts & Reels'
    },
    {
      id: 'studio-document' as ActivePage,
      name: 'AI Document Studio',
      desc: 'Interactive Chat with PDF, executive summarization, contract clause interrogations, and ATS-optimized resume builder.',
      icon: FileText,
      accent: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      toolsCount: 'Chat with PDF'
    },
    {
      id: 'studio-chatbot' as ActivePage,
      name: 'AI Chatbot Studio',
      desc: 'Deploy custom chatbots grounded in your business knowledge documents. Generates embeddable website scripts with zero coding.',
      icon: Bot,
      accent: 'from-pink-500 to-purple-500',
      textColor: 'text-pink-400',
      toolsCount: 'Embed Widget'
    },
    {
      id: 'studio-marketing' as ActivePage,
      name: 'AI Marketing Studio',
      desc: '30-day omnichannel launch planners, Google & Meta ad copy variants, SEO keyword clusters, and brand voice matrices.',
      icon: Megaphone,
      accent: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      toolsCount: 'Omnichannel'
    },
    {
      id: 'studio-business' as ActivePage,
      name: 'AI Business Assistant',
      desc: 'Deterministic invoice & quotation math paired with AI executive summaries, meeting action items, and milestone task planners.',
      icon: Briefcase,
      accent: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-400',
      toolsCount: 'Verified Math'
    }
  ];

  return (
    <div className="w-full bg-[#080B14] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#6366F1]/15 to-[#06B6D4]/20 blur-[120px] pointer-events-none rounded-full" />

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101625] border border-[#8B5CF6]/30 text-xs text-purple-300 mb-8 shadow-inner animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Unified Enterprise Intelligence — All 7 Studios Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          One Platform. <br />
          <span className="gradient-text">Limitless Possibilities.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          NEXORA AI unites writing, document intelligence, custom chatbots, video storyboards, marketing campaigns, and deterministic business tools into one lightning-fast workspace.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActivePage(user ? 'dashboard' : 'auth')}
            className="px-7 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#06B6D4] text-white hover:opacity-95 shadow-xl shadow-purple-500/25 flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <span>{user ? 'Open Your Workspace' : 'Start Free Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActivePage('explore')}
            className="px-6 py-3.5 rounded-2xl text-sm font-semibold bg-[#101625] border border-[#1E293B] text-slate-200 hover:text-white hover:border-[#8B5CF6]/50 transition-colors flex items-center gap-2"
          >
            <span>Explore All AI Tools</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Global Markets Trust Line */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
            Enterprise Security & RLS
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#06B6D4]" />
            Sub-Second Gemini 3.8 Flash
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            US, UK, CA, AU & EU Ready
          </span>
        </div>

      </section>

      {/* Live Interactive Playground Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#06B6D4]">Live Testing Canvas</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Test NEXORA AI Engine In Real-Time</h3>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-[#080B14] border border-[#1E293B] text-slate-300">
              Model: Gemini 3.8 Flash
            </span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={playPrompt}
                onChange={e => setPlayPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLivePlayground()}
                placeholder="Type any prompt or request (e.g. Write an email to pitch SaaS software)..."
                className="w-full px-4 py-3.5 text-xs sm:text-sm rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6] pr-28"
              />
              <button
                onClick={handleLivePlayground}
                disabled={isPlayTesting}
                className="absolute right-2 top-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#8B5CF6] hover:bg-purple-600 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isPlayTesting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayTesting ? 'Running...' : 'Execute'}</span>
              </button>
            </div>

            {playOutput && (
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#1E293B] animate-in fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E293B] text-xs text-slate-400">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synthesized Output
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(playOutput);
                      showToast('Copied to clipboard!', 'success');
                    }}
                    className="hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {playOutput}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The 7 AI Studios Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1E293B]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">Full Modular Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            The Seven Specialized AI Studios
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Every studio is purpose-built with targeted parameter controls, rigorous guardrails, and persistent workspace storage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                onClick={() => setActivePage(s.id)}
                className="cursor-pointer p-6 rounded-2xl bg-[#101625] border border-[#1E293B] hover:border-[#8B5CF6]/50 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${s.accent} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#080B14] border border-[#1E293B] text-slate-300">
                      {s.toolsCount}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#06B6D4] transition-colors">
                    {s.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-[#1E293B]/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                  <span>Launch Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Target Audiences Persona Section */}
      <section className="py-20 bg-[#080B14] border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#06B6D4]">Engineered For Global Output</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Built For High-Growth Roles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B]">
              <div className="text-sm font-bold text-white mb-2">Founders & Entrepreneurs</div>
              <p className="text-slate-400 leading-relaxed">
                Produce investor business plans, pitch decks, client proposals, and marketing launches in hours instead of weeks.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B]">
              <div className="text-sm font-bold text-white mb-2">Content Creators</div>
              <p className="text-slate-400 leading-relaxed">
                Generate high-retention YouTube scripts, viral Instagram carousels, and visual storyboards with consistent brand tone.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B]">
              <div className="text-sm font-bold text-white mb-2">Freelancers & Consultants</div>
              <p className="text-slate-400 leading-relaxed">
                Draft client quotations with verified math, audit contracts with PDF Q&A, and create customized customer chatbots.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B]">
              <div className="text-sm font-bold text-white mb-2">Small Business Teams</div>
              <p className="text-slate-400 leading-relaxed">
                Pool team credits, deploy customer support widgets on websites, and run multi-platform advertising campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#101625] via-[#131C2D] to-[#101625] border border-[#8B5CF6]/40 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to experience limitless AI possibilities?
            </h2>
            <p className="text-slate-300 text-sm">
              Join thousands of creators and businesses worldwide. Get 50 free daily credits immediately with zero credit card required.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActivePage('auth')}
                className="px-8 py-3.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-purple-500/25 cursor-pointer"
              >
                Create Free Account
              </button>
              <button
                onClick={() => setActivePage('pricing')}
                className="px-6 py-3.5 rounded-2xl text-xs font-bold bg-[#080B14] border border-[#1E293B] text-slate-300 hover:text-white"
              >
                View Plans & Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
