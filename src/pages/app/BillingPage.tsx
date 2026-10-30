/**
 * NEXORA AI — Billing & Subscription Management (Page 18)
 * Real server-side credit balance status, transaction history,
 * invoice records, and cancellation controls.
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, CreditTransaction, Invoice } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  CreditCard, 
  Coins, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  AlertTriangle, 
  RotateCw,
  Receipt
} from 'lucide-react';

export const BillingPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const { user, credits, subscription, plan, refreshProfile, refreshCredits } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  const fetchBillingData = async () => {
    try {
      const [txRes, subRes] = await Promise.all([
        fetch('/api/credits/transactions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
        }),
        fetch('/api/billing/subscription', {
          headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
        })
      ]);

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        setInvoices(subData.invoices || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel? Your access remains active until current period ends.')) return;
    setIsCanceling(true);

    try {
      const res = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Subscription scheduled for cancellation at period end.', 'info');
        await refreshProfile();
      } else {
        showToast(data.error || 'Cancellation failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error', 'error');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDownloadInvoice = (inv: Invoice) => {
    const receiptText = `NEXORA AI INC. — OFFICIAL PAYMENT RECEIPT\n----------------------------------------\nInvoice Number: ${inv.invoice_number}\nDate: ${new Date(inv.created_at).toLocaleDateString()}\nCustomer: ${user?.email}\nPlan: ${plan?.name || 'Subscription'}\nAmount Paid: $${inv.amount.toFixed(2)} ${inv.currency}\nStatus: PAID (Sandbox Verified)\n----------------------------------------\nThank you for choosing NEXORA AI.`;
    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${inv.invoice_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Invoice downloaded.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Credits</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your available AI credits, plan renewal, payment invoices, and transaction history.
        </p>
      </div>

      {/* Subscription & Credit Meter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Plan Card */}
        <div className="p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Subscription</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
              {subscription?.cancel_at_period_end ? 'Cancels at period end' : 'Active'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white">{plan?.name || 'Free Workspace'}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {plan?.price_monthly ? `$${plan.price_monthly}/month` : 'Free Tier'}
              </p>
            </div>
            <button
              onClick={() => setActivePage('pricing')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-md shadow-purple-500/20"
            >
              Change Plan
            </button>
          </div>

          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Billing Interval:</span>
              <span className="text-white font-medium">Monthly Recurring</span>
            </div>
            <div className="flex justify-between">
              <span>Next Renewal Date:</span>
              <span className="text-white font-medium">
                {subscription ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {!subscription?.cancel_at_period_end && user?.role !== 'free' && (
            <div className="pt-3 border-t border-[#1E293B] flex justify-end">
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                {isCanceling ? 'Processing...' : 'Cancel Subscription'}
              </button>
            </div>
          )}
        </div>

        {/* Credit Meter Card */}
        <div className="p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credit Allocation</span>
            <Coins className="w-4 h-4 text-[#06B6D4]" />
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white">
              {credits?.balance ?? 0}
              <span className="text-xs text-slate-400 font-normal ml-2">credits available</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Monthly allocation: {credits?.monthly_limit ?? 2500} credits
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-[#080B14] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]"
              style={{ width: `${Math.min(100, Math.max(5, ((credits?.balance ?? 0) / (credits?.monthly_limit || 2500)) * 100))}%` }}
            />
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Used today: {credits?.used_today ?? 0} credits</span>
            <button
              onClick={() => setActivePage('pricing')}
              className="text-[#8B5CF6] font-semibold hover:underline"
            >
              Top Up Credits →
            </button>
          </div>
        </div>

      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Receipt className="w-4 h-4 text-emerald-400" />
          <span>Payment Invoices & Receipts</span>
        </h3>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] text-slate-400 text-[11px]">
                  <th className="pb-3 font-semibold">Invoice Number</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {invoices.map(inv => (
                  <tr key={inv.id} className="text-slate-300">
                    <td className="py-3 font-mono font-semibold text-white">{inv.invoice_number}</td>
                    <td className="py-3">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className="py-3 font-semibold">${inv.amount.toFixed(2)} USD</td>
                    <td className="py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 font-bold uppercase">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(inv)}
                        className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            No invoices generated yet.
          </div>
        )}
      </div>

      {/* Credit Transactions Audit Log */}
      <div className="p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#8B5CF6]" />
          <span>Credit Transaction Log</span>
        </h3>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] text-slate-400 text-[11px]">
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Balance After</th>
                  <th className="pb-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60">
                {transactions.slice(0, 15).map(tx => (
                  <tr key={tx.id} className="text-slate-300">
                    <td className="py-3">{tx.description}</td>
                    <td className={`py-3 font-semibold ${tx.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} cr
                    </td>
                    <td className="py-3 font-mono">{tx.balance_after} cr</td>
                    <td className="py-3 text-slate-500 text-[11px]">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            No transactions recorded yet.
          </div>
        )}
      </div>

    </div>
  );
};
