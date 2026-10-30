/**
 * NEXORA AI — Legal & Compliance Suite
 * Covers Privacy Policy, Terms of Service, Cookie Policy, Refund Policy, and Acceptable Use.
 */

import React, { useState } from 'react';
import { ActivePage } from '../../types';
import { ShieldCheck, FileText, Lock, RefreshCw, AlertTriangle } from 'lucide-react';

interface LegalPagesProps {
  initialTab?: 'privacy' | 'terms' | 'cookies' | 'refund' | 'acceptable-use';
  setActivePage: (p: ActivePage) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ initialTab = 'privacy', setActivePage }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies' | 'refund' | 'acceptable-use'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101625] border border-[#1E293B] text-xs font-semibold text-[#8B5CF6] mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>International Regulatory Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Legal & Governance Policies</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2">
          Effective Date: October 2026 • Governing jurisdictions: United States, United Kingdom, Canada, Australia, European Union (GDPR).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-[#1E293B] mb-8 gap-2 justify-center">
        {[
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'terms', label: 'Terms of Service' },
          { id: 'cookies', label: 'Cookie Policy' },
          { id: 'refund', label: 'Refund Policy' },
          { id: 'acceptable-use', label: 'Acceptable Use Policy' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-[#8B5CF6] text-purple-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Policy Content */}
      <div className="p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-xl text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
        
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">NEXORA AI Privacy Policy</h2>
            <p>
              At NEXORA AI, we treat privacy as a non-negotiable architectural requirement. This policy details how we collect, store, and process personal data when you interact with our 7 AI studios and workspace services.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">1. Zero Data Scraping Guarantee</h3>
            <p>
              We do NOT use customer-submitted prompts, proprietary business documents, uploaded PDFs, or chatbot knowledge bases to train public machine learning or foundation models. All inference requests processed via Google Gemini 3.8 Flash are transient and governed by enterprise data processing agreements.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">2. Row Level Security & Encryption</h3>
            <p>
              User databases enforce PostgreSQL Row Level Security (RLS). A user can never read, modify, or delete another user’s records. Data is encrypted in transit using TLS 1.3 and at rest with AES-256.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">3. Data Deletion Rights (GDPR & CCPA)</h3>
            <p>
              You have the right to request full, irreversible erasure of your profile, projects, and generation logs directly from your Account Settings page at any time.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Terms of Service</h2>
            <p>
              By creating a workspace or using any NEXORA AI studio, you agree to comply with these terms governing platform access, credit economics, and intellectual property.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">1. Intellectual Property Ownership</h3>
            <p>
              You retain full ownership of all copy, articles, code, images, scripts, and business models generated through your NEXORA AI workspace, subject to applicable local copyright laws.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">2. Subscription & Credit Economics</h3>
            <p>
              Subscriptions renew automatically at the end of each billing cycle (monthly or annual). Credits are consumed per generative tool operation based on published studio rates. Failed generation jobs due to server errors are automatically refunded.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">3. Limitation of Liability</h3>
            <p>
              NEXORA AI provides services on an "as-is" and "as-available" basis. While our business studio incorporates validated deterministic calculation algorithms, users remain responsible for verifying legal and financial decisions.
            </p>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Cookie & Local Storage Policy</h2>
            <p>
              NEXORA AI utilizes minimal, privacy-conscious storage mechanisms essential for session persistence and authentication.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">1. Essential Authentication Tokens</h3>
            <p>
              We use secure browser local storage and bearer tokens to maintain your login session across tab reloads without storing sensitive plaintext passwords.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">2. Zero Third-Party Advertising Trackers</h3>
            <p>
              We do not employ third-party cross-site behavioral tracking cookies or sell your browsing history to advertising brokers.
            </p>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Refund & Cancellation Policy</h2>
            <p>
              We believe in transparent, friction-free business practices.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">1. 14-Day Money Back Guarantee</h3>
            <p>
              If you purchase a paid subscription (Starter, Pro, or Business) and decide NEXORA AI is not suitable for your workflow, request a refund within 14 calendar days of your initial purchase for a 100% full refund.
            </p>
            <h3 className="text-sm font-bold text-white mt-4">2. Instant Subscription Cancellation</h3>
            <p>
              You can cancel your subscription at any time with a single click from the Billing & Subscription page. Your access and remaining credit balance will remain active until the end of your current billing period.
            </p>
          </div>
        )}

        {activeTab === 'acceptable-use' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Acceptable Use Policy (AUP)</h2>
            <p>
              To protect the integrity of our platform and global user base, the following activities are strictly prohibited:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Generating malicious code, exploits, or phishing email campaigns.</li>
              <li>Deploying custom chatbots designed to harass, defraud, or impersonate law enforcement or financial institutions.</li>
              <li>Attempting to bypass credit accounting, reverse-engineer proprietary server endpoints, or launch DDoS attacks against our infrastructure.</li>
              <li>Synthesizing non-consensual personal imagery or illegal content.</li>
            </ul>
            <p className="mt-4">
              Violations result in immediate account suspension, credit revocation, and reporting where legally mandated.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
