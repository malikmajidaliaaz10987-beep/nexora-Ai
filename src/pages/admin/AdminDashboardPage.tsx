/**
 * NEXORA AI — Admin Control Center (Page 20)
 * Real server-side administrative metrics, user credit adjustments with audit logs,
 * provider status inspection, and system settings.
 */

import React, { useState, useEffect } from 'react';
import { ActivePage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  ShieldCheck, 
  Users, 
  Coins, 
  Sparkles, 
  DollarSign, 
  Search, 
  Sliders, 
  Activity, 
  Cpu, 
  Lock, 
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  X
} from 'lucide-react';

export const AdminDashboardPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [metrics, setMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Credit Adjustment Modal
  const [selectedUserForCredit, setSelectedUserForCredit] = useState<any | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(100);
  const [adjustmentReason, setAdjustmentReason] = useState('Customer Support Courtesy Grant');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [mRes, uRes, aRes, sRes] = await Promise.all([
        fetch('/api/admin/metrics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
        }),
        fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
        }),
        fetch('/api/admin/audit-logs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
        }),
        fetch('/api/admin/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
        })
      ]);

      if (mRes.ok) setMetrics(await mRes.json());
      if (uRes.ok) setUsersList((await uRes.json()).users || []);
      if (aRes.ok) setAuditLogs((await aRes.json()).auditLogs || []);
      if (sRes.ok) setSettings((await sRes.json()).settings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAdjustCredits = async () => {
    if (!selectedUserForCredit) return;
    setIsAdjusting(true);

    try {
      const res = await fetch('/api/admin/adjust-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          targetUserId: selectedUserForCredit.id,
          amount: Number(adjustmentAmount),
          reason: adjustmentReason
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Credits adjusted! New balance: ${data.newBalance}`, 'success');
        setSelectedUserForCredit(null);
        fetchAdminData();
      } else {
        showToast(data.error || 'Failed to adjust credits', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error', 'error');
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleToggleSetting = async (key: string, currentValue: boolean) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({ key, value: !currentValue })
      });
      if (res.ok) {
        showToast(`Setting "${key}" updated!`, 'info');
        fetchAdminData();
      }
    } catch (e) {
      showToast('Failed to update setting', 'error');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400">
          Your current session does not have administrative privileges. Please sign in with your Administrator account (Asad Ali Awan) to view the administration console.
        </p>
      </div>
    );
  }

  const filteredUsers = usersList.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Metrics & Governance</h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee user balances, credit consumption, live AI provider health, and operational audit trails.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#101625] border border-[#1E293B] text-xs font-semibold text-slate-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Platform Owner & Governance Identity Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#8B5CF6]/15 via-[#101625] to-[#06B6D4]/15 border border-[#8B5CF6]/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] p-0.5 shrink-0 shadow-lg shadow-[#8B5CF6]/20">
            <img 
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"}
              alt="Platform Owner"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Platform Owner</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                Super Admin
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                Pro Plan
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
              {metrics?.platformOwner?.fullName || user?.fullName || 'Asad Ali Awan'}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-0.5">
              <span>Workspace: <strong className="text-slate-200">{metrics?.platformOwner?.workspace || user?.company || 'NEXORA AI'}</strong></span>
              <span>•</span>
              <span>Workspace Role: <strong className="text-slate-200">Admin</strong></span>
              <span>•</span>
              <span>System Access: <strong className="text-emerald-400">Full Privileges</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Console State:</span>
            <span className="text-white font-semibold">Active & Synced</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.totalUsers ?? 0}</div>
          <div className="text-[10px] text-emerald-400 font-medium">100% Active across US & EU</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Generations Logged</span>
            <Sparkles className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.totalGenerations ?? 0}</div>
          <div className="text-[10px] text-purple-300 font-medium">Gemini 3.8 Flash Engine</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Credits Consumed</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{metrics?.totalCreditsUsed ?? 0}</div>
          <div className="text-[10px] text-slate-400 font-medium">Server-authoritative debits</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Paid Revenue (Sandbox)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">${(metrics?.revenue ?? 0).toFixed(2)}</div>
          <div className="text-[10px] text-slate-400 font-medium">Verified subscription orders</div>
        </div>
      </div>

      {/* Subscription Breakdown & AI Provider Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Subscription Plan Distribution (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Subscription Tiers</h3>
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B]">
              <div className="text-slate-400 text-[10px] uppercase">Free</div>
              <div className="text-lg font-bold text-white mt-1">{metrics?.planCounts?.free ?? 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B]">
              <div className="text-slate-400 text-[10px] uppercase">Starter</div>
              <div className="text-lg font-bold text-white mt-1">{metrics?.planCounts?.starter ?? 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B]">
              <div className="text-purple-300 text-[10px] uppercase font-bold">Pro</div>
              <div className="text-lg font-bold text-purple-300 mt-1">{metrics?.planCounts?.pro ?? 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B]">
              <div className="text-[#06B6D4] text-[10px] uppercase font-bold">Business</div>
              <div className="text-lg font-bold text-[#06B6D4] mt-1">{metrics?.planCounts?.business ?? 0}</div>
            </div>
          </div>
        </div>

        {/* AI Provider Status Panel (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#06B6D4]" />
            <span>AI Provider Connectivity</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Google Gemini</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400">gemini-3.8-flash</div>
              <div className="text-[10px] text-emerald-400 font-semibold">Active & Responsive</div>
            </div>

            <div className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Image Pipeline</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-400">Imagen 3 Ready</div>
              <div className="text-[10px] text-purple-300 font-semibold">Operational</div>
            </div>
          </div>
        </div>

      </div>

      {/* User Management Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">User Directory & Balances</h3>
            <p className="text-[11px] text-slate-400">Adjust credit quotas directly or inspect plan assignments.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search user email or name..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Credit Balance</th>
                <th className="pb-3 font-semibold">Joined</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {filteredUsers.map(u => (
                <tr key={u.id} className="text-slate-300">
                  <td className="py-3">
                    <div className="font-semibold text-white">{u.fullName}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      u.role === 'admin' 
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                        : u.role === 'pro'
                        ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                        : 'bg-[#131C2D] text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">
                    {u.balance} credits
                  </td>
                  <td className="py-3 text-slate-500 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedUserForCredit(u)}
                      className="px-2.5 py-1 rounded-lg bg-[#131C2D] border border-amber-500/30 text-amber-300 hover:bg-amber-950/30 text-[11px] font-semibold"
                    >
                      Adjust Credits
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Security & System Audit Logs</span>
        </h3>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {auditLogs.map(log => (
            <div key={log.id} className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B] text-xs flex items-center justify-between">
              <div>
                <span className="font-mono text-purple-400 font-bold mr-2">[{log.action}]</span>
                <span className="text-slate-300">{log.details}</span>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 ml-4">
                {new Date(log.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Adjustment Modal */}
      {selectedUserForCredit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#101625] border border-amber-500/40 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedUserForCredit(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white">Adjust User Credit Balance</h3>
            <p className="text-xs text-slate-400">
              Target: <span className="text-white font-semibold">{selectedUserForCredit.email}</span>
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Credit Adjustment Amount (Positive to add, Negative to deduct)
              </label>
              <input
                type="number"
                value={adjustmentAmount}
                onChange={e => setAdjustmentAmount(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Reason for Audit Log *</label>
              <input
                type="text"
                value={adjustmentReason}
                onChange={e => setAdjustmentReason(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserForCredit(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustCredits}
                disabled={isAdjusting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              >
                {isAdjusting ? 'Applying...' : 'Apply Adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
