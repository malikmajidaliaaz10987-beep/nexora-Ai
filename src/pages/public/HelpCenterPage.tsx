/**
 * NEXORA AI — Help Center & Knowledge Base (Page 14)
 * Searchable FAQs, studio guides, credit rules, and support escalation.
 */

import React, { useState } from 'react';
import { ActivePage } from '../../types';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  PenTool, 
  Coins, 
  ShieldCheck, 
  Bot, 
  FileText,
  Mail
} from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    category: 'Credits & Billing',
    q: 'How does the credit balance system work?',
    a: 'Every generative AI operation deducts a defined credit cost (e.g. 10 credits for short summaries, 25 for deep SEO articles, 30 for high-resolution images). In the event of a model timeout or error, our server-side atomic transaction engine immediately refunds your credits in full.'
  },
  {
    category: 'Credits & Billing',
    q: 'Do unused credits roll over to the next month?',
    a: 'On paid plans (Starter, Pro, Business), credits are replenished every 30 days based on your subscription tier. Free tier credits reset every 24 hours to 50 credits.'
  },
  {
    category: 'The 7 AI Studios',
    q: 'How does Chat with PDF protect private documents?',
    a: 'When you upload or paste document text, it is processed strictly within your isolated session memory and stored only in your private database with Row Level Security. We never sell, scrape, or use private document text to train public AI models.'
  },
  {
    category: 'The 7 AI Studios',
    q: 'Can I embed my custom chatbot on WordPress, Shopify, or React?',
    a: 'Yes! The AI Chatbot Studio generates a standard asynchronous JavaScript widget snippet. Simply paste the <script> tag before the closing </body> tag of your website.'
  },
  {
    category: 'Security & Enterprise',
    q: 'What model powers NEXORA AI?',
    a: 'Our primary intelligence pipeline is powered by Google Gemini 3.8 Flash, delivering sub-second response times, extensive context windows, and high analytical precision.'
  },
  {
    category: 'Security & Enterprise',
    q: 'What is your refund policy?',
    a: 'We offer an unconditional 14-day money-back guarantee for all new subscriptions. Simply contact support via our Contact page or email support@nexora.ai.'
  }
];

export const HelpCenterPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'Credits & Billing', 'The 7 AI Studios', 'Security & Enterprise'];

  const filtered = FAQS.filter(f => {
    const matchesCat = selectedCat === 'All' || f.category === selectedCat;
    const matchesSearch = f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101625] border border-[#1E293B] text-xs font-semibold text-[#06B6D4] mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Documentation & FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">How can we help?</h1>
        <p className="text-slate-400 text-sm mt-3">
          Find instant answers to questions regarding studio workflows, credit balances, chatbot widgets, and account management.
        </p>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search FAQs (e.g. credits, refund, chatbot embed, SLA)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#101625] border border-[#1E293B] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCat === cat
                ? 'bg-[#8B5CF6] text-white shadow-md'
                : 'bg-[#101625] border border-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-3 mb-16">
        {filtered.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={i}
              className="rounded-2xl bg-[#101625] border border-[#1E293B] overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-[#06B6D4] transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-[#8B5CF6] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-[#1E293B]/60 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help callout */}
      <div className="p-8 rounded-3xl bg-[#101625] border border-[#1E293B] text-center max-w-xl mx-auto space-y-3 shadow-xl">
        <Mail className="w-7 h-7 text-[#8B5CF6] mx-auto" />
        <h3 className="text-base font-bold text-white">Still have questions?</h3>
        <p className="text-xs text-slate-400">
          Our customer engineering team is available 24/7 to help you with integrations, workspace setup, or billing questions.
        </p>
        <button
          onClick={() => setActivePage('contact')}
          className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#131C2D] border border-purple-500/30 text-purple-300 hover:bg-purple-950/20"
        >
          Open Support Ticket →
        </button>
      </div>

    </div>
  );
};
