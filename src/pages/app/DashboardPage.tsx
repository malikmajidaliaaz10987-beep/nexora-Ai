/**
 * NEXORA AI — User Workspace Dashboard (Page 16)
 * Command center with credit meter, studio launchers, recent generations,
 * project summaries, and notifications.
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, Project } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Sparkles, 
  Coins, 
  PenTool, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Bot, 
  Megaphone, 
  Briefcase, 
  FolderKanban, 
  CreditCard, 
  ArrowRight, 
  Clock, 
  Bell, 
  TrendingUp, 
  Zap,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  setActivePage: (p: ActivePage) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ setActivePage }) => {
  const { user, credits, subscription, plan } = useAuth();
  const { showToast } = useToast();

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Load projects
    fetch('/api/projects', {
      headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.projects) setRecentProjects(data.projects.slice(0, 3));
      })
      .catch(() => {});

    // Load user notifications
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const studioCards = [
    { id: 'studio-writing' as ActivePage, name: 'AI Writing', desc: '18 tools for blogs, SEO, and scripts', icon: PenTool, color: 'text-violet-400', border: 'border-violet-500/30' },
    { id: 'studio-document' as ActivePage, name: 'AI Documents', desc: 'Chat with PDF, extract and summarize', icon: FileText, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { id: 'studio-chatbot' as ActivePage, name: 'AI Chatbots', desc: 'Deploy custom bots & embed widgets', icon: Bot, color: 'text-pink-400', border: 'border-pink-500/30' },
    { id: 'studio-business' as ActivePage, name: 'AI Business', desc: 'Deterministic invoices, quotes, plans', icon: Briefcase, color: 'text-purple-400', border: 'border-purple-500/30' },
    { id: 'studio-marketing' as ActivePage, name: 'AI Marketing', desc: 'Campaign roadmaps & ad variants', icon: Megaphone, color: 'text-blue-400', border: 'border-blue-500/30' },
    { id: 'studio-image' as ActivePage, name: 'AI Image', desc: 'Photorealistic synthesis & assets', icon: ImageIcon, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { id: 'studio-video' as ActivePage, name: 'AI Video', desc: 'Shorts & Reels scene storyboards', icon: Video, color: 'text-amber-400', border: 'border-amber-500/30' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101625] via-[#131C2D] to-[#101625] border border-[#8B5CF6]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#06B6D4]">NEXORA AI Workspace</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-purple-300 font-bold uppercase">
              {user?.role || 'Free'} Tier
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.fullName || 'Creator'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All 7 AI studios are synchronized and ready. Select a studio below to generate content, analyze documents, or craft custom chatbots.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActivePage('studio-writing')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Writing Studio</span>
          </button>
          <button
            onClick={() => setActivePage('projects')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#080B14] border border-[#1E293B] text-slate-300 hover:text-white"
          >
            <span>View Projects</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Credit Gauge Card */}
        <div 
          onClick={() => setActivePage('billing')}
          className="cursor-pointer p-5 rounded-2xl bg-[#101625] border border-[#1E293B] hover:border-[#8B5CF6]/50 transition-all shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Available Credits</span>
            <Coins className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {credits?.balance ?? 0} <span className="text-xs text-slate-400 font-normal">credits</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#080B14] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]"
              style={{ width: `${Math.min(100, Math.max(10, ((credits?.balance ?? 0) / (credits?.monthly_limit || 2500)) * 100))}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between">
            <span>Used today: {credits?.used_today ?? 0}</span>
            <span className="text-[#8B5CF6] font-semibold hover:underline">Manage credits →</span>
          </div>
        </div>

        {/* Subscription Plan Card */}
        <div 
          onClick={() => setActivePage('billing')}
          className="cursor-pointer p-5 rounded-2xl bg-[#101625] border border-[#1E293B] hover:border-[#06B6D4]/50 transition-all shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active Subscription</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-white capitalize">
            {plan?.name || `${user?.role || 'Free'} Plan`}
          </div>
          <div className="text-[11px] text-slate-400">
            Status: <span className="text-emerald-400 font-semibold">Active & Renews Monthly</span>
          </div>
          <div className="text-[10px] text-[#06B6D4] font-semibold">
            Change or upgrade plan →
          </div>
        </div>

        {/* Active Model */}
        <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">AI Compute Engine</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-extrabold text-white">
            Gemini 3.8 Flash
          </div>
          <div className="text-[11px] text-slate-400">
            Latency: <span className="text-purple-300 font-mono font-semibold">Sub-second</span>
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Fully operational
          </div>
        </div>

        {/* Saved Projects */}
        <div 
          onClick={() => setActivePage('projects')}
          className="cursor-pointer p-5 rounded-2xl bg-[#101625] border border-[#1E293B] hover:border-purple-500/40 transition-all shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Workspace Projects</span>
            <FolderKanban className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {recentProjects.length} <span className="text-xs text-slate-400 font-normal">active</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Organize outputs & markdown files
          </div>
          <div className="text-[10px] text-purple-400 font-semibold">
            Open workspace files →
          </div>
        </div>

      </div>

      {/* The 7 AI Studios Launcher Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">The 7 AI Studios</h2>
          <button
            onClick={() => setActivePage('explore')}
            className="text-xs text-[#06B6D4] font-semibold hover:underline"
          >
            Explore all tools →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studioCards.map(s => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                onClick={() => setActivePage(s.id)}
                className={`cursor-pointer p-5 rounded-2xl bg-[#101625] border ${s.border} hover:bg-[#131C2D] transition-all group flex flex-col justify-between shadow-lg`}
              >
                <div>
                  <div className={`p-2.5 rounded-xl bg-[#080B14] ${s.color} w-fit mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#06B6D4] transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Dual Grid: Recent Projects & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Projects (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Workspace Projects</h3>
            <button
              onClick={() => setActivePage('projects')}
              className="text-xs text-[#8B5CF6] font-semibold hover:underline"
            >
              View all
            </button>
          </div>

          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map(p => (
                <div
                  key={p.id}
                  onClick={() => setActivePage('projects')}
                  className="cursor-pointer p-4 rounded-xl bg-[#080B14] border border-[#1E293B] hover:border-slate-600 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{p.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</div>
                  </div>
                  <span className="text-[10px] text-purple-300 px-2 py-0.5 rounded bg-[#131C2D] border border-purple-500/20">
                    {p.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No saved projects yet. Generate content in any studio and click "Save Project".
            </div>
          )}
        </div>

        {/* System Notifications (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Workspace Notifications</span>
            </h3>
            <span className="text-[10px] text-emerald-400">Live</span>
          </div>

          <div className="space-y-2.5">
            {notifications.length > 0 ? (
              notifications.map((n: any) => (
                <div key={n.id} className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B] text-xs space-y-1">
                  <div className="font-semibold text-white">{n.title}</div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">{n.message}</div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                All caught up. No unread notifications.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
