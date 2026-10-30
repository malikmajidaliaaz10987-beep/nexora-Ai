/**
 * NEXORA AI — AI Marketing Studio (Studio 6)
 * Omnichannel campaign planner, ad copy variants (Google, FB, LinkedIn),
 * SEO content architecture, and brand voice matrix.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Megaphone, 
  Sparkles, 
  Target, 
  Search, 
  Calendar, 
  Copy, 
  Download, 
  Share2, 
  Coins, 
  Layers,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface MarketingTool {
  id: string;
  name: string;
  desc: string;
  creditCost: number;
  placeholder: string;
}

const MARKETING_TOOLS: MarketingTool[] = [
  { id: 'campaign_planner', name: 'Comprehensive Campaign Planner', desc: 'Full 30-day omnichannel launch strategy with positioning and deliverables.', creditCost: 25, placeholder: 'e.g. Launching a new B2B AI workspace targeting remote teams in US and UK' },
  { id: 'google_ad_copy', name: 'Google Search & RSA Ad Copy', desc: '15 High-CTR headlines and 4 descriptions formatted for Responsive Search Ads.', creditCost: 15, placeholder: 'e.g. High-conversion PPC ad for cloud productivity workspace' },
  { id: 'facebook_ad_copy', name: 'Facebook & Instagram Ad Creative', desc: 'High-converting hooks, visual creative direction, PAS body copy, and CTA.', creditCost: 15, placeholder: 'e.g. Paid social ad targeting solopreneurs overwhelmed by multiple tools' },
  { id: 'linkedin_campaign', name: 'LinkedIn B2B Sponsored Content', desc: 'Thought leadership angle, enterprise pain points, and decision-maker CTA.', creditCost: 15, placeholder: 'e.g. Enterprise pilot program for engineering and product leads' },
  { id: 'seo_content_strategy', name: 'SEO Content Cluster & Keywords', desc: 'Pillar page concepts, semantic subtopics, search intent, and internal linking.', creditCost: 20, placeholder: 'e.g. Generative AI for small business operations' },
  { id: 'brand_voice_guide', name: 'Brand Voice & Tone Matrix', desc: 'Defines vocabulary rules, "we are / we are not" attributes, and style guide.', creditCost: 20, placeholder: 'e.g. Modern, cinematic, reliable, authoritative Silicon Valley SaaS' },
  { id: 'landing_page_copy', name: 'High-Conversion Landing Page Copy', desc: 'Hero headline, subheader, 3 value pillars, social proof sections, and FAQ.', creditCost: 25, placeholder: 'e.g. SaaS landing page for an all-in-one AI workspace' },
  { id: 'content_calendar', name: 'Weekly Social Content Calendar', desc: 'Day-by-day themes, post formats, angles, and recommended publish cadence.', creditCost: 20, placeholder: 'e.g. 4-week content calendar for a creator economy software platform' }
];

export const MarketingStudio: React.FC = () => {
  const { user, credits, refreshCredits } = useAuth();
  const { showToast } = useToast();

  const [selectedTool, setSelectedTool] = useState<MarketingTool>(MARKETING_TOOLS[0]);
  const [productName, setProductName] = useState('NEXORA AI');
  const [targetAudience, setTargetAudience] = useState('Founders, Freelancers, Creators & Digital Agencies');
  const [brief, setBrief] = useState('');
  const [channel, setChannel] = useState('Omnichannel (Search + Paid Social + Content)');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!brief.trim()) {
      showToast('Please provide a campaign brief or product details.', 'error');
      return;
    }

    if (credits && credits.balance < selectedTool.creditCost) {
      showToast(`Insufficient credits. Required: ${selectedTool.creditCost}`, 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          studio: 'marketing',
          tool: selectedTool.name,
          prompt: `Product: ${productName}\nTarget Audience: ${targetAudience}\nBrief / Objective: ${brief}`,
          creditCost: selectedTool.creditCost,
          parameters: {
            channel,
            format: 'Executive marketing blueprint with clear sections and tactical copy variants'
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOutput(data.output);
        showToast(`Marketing campaign generated! ${selectedTool.creditCost} credits deducted.`, 'success');
        refreshCredits();
      } else {
        showToast(data.error || 'Generation failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Generation error', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Studio 6 of 7</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Marketing Studio</h1>
          <p className="text-slate-400 text-sm mt-1">
            Omnichannel campaign planning, multi-platform ad copy variants, SEO content clusters, and brand voice guides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101625] border border-[#1E293B] text-xs text-slate-300">
            <Coins className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Tool Cost:</span>
            <span className="font-bold text-white">{selectedTool.creditCost} credits</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tool Selector */}
          <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Marketing Objectives</h3>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {MARKETING_TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between ${
                    selectedTool.id === tool.id
                      ? 'bg-[#131C2D] border-blue-500/50 text-white shadow-inner'
                      : 'bg-[#080B14] border-[#1E293B] text-slate-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{tool.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{tool.desc}</div>
                  </div>
                  <span className="text-[10px] text-blue-400 font-bold px-1.5 py-0.5 rounded bg-[#101625] shrink-0 ml-2">
                    {tool.creditCost}cr
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Parameters */}
          <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Product / Brand</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Primary Channel</label>
                <select
                  value={channel}
                  onChange={e => setChannel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option>Omnichannel Launch</option>
                  <option>Google Search Ads (PPC)</option>
                  <option>Meta (Facebook & IG Ads)</option>
                  <option>LinkedIn B2B Sponsored</option>
                  <option>Organic SEO & Content</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Customer Persona</label>
              <input
                type="text"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-1">Campaign Objective & Value Proposition *</label>
              <textarea
                rows={4}
                value={brief}
                onChange={e => setBrief(e.target.value)}
                placeholder={selectedTool.placeholder}
                className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-500 to-[#8B5CF6] text-white hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing Strategy...' : `Generate Campaign Assets (${selectedTool.creditCost} cr)`}</span>
            </button>
          </div>

        </div>

        {/* Output Column (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl flex-1 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">{selectedTool.name}</span>
              {output && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131C2D] border border-[#1E293B] text-xs text-slate-300 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied' : 'Copy Campaign'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1">
              {output ? (
                <textarea
                  value={output}
                  onChange={e => setOutput(e.target.value)}
                  className="w-full h-full min-h-[440px] p-4 text-xs font-mono leading-relaxed rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Target className="w-10 h-10 mb-2" />
                  <p className="text-xs">Generated marketing copy and campaign strategy will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
