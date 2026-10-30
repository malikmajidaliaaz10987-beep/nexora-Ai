/**
 * NEXORA AI — Pricing & Plans (Page 10)
 * Transparent pricing tiers ($0, $9, $19, $39) with annual discount toggle,
 * detailed feature breakdown, and verified Sandbox checkout flow.
 */

import React, { useState } from 'react';
import { ActivePage, SubscriptionPlan } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  HelpCircle, 
  X, 
  CreditCard, 
  AlertCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

interface PricingPageProps {
  setActivePage: (p: ActivePage) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ setActivePage }) => {
  const { user, subscription, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{ tier: string; name: string; price: number; credits: number } | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const plans = [
    {
      tier: 'free',
      name: 'Free Workspace',
      desc: 'Ideal for trying out NEXORA AI core generative writing & document analysis.',
      priceMonthly: 0,
      priceAnnual: 0,
      credits: '50 daily credits',
      popular: false,
      features: [
        '50 Daily AI Credits (resets daily)',
        'Basic AI Writing Studio tools',
        'PDF Text Extraction & Summaries',
        '1 Custom Chatbot with basic context',
        'Personal workspace storage',
        'Standard Community Support'
      ],
      cta: 'Current Plan'
    },
    {
      tier: 'starter',
      name: 'Starter Pro',
      desc: 'For freelancers & solo creators requiring regular content and document Q&A.',
      priceMonthly: 9,
      priceAnnual: 89,
      credits: '500 monthly credits',
      popular: false,
      features: [
        '500 Monthly AI Credits',
        'All 18 AI Writing Studio Modes',
        'Interactive Chat with PDF & Documents',
        '3 Custom Knowledge-Grounded Bots',
        'Deterministic Business Quotations',
        'Full Export to DOCX & Markdown',
        'Standard Email Support'
      ],
      cta: 'Upgrade to Starter'
    },
    {
      tier: 'pro',
      name: 'Pro Creator',
      desc: 'Our most popular tier for power users, marketing teams, and builders.',
      priceMonthly: 19,
      priceAnnual: 189,
      credits: '2,500 monthly credits',
      popular: true,
      features: [
        '2,500 Monthly AI Credits',
        'Unrestricted Access to All 7 AI Studios',
        'AI Marketing Campaign & Ad Variant Planner',
        'Full Deterministic Invoicing with Math Engine',
        'Unlimited Custom Bots with Embed Widget',
        'High-Resolution Image Studio & Gallery',
        'Priority Gemini 3.8 Flash Execution',
        '24/7 Priority Support'
      ],
      cta: 'Upgrade to Pro'
    },
    {
      tier: 'business',
      name: 'Business Enterprise',
      desc: 'High-volume workspace for agencies, startups, and multi-seat teams.',
      priceMonthly: 39,
      priceAnnual: 389,
      credits: '8,000 monthly credits',
      popular: false,
      features: [
        '8,000 Monthly AI Credits',
        'Multi-Seat Shared Team Workspace',
        'Customer Lead Capture in Chatbots',
        'Dedicated API Key Access & Webhooks',
        'Custom Brand Voice & SEO Modeling',
        'Admin Security Audit Logs',
        'Dedicated Account Manager & SLA'
      ],
      cta: 'Upgrade to Business'
    }
  ];

  const handleOpenCheckout = (plan: any) => {
    if (!user) {
      setActivePage('auth');
      return;
    }
    const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
    setSelectedPlanForCheckout({
      tier: plan.tier,
      name: plan.name,
      price,
      credits: plan.tier === 'business' ? 8000 : plan.tier === 'pro' ? 2500 : plan.tier === 'starter' ? 500 : 50
    });
  };

  const handleConfirmSandboxCheckout = async () => {
    if (!selectedPlanForCheckout) return;
    setIsUpgrading(true);

    try {
      const res = await fetch('/api/billing/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          planTier: selectedPlanForCheckout.tier
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || `Upgraded to ${selectedPlanForCheckout.name}!`, 'success');
        setSelectedPlanForCheckout(null);
        await refreshProfile();
      } else {
        showToast(data.error || 'Upgrade failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Upgrade failed', 'error');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101625] border border-[#1E293B] text-xs font-semibold text-[#8B5CF6] mb-3">
          <Coins className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Transparent Usage-Based Plans</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Flexible Pricing For Every Stage
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Choose a plan that fits your creative or business velocity. Upgrade, downgrade, or cancel anytime with zero lock-in.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-2xl bg-[#101625] border border-[#1E293B]">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !isAnnual ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAnnual ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-extrabold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {plans.map(p => {
          const isCurrent = user?.role === p.tier;
          const price = isAnnual ? p.priceAnnual : p.priceMonthly;
          return (
            <div
              key={p.tier}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                p.popular
                  ? 'bg-gradient-to-b from-[#131C2D] to-[#101625] border-2 border-[#8B5CF6] shadow-2xl shadow-purple-500/15 ring-1 ring-purple-500/50'
                  : 'bg-[#101625] border border-[#1E293B] shadow-xl'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{p.desc}</p>

                <div className="mt-5 mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-slate-400">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-[#06B6D4] bg-[#080B14] px-2 py-0.5 rounded-md border border-[#1E293B]">
                    {p.credits}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#1E293B]/60 space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Features Included:</p>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1E293B]/60">
                <button
                  onClick={() => handleOpenCheckout(p)}
                  disabled={isCurrent}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1E293B] text-slate-400 cursor-default'
                      : p.popular
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-purple-500/25'
                      : 'bg-[#131C2D] border border-[#1E293B] text-white hover:border-[#8B5CF6]'
                  }`}
                >
                  <span>{isCurrent ? 'Current Active Plan' : p.cta}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Refund Assurance */}
      <div className="p-6 rounded-2xl bg-[#101625] border border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#8B5CF6] shrink-0" />
          <div>
            <span className="font-bold text-white block">14-Day Money Back Guarantee</span>
            <span>If you are not delighted with NEXORA AI, contact our team within 14 days for a full refund.</span>
          </div>
        </div>
        <button
          onClick={() => setActivePage('legal-refund')}
          className="text-[#06B6D4] font-semibold hover:underline shrink-0"
        >
          Read Refund Policy →
        </button>
      </div>

      {/* Sandbox Payment Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#101625] border border-[#8B5CF6]/50 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setSelectedPlanForCheckout(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[#8B5CF6]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Upgrade to {selectedPlanForCheckout.name}</h3>
                <p className="text-xs text-slate-400">Sandbox Merchant Testing Session</p>
              </div>
            </div>

            {/* Sandbox Notice Banner */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Sandbox / Test Mode Active:</strong> No real payment card will be charged. This verified simulation activates your plan and allocates {selectedPlanForCheckout.credits} credits immediately.
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#1E293B] space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Selected Plan:</span>
                <span className="text-white font-semibold">{selectedPlanForCheckout.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monthly Credit Allocation:</span>
                <span className="text-[#06B6D4] font-semibold">{selectedPlanForCheckout.credits} credits</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Billing Interval:</span>
                <span className="text-white font-semibold">{isAnnual ? 'Annual (20% discount)' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1E293B]">
                <span>Total Due Today:</span>
                <span className="text-emerald-400 font-mono text-base">${selectedPlanForCheckout.price}.00</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="flex-1 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white bg-[#131C2D]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSandboxCheckout}
                disabled={isUpgrading}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{isUpgrading ? 'Authorizing...' : 'Authorize Sandbox Activation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
