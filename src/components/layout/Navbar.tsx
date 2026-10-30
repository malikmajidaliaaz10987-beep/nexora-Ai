/**
 * NEXORA AI — Top Navigation Bar
 * Responsive, dark cinematic glassmorphism header with role switcher, credit meter, and studio links.
 */

import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { ActivePage } from '../../types';
import { 
  Sparkles, 
  ChevronDown, 
  Coins, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  FolderKanban, 
  CreditCard, 
  Settings, 
  ShieldCheck, 
  Menu, 
  X,
  PenTool,
  Image as ImageIcon,
  Video,
  FileText,
  Bot,
  Megaphone,
  Briefcase,
  Compass,
  DollarSign
} from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { user, credits, logout } = useAuth();
  const [studiosOpen, setStudiosOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const studios = [
    { id: 'studio-writing' as ActivePage, name: 'AI Writing Studio', desc: '18+ modes: SEO, blogs, emails, scripts', icon: PenTool, color: 'text-violet-400' },
    { id: 'studio-image' as ActivePage, name: 'AI Image Studio', desc: 'Text-to-image, variations & backgrounds', icon: ImageIcon, color: 'text-cyan-400' },
    { id: 'studio-video' as ActivePage, name: 'AI Video Studio', desc: 'Scripts, Reels/Shorts planner & voiceover', icon: Video, color: 'text-amber-400' },
    { id: 'studio-document' as ActivePage, name: 'AI Document Studio', desc: 'PDF Q&A, text extraction & resume builder', icon: FileText, color: 'text-emerald-400' },
    { id: 'studio-chatbot' as ActivePage, name: 'AI Chatbot Studio', desc: 'Custom bot builder & embed widget', icon: Bot, color: 'text-pink-400' },
    { id: 'studio-marketing' as ActivePage, name: 'AI Marketing Studio', desc: 'Campaign planner, ad copy & brand voice', icon: Megaphone, color: 'text-blue-400' },
    { id: 'studio-business' as ActivePage, name: 'AI Business Assistant', desc: 'Deterministic invoices, quotes & task plans', icon: Briefcase, color: 'text-purple-400' },
  ];

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setStudiosOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B]/80 bg-[#080B14]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavigate('home')}
          className="cursor-pointer group flex items-center"
        >
          <Logo size="md" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavigate('home')}
            className={`transition-colors hover:text-white ${activePage === 'home' ? 'text-[#8B5CF6] font-semibold' : ''}`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavigate('explore')}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${activePage === 'explore' ? 'text-[#8B5CF6] font-semibold' : ''}`}
          >
            <Compass className="w-4 h-4 text-[#06B6D4]" />
            Explore Tools
          </button>

          {/* Studios Mega Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStudiosOpen(!studiosOpen)}
              onMouseEnter={() => setStudiosOpen(true)}
              className={`flex items-center gap-1 transition-colors hover:text-white ${
                activePage.startsWith('studio-') ? 'text-[#8B5CF6] font-semibold' : ''
              }`}
            >
              <span>7 AI Studios</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {studiosOpen && (
              <div 
                onMouseLeave={() => setStudiosOpen(false)}
                className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                  Production AI Workspace
                </div>
                <div className="space-y-0.5">
                  {studios.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleNavigate(s.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all text-left hover:bg-[#131C2D] ${
                          activePage === s.id ? 'bg-[#131C2D] border-l-2 border-[#8B5CF6]' : ''
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg bg-[#080B14] ${s.color} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{s.name}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{s.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavigate('pricing')}
            className={`transition-colors hover:text-white ${activePage === 'pricing' ? 'text-[#8B5CF6] font-semibold' : ''}`}
          >
            Pricing
          </button>

          <button
            onClick={() => handleNavigate('about')}
            className={`transition-colors hover:text-white ${activePage === 'about' ? 'text-[#8B5CF6] font-semibold' : ''}`}
          >
            About
          </button>

          <button
            onClick={() => handleNavigate('blog')}
            className={`transition-colors hover:text-white ${activePage === 'blog' ? 'text-[#8B5CF6] font-semibold' : ''}`}
          >
            Blog
          </button>

          <button
            onClick={() => handleNavigate('help')}
            className={`transition-colors hover:text-white ${activePage === 'help' ? 'text-[#8B5CF6] font-semibold' : ''}`}
          >
            Help
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          
          {/* Dynamic User & Workspace Identity Badge */}
          {user && (
            <div 
              onClick={() => handleNavigate('settings')}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131C2D] border border-[#1E293B] text-xs hover:border-[#8B5CF6]/50 transition-colors"
              title="Click to view and edit account profile"
            >
              <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-amber-400' : 'bg-[#8B5CF6]'}`} />
              <span className="font-semibold text-white truncate max-w-[130px]">{user.fullName}</span>
              <span className="text-[10px] text-slate-400 hidden md:inline">({user.company || 'NEXORA AI'})</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                user.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}>
                {user.role === 'admin' ? 'Admin' : 'Member'} • Pro Plan
              </span>
            </div>
          )}

          {/* User Credits Pill */}
          {user && (
            <div 
              onClick={() => handleNavigate('billing')}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/15 to-[#06B6D4]/15 border border-[#8B5CF6]/30 text-xs font-semibold text-white hover:border-[#8B5CF6] transition-all"
              title="Click to view billing & credit reload"
            >
              <Coins className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>{credits?.balance ?? 0}</span>
              <span className="text-[10px] text-slate-400 hidden md:inline">credits</span>
            </div>
          )}

          {/* User Avatar & Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#131C2D] transition-colors"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-lg object-cover border border-[#1E293B]"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div 
                  onMouseLeave={() => setUserMenuOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-2xl p-2 z-50 animate-in fade-in"
                >
                  <div className="px-3 py-2 border-b border-[#1E293B]/60 mb-1">
                    <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-[#131C2D]"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Workspace Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('projects')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-[#131C2D]"
                  >
                    <FolderKanban className="w-4 h-4 text-[#06B6D4]" />
                    <span>Projects & Files</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('billing')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-[#131C2D]"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Billing & Credits</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('settings')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-[#131C2D]"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleNavigate('admin')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-950/30"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Admin Control Panel</span>
                    </button>
                  )}

                  <div className="border-t border-[#1E293B]/60 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); handleNavigate('auth'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavigate('auth')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#131C2D] border border-[#1E293B] text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#1E293B] bg-[#080B14] p-4 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => handleNavigate('home')} className="p-2.5 text-left rounded-lg bg-[#101625] text-slate-200">Home</button>
            <button onClick={() => handleNavigate('explore')} className="p-2.5 text-left rounded-lg bg-[#101625] text-slate-200">Explore Tools</button>
            <button onClick={() => handleNavigate('dashboard')} className="p-2.5 text-left rounded-lg bg-[#101625] text-slate-200">Dashboard</button>
            <button onClick={() => handleNavigate('pricing')} className="p-2.5 text-left rounded-lg bg-[#101625] text-slate-200">Pricing</button>
            <button onClick={() => handleNavigate('about')} className="p-2.5 text-left rounded-lg bg-[#101625] text-slate-200">About</button>
            <button onClick={() => handleNavigate('blog')} className="p-2.5 text-left rounded-lg bg-[#101625] text-slate-200">Blog</button>
            <button onClick={() => handleNavigate('help')} className="p-2.5 text-left rounded-lg bg-[#101625] text-slate-200">Help Center</button>
            <button onClick={() => handleNavigate('contact')} className="p-2.5 text-left rounded-lg bg-[#101625] text-slate-200">Contact</button>
          </div>

          <div className="pt-2 border-t border-[#1E293B]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">The 7 AI Studios</p>
            <div className="grid grid-cols-1 gap-1">
              {studios.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleNavigate(s.id)}
                  className="flex items-center gap-2.5 p-2 rounded-lg text-xs text-left text-slate-300 hover:bg-[#131C2D]"
                >
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
