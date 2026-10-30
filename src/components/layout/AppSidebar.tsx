/**
 * NEXORA AI — Authenticated App Sidebar
 * Collapsible, responsive sidebar navigation for Dashboard & Studio workspaces.
 */

import React from 'react';
import { ActivePage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  PenTool, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Bot, 
  Megaphone, 
  Briefcase, 
  FolderKanban, 
  Coins, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AppSidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  collapsed?: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activePage, setActivePage }) => {
  const { user, credits } = useAuth();

  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Overview', icon: LayoutDashboard, group: 'main' },
    
    // The 7 AI Studios
    { id: 'studio-writing' as ActivePage, label: 'AI Writing', icon: PenTool, group: 'studios', badge: '18 Tools' },
    { id: 'studio-image' as ActivePage, label: 'AI Image', icon: ImageIcon, group: 'studios' },
    { id: 'studio-video' as ActivePage, label: 'AI Video', icon: Video, group: 'studios' },
    { id: 'studio-document' as ActivePage, label: 'AI Documents', icon: FileText, group: 'studios' },
    { id: 'studio-chatbot' as ActivePage, label: 'AI Chatbots', icon: Bot, group: 'studios' },
    { id: 'studio-marketing' as ActivePage, label: 'AI Marketing', icon: Megaphone, group: 'studios' },
    { id: 'studio-business' as ActivePage, label: 'AI Business', icon: Briefcase, group: 'studios' },

    // Workspace & Management
    { id: 'projects' as ActivePage, label: 'Projects & Files', icon: FolderKanban, group: 'workspace' },
    { id: 'billing' as ActivePage, label: 'Credits & Billing', icon: CreditCard, group: 'workspace' },
    { id: 'settings' as ActivePage, label: 'Account Settings', icon: Settings, group: 'workspace' },
    { id: 'help' as ActivePage, label: 'Help & Support', icon: HelpCircle, group: 'workspace' },
  ];

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="w-64 shrink-0 bg-[#080B14] border-r border-[#1E293B] flex flex-col justify-between p-3.5 hidden md:flex min-h-[calc(100vh-4rem)]">
      
      <div className="space-y-6">
        
        {/* Workspace Mini Profile */}
        <div className="p-3 rounded-2xl bg-[#101625] border border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
              alt="Avatar"
              className="w-8 h-8 rounded-lg object-cover border border-[#1E293B] shrink-0"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{user?.fullName || 'Asad Ali Awan'}</div>
              <div className="text-[10px] text-[#8B5CF6] font-semibold truncate">
                {user?.company || 'NEXORA AI'} • {user?.role === 'admin' ? 'Admin' : 'Member'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => handleNav('settings')}
            className="p-1 rounded-lg hover:bg-[#131C2D] text-slate-400 hover:text-white"
            title="Edit Profile"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Credit Meter Widget */}
        <div 
          onClick={() => handleNav('billing')}
          className="cursor-pointer p-3 rounded-2xl bg-gradient-to-br from-[#131C2D] to-[#101625] border border-[#8B5CF6]/30 hover:border-[#8B5CF6] transition-all group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-[#06B6D4]" />
              AI Credits
            </span>
            <span className="text-white font-bold">{credits?.balance ?? 0}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#080B14] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, ((credits?.balance ?? 0) / (credits?.monthly_limit || 2500)) * 100))}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
            <span>Daily: {credits?.used_today ?? 0} used</span>
            <span className="text-[#8B5CF6] font-semibold group-hover:underline flex items-center">
              Top up <ChevronRight className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          
          {/* Main Overview */}
          <div>
            <button
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activePage === 'dashboard'
                  ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#06B6D4]/10 text-white border border-[#8B5CF6]/40 shadow-sm'
                  : 'text-slate-300 hover:bg-[#131C2D] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#8B5CF6]" />
              <span>Workspace Overview</span>
            </button>
          </div>

          {/* 7 AI Studios Section */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              The 7 AI Studios
            </div>
            {navItems.filter(i => i.group === 'studios').map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#131C2D] text-white border-l-2 border-[#8B5CF6] font-semibold'
                      : 'text-slate-300 hover:bg-[#101625] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#06B6D4]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#8B5CF6]/20 text-purple-300 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Management */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace & Plans
            </div>
            {navItems.filter(i => i.group === 'workspace').map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#131C2D] text-white border-l-2 border-[#06B6D4] font-semibold'
                      : 'text-slate-300 hover:bg-[#101625] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#06B6D4]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Admin Quick Entry if Admin */}
      {user?.role === 'admin' && (
        <div className="pt-3 border-t border-[#1E293B]">
          <button
            onClick={() => handleNav('admin')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePage === 'admin'
                ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                : 'text-amber-400/90 hover:bg-amber-950/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin Dashboard</span>
          </button>
        </div>
      )}

    </aside>
  );
};
