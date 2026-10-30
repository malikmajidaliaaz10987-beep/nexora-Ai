/**
 * NEXORA AI — AI Document Studio (Studio 4)
 * Chat with PDF & Documents, Executive Summarization,
 * Resume & Cover Letter Builder with instant analytical Q&A.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Upload, 
  Send, 
  Copy, 
  Download, 
  Trash2, 
  Coins, 
  CheckCircle2, 
  FileCode,
  Briefcase
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const SAMPLE_DOCS = [
  {
    id: 'doc_1',
    name: 'SaaS_Terms_and_SLA_2026.pdf',
    size: '142 KB',
    sampleText: 'Section 4.1 Service Level Agreement: NEXORA AI provides a 99.95% uptime commitment for all enterprise workspace tiers. In the event of unscheduled downtime exceeding 45 consecutive minutes, affected accounts are entitled to a 10% credit rebate. Section 5 Data Retention: All customer-generated intellectual property is retained for the duration of the active subscription plus 90 days grace period.'
  },
  {
    id: 'doc_2',
    name: 'Q3_Investor_Financial_Report.pdf',
    size: '280 KB',
    sampleText: 'NEXORA AI closed Q3 with $4.8M ARR, representing 140% year-over-year net revenue retention. Gross margins expanded to 84% due to optimized server-side caching and Gemini 3.8 Flash model efficiency. Churn remained under 1.2% across paid tiers.'
  }
];

export const DocumentStudio: React.FC = () => {
  const { user, credits, refreshCredits } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'chat' | 'summarize' | 'resume' | 'cover_letter'>('chat');
  const [docText, setDocText] = useState(SAMPLE_DOCS[0].sampleText);
  const [docName, setDocName] = useState(SAMPLE_DOCS[0].name);
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Document loaded: "SaaS_Terms_and_SLA_2026.pdf". You can ask me any question regarding uptime SLA, credit rebates, or data retention policies.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState('');

  // Resume state
  const [resumeRole, setResumeRole] = useState('Senior Full-Stack AI Engineer');
  const [experienceText, setExperienceText] = useState('5 years building distributed React/Node systems, scaled SaaS to 100k DAU, led migration to Google Gemini GenAI SDK.');

  const creditCost = 15;

  const handleSendQuestion = async () => {
    if (!question.trim()) return;
    if (!docText.trim()) {
      showToast('Please upload or paste a document first.', 'error');
      return;
    }

    const userMsg: ChatMessage = { sender: 'user', text: question, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          studio: 'document',
          tool: 'Chat with Document Q&A',
          prompt: `User Question: "${userMsg.text}". Answer strictly based on the following document context:`,
          creditCost,
          parameters: { sourceText: docText }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: data.output, timestamp: new Date().toISOString() }
        ]);
        refreshCredits();
      } else {
        showToast(data.error || 'Q&A failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Error communicating with AI engine', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async () => {
    if (!docText.trim()) {
      showToast('Please provide document text to summarize.', 'error');
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
          studio: 'document',
          tool: 'Executive Document Summarizer',
          prompt: 'Provide an Executive Summary, Key Metrics/Decisions, and Risk & Compliance Items for this document.',
          creditCost,
          parameters: { sourceText: docText }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedDoc(data.output);
        showToast('Document summarized successfully!', 'success');
        refreshCredits();
      } else {
        showToast(data.error || 'Summarization failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to summarize', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuildResume = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          studio: 'document',
          tool: activeTab === 'resume' ? 'Executive Resume Builder' : 'Targeted Cover Letter Generator',
          prompt: `Target Role: ${resumeRole}. Raw Experience & Highlights:\n${experienceText}`,
          creditCost: 20,
          parameters: { format: 'ATS-optimized professional format' }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedDoc(data.output);
        showToast('Generated document successfully!', 'success');
        refreshCredits();
      } else {
        showToast(data.error || 'Generation failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Generation failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <FileText className="w-4 h-4" />
            <span>Studio 4 of 7</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Document Studio</h1>
          <p className="text-slate-400 text-sm mt-1">
            Chat with PDFs, extract executive summaries, interrogate legal contracts, and craft ATS-ready resumes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101625] border border-[#1E293B] text-xs text-slate-300">
            <Coins className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Operation Cost:</span>
            <span className="font-bold text-white">{creditCost} credits</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E293B] mb-6 gap-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'chat'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Chat with PDF / Document
        </button>
        <button
          onClick={() => setActiveTab('summarize')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'summarize'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Executive Summarizer
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'resume'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          ATS Resume Builder
        </button>
        <button
          onClick={() => setActiveTab('cover_letter')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'cover_letter'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Targeted Cover Letter
        </button>
      </div>

      {activeTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Document Source Panel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Source Document</span>
                <span className="text-[11px] text-slate-400">{docText.length} chars</span>
              </div>

              {/* Sample Document Quick Loader */}
              <div className="flex gap-2">
                {SAMPLE_DOCS.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setDocName(doc.name);
                      setDocText(doc.sampleText);
                      setChatMessages([
                        {
                          sender: 'ai',
                          text: `Loaded "${doc.name}". What would you like to examine?`,
                          timestamp: new Date().toISOString()
                        }
                      ]);
                    }}
                    className={`text-[10px] p-2 rounded-lg border text-left flex-1 transition-all ${
                      docName === doc.name
                        ? 'bg-[#131C2D] border-emerald-400/50 text-emerald-300'
                        : 'bg-[#080B14] border-[#1E293B] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold truncate">{doc.name}</div>
                    <div className="text-slate-500">{doc.size}</div>
                  </button>
                ))}
              </div>

              <textarea
                rows={10}
                value={docText}
                onChange={e => setDocText(e.target.value)}
                placeholder="Paste text from any contract, report, whitepaper, or document..."
                className="w-full p-3 text-xs font-mono rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-emerald-400"
              />

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Secure local text session</span>
                <button
                  onClick={() => { setDocText(''); setDocName('Custom Document'); }}
                  className="text-rose-400 hover:underline"
                >
                  Clear document
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col h-[560px] p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Document Intelligence Q&A</span>
              </div>
              <span className="text-[11px] text-slate-400">Context: {docName}</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-[#06B6D4] text-white rounded-tr-none'
                        : 'bg-[#131C2D] border border-[#1E293B] text-slate-200 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-[#131C2D] border border-[#1E293B] text-xs text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span>Analyzing document clauses...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-[#1E293B] flex gap-2">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendQuestion()}
                placeholder="Ask about this document (e.g. What is the penalty for downtime?)..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={handleSendQuestion}
                disabled={isProcessing || !question.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs disabled:opacity-40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Summarizer & Career Document Tools */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
              {activeTab === 'summarize' ? (
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Document Text to Summarize</label>
                  <textarea
                    rows={8}
                    value={docText}
                    onChange={e => setDocText(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    onClick={handleSummarize}
                    disabled={isProcessing}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Executive Summary ({creditCost} cr)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-white block mb-1">Target Position / Company</label>
                    <input
                      type="text"
                      value={resumeRole}
                      onChange={e => setResumeRole(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white block mb-1">Experience & Core Achievements</label>
                    <textarea
                      rows={6}
                      value={experienceText}
                      onChange={e => setExperienceText(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <button
                    onClick={handleBuildResume}
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Build {activeTab === 'resume' ? 'Resume' : 'Cover Letter'} (20 cr)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl min-h-[480px] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Generated Document</span>
                {generatedDoc && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedDoc);
                      showToast('Copied to clipboard!', 'success');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131C2D] border border-[#1E293B] text-xs text-slate-300 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Document</span>
                  </button>
                )}
              </div>
              <div className="flex-1">
                {generatedDoc ? (
                  <textarea
                    value={generatedDoc}
                    onChange={e => setGeneratedDoc(e.target.value)}
                    className="w-full h-full min-h-[400px] p-4 text-xs font-mono leading-relaxed rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <FileCode className="w-10 h-10 mb-2" />
                    <p className="text-xs">Document output will appear here</p>
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
