/**
 * NEXORA AI — Sign In & Registration (Page 15)
 * Dual-tab authentication with credentials validation and instant demo role switcher.
 */

import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { ActivePage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  Coins,
  CheckCircle2
} from 'lucide-react';

export const AuthPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const { login, register, initMainAccount } = useAuth();
  const { showToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          showToast('Please fill out all fields.', 'error');
          setIsSubmitting(false);
          return;
        }
        const res = await register(fullName, email, password);
        if (res.success) {
          showToast('Account created successfully! Welcome to NEXORA AI.', 'success');
          setActivePage('dashboard');
        } else {
          showToast(res.error || 'Registration failed', 'error');
        }
      } else {
        if (!email.trim() || !password.trim()) {
          showToast('Please enter both email and password.', 'error');
          setIsSubmitting(false);
          return;
        }
        const res = await login(email, password);
        if (res.success) {
          showToast('Welcome back!', 'success');
          setActivePage('dashboard');
        } else {
          showToast(res.error || 'Invalid credentials', 'error');
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Authentication error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMainAccountSignIn = async () => {
    setIsSubmitting(true);
    await initMainAccount();
    showToast('Signed in as Platform Owner (Asad Ali Awan)!', 'success');
    setActivePage('dashboard');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {isRegister ? 'Create Your NEXORA Workspace' : 'Sign in to your account'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister 
              ? 'Get 50 daily credits immediately. No credit card required.'
              : 'Access your 7 AI studios, projects, and custom chatbots.'}
          </p>
        </div>

        {/* Platform Owner Fast Access */}
        <div className="p-4 rounded-2xl bg-[#101625] border border-[#1E293B] space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>Platform Owner Session</span>
            <span className="text-amber-400 font-bold">Admin • Pro Plan</span>
          </div>
          <button
            type="button"
            onClick={handleMainAccountSignIn}
            disabled={isSubmitting}
            className="w-full p-2.5 rounded-xl bg-[#131C2D] border border-amber-500/40 text-amber-300 font-semibold hover:bg-amber-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Sign In as Platform Owner (Asad Ali Awan)</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-2xl space-y-5">
          
          {/* Tabs */}
          <div className="flex rounded-xl bg-[#080B14] p-1 border border-[#1E293B] text-xs">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                !isRegister ? 'bg-[#131C2D] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                isRegister ? 'bg-[#131C2D] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Free
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Asad Ali Awan"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : isRegister ? 'Create Account & Get 50 Credits' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
