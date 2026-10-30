/**
 * NEXORA AI — About Us (Page 11)
 * Mission, architectural philosophy, international presence, and team.
 */

import React from 'react';
import { ActivePage } from '../../types';
import { Logo } from '../../components/common/Logo';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  Server, 
  Users, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101625] border border-[#1E293B] text-xs font-semibold text-[#8B5CF6] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Our Vision & Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Unifying Human Creativity with Autonomous Intelligence
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
          NEXORA AI was founded to eliminate the chaos of subscription sprawl and fragmented tools by engineering one singular, high-performance workspace for entrepreneurs and creators worldwide.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[#8B5CF6] flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Sub-Second Execution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            By leveraging Gemini 3.8 Flash with server-authoritative streaming pipelines, NEXORA AI generates complex multi-page articles and documents in seconds.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#06B6D4] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Data Scraping Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your proprietary documents, financial models, and customer chatbots are protected with strict Row Level Security (RLS). We never train public foundation models on private user content.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Deterministic Financial Rigor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We reject the idea that AI should hallucinate business invoices or quotations. NEXORA pairs verified deterministic mathematical algorithms with generative executive summaries.
          </p>
        </div>
      </div>

      {/* International Markets */}
      <div className="p-8 rounded-3xl bg-[#101625] border border-[#1E293B] mb-20 shadow-xl">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Globe2 className="w-8 h-8 text-[#06B6D4] mx-auto" />
          <h2 className="text-2xl font-bold text-white">Global Target Markets & Regional Compliance</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Engineered from day one for international compliance across the United States, United Kingdom, Canada, Australia, and the European Union, with future localized language pipelines.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {['United States', 'United Kingdom', 'Canada', 'Australia', 'European Union', 'Global English'].map(m => (
              <span key={m} className="px-3 py-1 rounded-full bg-[#080B14] border border-[#1E293B] text-xs text-slate-300 font-medium">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Experience the next generation of productivity</h3>
        <button
          onClick={() => setActivePage('pricing')}
          className="px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-purple-500/20 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Explore Workspace Plans</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
