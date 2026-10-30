/**
 * NEXORA AI — Account Settings (Page 19)
 * Profile management, API key issuance, notification preferences, and danger zone.
 */

import React, { useState } from 'react';
import { ActivePage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  User as UserIcon, 
  Key, 
  Lock, 
  Bell, 
  Trash2, 
  Save, 
  ShieldAlert, 
  Copy, 
  CheckCircle2,
  Check
} from 'lucide-react';

export const SettingsPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const { user, updateUserProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || 'Asad Ali Awan');
  const [company, setCompany] = useState(user?.company || 'NEXORA AI');
  const [bio, setBio] = useState(user?.bio || 'Founder and Platform Architect at NEXORA AI.');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when user updates
  React.useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.company) setCompany(user.company);
      if (user.bio !== undefined) setBio(user.bio);
    }
  }, [user]);

  // API Key state
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Primary Studio Integration', prefix: 'nex_live_9a8bc7...', createdAt: '2026-10-30' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateUserProfile({ fullName, company, bio });
      if (res.success) {
        showToast('Profile updated and saved to database successfully!', 'success');
      } else {
        showToast(res.error || 'Failed to update profile', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Network error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateApiKey = () => {
    if (!newKeyName.trim()) {
      showToast('Please enter an API key label.', 'error');
      return;
    }
    const secret = 'nex_live_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newEntry = {
      id: 'key_' + Date.now(),
      name: newKeyName,
      prefix: secret.slice(0, 14) + '...',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setApiKeys(prev => [newEntry, ...prev]);
    setGeneratedSecret(secret);
    setNewKeyName('');
    showToast('New API key generated! Store it securely.', 'success');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('WARNING: Are you sure you want to permanently delete your NEXORA AI account? All credits, projects, and custom chatbots will be deleted irreversibly.')) return;

    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
      });
      if (res.ok) {
        showToast('Account deleted successfully.', 'info');
        logout();
        setActivePage('home');
      }
    } catch (e) {
      showToast('Failed to delete account', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, issuance of developer API keys, and privacy settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-[#8B5CF6]" />
          <span>Profile Information</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Company / Workspace Name</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. NEXORA AI"
                className="w-full p-2.5 rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Workspace Role & Plan</label>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#080B14] border border-[#1E293B] text-xs">
                <span className="font-semibold text-white">
                  {user?.role === 'admin' ? 'Admin' : 'Member'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[#8B5CF6] font-semibold">Pro Plan</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell us about how you use NEXORA AI..."
              className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Developer API Keys */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-[#06B6D4]" />
            <span>Developer API Keys</span>
          </h2>
          <span className="text-[11px] text-slate-400">Mobile & External Access</span>
        </div>

        <p className="text-xs text-slate-400">
          API keys allow programmatic access to NEXORA AI studios from your React Native / Flutter mobile applications or external webhooks.
        </p>

        {/* Generate New Key Form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            placeholder="Key Name (e.g. Mobile iOS App, Production Bot)"
            className="flex-1 p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#06B6D4]"
          />
          <button
            onClick={handleGenerateApiKey}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#131C2D] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/20"
          >
            Generate Key
          </button>
        </div>

        {/* Revealed Secret Banner */}
        {generatedSecret && (
          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 space-y-1.5">
            <div className="font-bold flex items-center justify-between">
              <span>Your New Secret Key:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedSecret);
                  showToast('Copied secret API key!', 'success');
                }}
                className="text-white hover:underline flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
            <code className="block p-2 rounded bg-black/60 font-mono text-[11px] break-all select-all text-emerald-300">
              {generatedSecret}
            </code>
            <p className="text-[10px] text-slate-400">Please copy this key now. For your security, it will not be displayed again.</p>
          </div>
        )}

        {/* Keys Table */}
        <div className="space-y-2">
          {apiKeys.map(k => (
            <div key={k.id} className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B] flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">{k.name}</div>
                <div className="font-mono text-slate-500 text-[11px]">{k.prefix}</div>
              </div>
              <span className="text-[10px] text-slate-500">Created: {k.createdAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/15 border border-rose-500/30 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Danger Zone</span>
        </h2>
        <p className="text-xs text-slate-400">
          Permanently delete your profile, credit balance, stored projects, and custom chatbots. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
        >
          Permanently Delete Account
        </button>
      </div>

    </div>
  );
};
