/**
 * NEXORA AI — AI Business Assistant (Studio 7)
 * Pairs validated deterministic calculations for invoices & quotes
 * with AI-generated business plans, meeting action items, and task breakdowns.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Briefcase, 
  Sparkles, 
  Calculator, 
  FileCheck, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  DollarSign, 
  Receipt,
  ListTodo,
  FileSpreadsheet
} from 'lucide-react';

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export const BusinessStudio: React.FC = () => {
  const { user, credits, refreshCredits } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'invoice' | 'business_plan' | 'meeting_notes' | 'task_planner'>('invoice');

  // Deterministic Invoice / Quote Calculator State
  const [clientName, setClientName] = useState('Acme Global Enterprises');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-0042');
  const [currency, setCurrency] = useState('USD ($)');
  const [taxRate, setTaxRate] = useState(10);
  const [discountRate, setDiscountRate] = useState(5);
  const [items, setItems] = useState<InvoiceLineItem[]>([
    { id: '1', description: 'Enterprise AI Workspace Deployment & Custom Model Tuning', quantity: 1, unitPrice: 3500 },
    { id: '2', description: 'Knowledge Base PDF Ingestion & Chatbot Grounding', quantity: 3, unitPrice: 450 },
    { id: '3', description: 'SaaS Platform Security Audit & RLS Verification', quantity: 1, unitPrice: 1200 }
  ]);

  // General Business Plan & Meeting state
  const [businessTopic, setBusinessTopic] = useState('');
  const [meetingNotesRaw, setMeetingNotesRaw] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Deterministic Math Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
  const discountAmount = subtotal * (discountRate / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * (taxRate / 100);
  const grandTotal = subtotalAfterDiscount + taxAmount;

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), description: 'New Deliverable Item', quantity: 1, unitPrice: 200 }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: 'description' | 'quantity' | 'unitPrice', value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Generate AI Business synthesis
  const handleGenerateAI = async (tool: string, promptText: string) => {
    if (!promptText.trim()) {
      showToast('Please enter details or brief first.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          studio: 'business',
          tool,
          prompt: promptText,
          creditCost: 20,
          parameters: {
            financials: activeTab === 'invoice' ? { subtotal, discountAmount, taxAmount, grandTotal } : undefined
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiOutput(data.output);
        showToast('Business document generated!', 'success');
        refreshCredits();
      } else {
        showToast(data.error || 'Generation failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Generation error', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Studio 7 of 7</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Business Assistant</h1>
          <p className="text-slate-400 text-sm mt-1">
            Validated deterministic financial calculations, professional quotations, business plans, and executive meeting notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300 font-semibold flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Deterministic Math Verified</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E293B] mb-6 gap-2">
        <button
          onClick={() => setActiveTab('invoice')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'invoice'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Invoice & Quotation Calculator
        </button>
        <button
          onClick={() => setActiveTab('business_plan')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'business_plan'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Business Plan Generator
        </button>
        <button
          onClick={() => setActiveTab('meeting_notes')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'meeting_notes'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Meeting Notes & Action Matrix
        </button>
        <button
          onClick={() => setActiveTab('task_planner')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'task_planner'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Project Task Planner
        </button>
      </div>

      {activeTab === 'invoice' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Calculator Builder (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Invoice Details</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-[#080B14] px-2 py-0.5 rounded border border-[#1E293B]">
                  Live Calculation
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none"
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>CAD ($)</option>
                    <option>AUD ($)</option>
                  </select>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300">Deliverable Line Items</label>
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#131C2D] border border-purple-500/30 text-purple-300 hover:bg-purple-950/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-[#080B14] p-2.5 rounded-xl border border-[#1E293B] text-xs">
                      <div className="col-span-6">
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Description..."
                          className="w-full bg-transparent text-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          className="w-full bg-[#101625] px-2 py-1 rounded text-center text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={e => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full bg-[#101625] px-2 py-1 rounded text-right text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adjustments (Tax & Discount) */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountRate}
                    onChange={e => setDiscountRate(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tax / VAT %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={e => setTaxRate(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-white"
                  />
                </div>
              </div>

              {/* Deterministic Summary Display */}
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#1E293B] space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({discountRate}%):</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {taxAmount > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Tax ({taxRate}%):</span>
                    <span className="font-mono text-white">+${taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1E293B]">
                  <span>Grand Total:</span>
                  <span className="font-mono text-emerald-400 text-base">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* AI Executive Summary Generator */}
              <button
                onClick={() => handleGenerateAI(
                  'Invoice Executive Summary & Terms Generator',
                  `Draft a formal executive summary and terms of service for Invoice ${invoiceNumber} issued to ${clientName}. Total amount: $${grandTotal.toFixed(2)}. Include payment terms (Net 30), wire transfer instructions placeholder, and milestone acceptance criteria.`
                )}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-500 to-[#06B6D4] text-white hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Professional Executive Notes with AI (20 cr)</span>
              </button>

            </div>
          </div>

          {/* Right Column: Formal Document Viewer (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl flex-1 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Formal Invoice Preview</span>
                <button
                  onClick={() => {
                    const text = `# INVOICE: ${invoiceNumber}\nClient: ${clientName}\nGrand Total: $${grandTotal.toFixed(2)}\n\n${aiOutput}`;
                    navigator.clipboard.writeText(text);
                    showToast('Invoice copied!', 'success');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#131C2D] border border-[#1E293B] text-xs text-slate-300 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              <div className="flex-1 bg-[#080B14] p-4 rounded-xl border border-[#1E293B] text-xs font-mono space-y-3 overflow-y-auto max-h-[460px]">
                <div className="border-b border-slate-800 pb-2">
                  <div className="font-bold text-white text-sm">NEXORA GLOBAL SYSTEMS</div>
                  <div className="text-slate-500 text-[10px]">Tax ID: US-99410294-AI • Net 30</div>
                </div>

                <div className="flex justify-between text-slate-400 text-[11px]">
                  <div>
                    <span className="text-slate-500">BILLED TO:</span><br />
                    <span className="text-white font-semibold">{clientName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">INVOICE:</span><br />
                    <span className="text-white font-semibold">{invoiceNumber}</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="pt-2">
                  <div className="text-[10px] text-slate-500 font-bold uppercase border-b border-slate-800 pb-1">
                    Line Deliverables
                  </div>
                  {items.map(i => (
                    <div key={i.id} className="flex justify-between py-1 text-slate-300 text-[11px] border-b border-slate-900">
                      <span>{i.description} (x{i.quantity})</span>
                      <span className="font-semibold text-white">${(i.quantity * i.unitPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-right">
                  <span className="text-slate-400 text-xs mr-4">TOTAL DUE:</span>
                  <span className="text-emerald-400 font-bold text-base">${grandTotal.toFixed(2)}</span>
                </div>

                {aiOutput && (
                  <div className="pt-4 border-t border-slate-800">
                    <div className="text-[10px] text-purple-400 font-bold uppercase mb-1">
                      AI Executive Notes & Terms
                    </div>
                    <div className="text-slate-300 text-[11px] whitespace-pre-wrap leading-relaxed">
                      {aiOutput}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Business Plan, Meeting Notes, Task Planner Modes */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
              {activeTab === 'business_plan' && (
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Business Concept / Venture Description</label>
                  <textarea
                    rows={6}
                    value={businessTopic}
                    onChange={e => setBusinessTopic(e.target.value)}
                    placeholder="e.g. B2B AI workspace offering 7 unified generative studios for freelancers and small agencies worldwide. Revenue model: tiered subscriptions $9-$39/mo..."
                    className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={() => handleGenerateAI('Full Investor Business Plan', businessTopic)}
                    disabled={isProcessing}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Business Plan (20 cr)</span>
                  </button>
                </div>
              )}

              {activeTab === 'meeting_notes' && (
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Raw Meeting Transcript or Rough Notes</label>
                  <textarea
                    rows={6}
                    value={meetingNotesRaw}
                    onChange={e => setMeetingNotesRaw(e.target.value)}
                    placeholder="Paste bullet points or rough audio transcript of your meeting..."
                    className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={() => handleGenerateAI('Meeting Action Items & Decision Matrix', meetingNotesRaw)}
                    disabled={isProcessing}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Extract Action Items & Matrix (20 cr)</span>
                  </button>
                </div>
              )}

              {activeTab === 'task_planner' && (
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Project Goal & Timeline</label>
                  <textarea
                    rows={6}
                    value={businessTopic}
                    onChange={e => setBusinessTopic(e.target.value)}
                    placeholder="e.g. Build and launch NEXORA AI SaaS in 4 weeks. Milestones: Auth & Database, 7 Studios, Billing, Launch Marketing..."
                    className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    onClick={() => handleGenerateAI('Project Milestone & Task Planner', businessTopic)}
                    disabled={isProcessing}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ListTodo className="w-4 h-4" />
                    <span>Generate Structured Task Plan (20 cr)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl min-h-[480px] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Business Document Output</span>
                {aiOutput && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiOutput);
                      showToast('Copied to clipboard!', 'success');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#131C2D] border border-[#1E293B] text-xs text-slate-300 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                )}
              </div>

              <div className="flex-1">
                {aiOutput ? (
                  <textarea
                    value={aiOutput}
                    onChange={e => setAiOutput(e.target.value)}
                    className="w-full h-full min-h-[400px] p-4 text-xs font-mono leading-relaxed rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <Briefcase className="w-10 h-10 mb-2" />
                    <p className="text-xs">Generated business output will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
