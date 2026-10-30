/**
 * NEXORA AI — Global Footer
 * Includes 7 studios directory, workspace navigation, legal documentation, and live status.
 */

import React from 'react';
import { Logo } from '../common/Logo';
import { ActivePage } from '../../types';
import { Globe2, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-[#1E293B] bg-[#080B14] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" showTagline={true} />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3">
              NEXORA AI is the unified AI workspace engineered for ambitious entrepreneurs, creators, developers, and global enterprise teams.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All AI Systems Operational
              </span>
              <span className="text-[11px] text-slate-500 border border-[#1E293B] px-2 py-1 rounded-full">
                Gemini 3.8 Flash
              </span>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
              <Globe2 className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Target Markets: United States • United Kingdom • Canada • Australia • Europe</span>
            </div>
          </div>

          {/* 7 AI Studios */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">7 AI Studios</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleNav('studio-writing')} className="hover:text-white transition-colors">AI Writing Studio</button></li>
              <li><button onClick={() => handleNav('studio-image')} className="hover:text-white transition-colors">AI Image Studio</button></li>
              <li><button onClick={() => handleNav('studio-video')} className="hover:text-white transition-colors">AI Video Studio</button></li>
              <li><button onClick={() => handleNav('studio-document')} className="hover:text-white transition-colors">AI Document Studio</button></li>
              <li><button onClick={() => handleNav('studio-chatbot')} className="hover:text-white transition-colors">AI Chatbot Studio</button></li>
              <li><button onClick={() => handleNav('studio-marketing')} className="hover:text-white transition-colors">AI Marketing Studio</button></li>
              <li><button onClick={() => handleNav('studio-business')} className="hover:text-white transition-colors">AI Business Assistant</button></li>
            </ul>
          </div>

          {/* Platform & Workspace */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleNav('explore')} className="hover:text-white transition-colors">Explore All Tools</button></li>
              <li><button onClick={() => handleNav('dashboard')} className="hover:text-white transition-colors">User Workspace</button></li>
              <li><button onClick={() => handleNav('pricing')} className="hover:text-white transition-colors">Subscription Plans</button></li>
              <li><button onClick={() => handleNav('projects')} className="hover:text-white transition-colors">Saved Projects</button></li>
              <li><button onClick={() => handleNav('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => handleNav('blog')} className="hover:text-white transition-colors">Productivity Blog</button></li>
              <li><button onClick={() => handleNav('help')} className="hover:text-white transition-colors">Help Center & FAQs</button></li>
              <li><button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">Customer Support</button></li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Legal & Security</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleNav('legal-privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => handleNav('legal-terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => handleNav('legal-cookies')} className="hover:text-white transition-colors">Cookie Policy</button></li>
              <li><button onClick={() => handleNav('legal-refund')} className="hover:text-white transition-colors">Refund Policy</button></li>
              <li><button onClick={() => handleNav('legal-acceptable-use')} className="hover:text-white transition-colors">Acceptable Use Policy</button></li>
              <li><button onClick={() => handleNav('admin')} className="text-amber-400 hover:text-amber-300 transition-colors">Admin Console</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1E293B]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} NEXORA AI Inc. All rights reserved. International SaaS Platform.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Enterprise Grade Encryption & RLS
            </span>
            <span>•</span>
            <span>Zero Data Scraping Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
