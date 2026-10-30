/**
 * NEXORA AI — Contact Us & Support Submission (Page 12)
 * Working ticket submission endpoint with real persistence and SLA response times.
 */

import React, { useState } from 'react';
import { ActivePage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Mail, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Headphones
} from 'lucide-react';

export const ContactPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !subject.trim() || !message.trim()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message, priority })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedTicket(data.ticket);
        showToast('Support ticket registered! We will respond promptly.', 'success');
      } else {
        showToast(data.error || 'Failed to submit ticket', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Submission error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101625] border border-[#1E293B] text-xs font-semibold text-[#06B6D4] mb-3">
          <Headphones className="w-3.5 h-3.5" />
          <span>Customer & Engineering Support</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Contact NEXORA AI</h1>
        <p className="text-slate-400 text-sm mt-3">
          Have an enterprise inquiry, need integration assistance, or have feature feedback? Our team responds within 2-4 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
        
        {/* Support Channels (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Direct Assistance</h3>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[#8B5CF6] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">General Inquiries</div>
                <div className="text-slate-400 text-[11px]">support@nexora.ai</div>
                <div className="text-slate-400 text-[11px]">enterprise@nexora.ai</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#06B6D4] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Guaranteed Response SLA</div>
                <div className="text-slate-400 text-[11px]">Free Tier: 24-48 hours</div>
                <div className="text-purple-300 text-[11px] font-semibold">Pro & Business: Under 4 hours (24/7)</div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Security & Vulnerability Reports</div>
                <div className="text-slate-400 text-[11px]">security@nexora.ai</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#080B14] border border-[#1E293B] text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-white">Looking for documentation?</p>
            <p>Check out our self-serve guides, API specifications, and studio tutorials.</p>
            <button
              onClick={() => setActivePage('help')}
              className="text-[#06B6D4] font-semibold hover:underline block pt-1"
            >
              Visit Help Center & FAQ →
            </button>
          </div>
        </div>

        {/* Ticket Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl">
            {submittedTicket ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Ticket #{submittedTicket.id} Received</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your ticket has been logged in our engineering queues. A confirmation email has been dispatched to <span className="text-white font-semibold">{email}</span>.
                </p>
                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#131C2D] border border-[#1E293B] text-slate-200 hover:text-white"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-white block mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. Question regarding custom chatbot embed"
                      className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white block mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as any)}
                      className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-[#8B5CF6]"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-white block mb-1">Message Details *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, bug report, or feature request in detail..."
                    className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
