/**
 * NEXORA AI — AI Writing Studio (Studio 1)
 * 18+ high-conversion generative writing modes powered by Gemini 3.8 Flash
 * with live word counter, tone controls, audience tuning, and export.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  PenTool, 
  Sparkles, 
  Copy, 
  Download, 
  Save, 
  RotateCw, 
  Check, 
  SlidersHorizontal, 
  FileText, 
  Share2, 
  Search,
  BookOpen,
  Mail,
  Youtube,
  Globe,
  Coins
} from 'lucide-react';

interface WritingTool {
  id: string;
  name: string;
  category: 'Articles' | 'Social' | 'Marketing' | 'Editing' | 'Scripts';
  description: string;
  creditCost: number;
  placeholder: string;
}

const WRITING_TOOLS: WritingTool[] = [
  { id: 'blog_writer', name: 'Blog Article Writer', category: 'Articles', description: 'Comprehensive, engaging, structured blog posts with headers and conclusions.', creditCost: 20, placeholder: 'e.g. 7 ways autonomous AI agents will redefine SaaS workflows in 2026' },
  { id: 'seo_article', name: 'SEO Article Generator', category: 'Articles', description: 'Keyword-optimized deep articles formatted for high search rank authority.', creditCost: 25, placeholder: 'e.g. Complete guide to next-generation cloud database scaling strategies' },
  { id: 'content_outline', name: 'Content Outline Generator', category: 'Articles', description: 'Hierarchical structural outlines with core arguments and sub-points.', creditCost: 10, placeholder: 'e.g. Architecture of high-throughput real-time streaming pipelines' },
  { id: 'text_summary', name: 'Executive Summarizer', category: 'Editing', description: 'Condense long articles or whitepapers into key takeaways.', creditCost: 10, placeholder: 'Paste the source document text or topic to summarize...' },
  { id: 'grammar_fix', name: 'Grammar & Clarity Polisher', category: 'Editing', description: 'Correct syntax, eliminate passive bloat, and elevate prose vocabulary.', creditCost: 10, placeholder: 'Paste text with typos or rough drafts to refine...' },
  { id: 'paraphrase', name: 'Smart Paraphraser', category: 'Editing', description: 'Rephrase text with fresh metaphors and varied sentence structure.', creditCost: 10, placeholder: 'Enter sentence or paragraph to rephrase creatively...' },
  { id: 'tone_changer', name: 'Tone Transformer', category: 'Editing', description: 'Shift perspective between Witty, Corporate, Urgent, or Academic.', creditCost: 10, placeholder: 'Text to adjust into a different tone...' },
  { id: 'translation', name: 'Multi-Language Translator', category: 'Editing', description: 'Nuanced contextual translation preserving idioms and business terminology.', creditCost: 15, placeholder: 'Enter text to translate into Spanish, French, German, Urdu, or Arabic...' },
  { id: 'social_caption', name: 'Social Media Caption Writer', category: 'Social', description: 'Viral hooks, concise storytelling, and targeted hashtags.', creditCost: 10, placeholder: 'e.g. Announcing our new dark cinematic SaaS platform release' },
  { id: 'linkedin_post', name: 'LinkedIn Thought Leadership', category: 'Social', description: 'High-engagement LinkedIn story with line-break pacing and hook.', creditCost: 15, placeholder: 'e.g. The hardest lesson I learned bootstrapping a B2B software startup to $1M ARR' },
  { id: 'facebook_post', name: 'Facebook Community Post', category: 'Social', description: 'Relatable discussion starter engineered for shares and comments.', creditCost: 10, placeholder: 'e.g. What productivity workflow changed your entire remote work routine?' },
  { id: 'instagram_content', name: 'Instagram Carousel & Reels Script', category: 'Social', description: 'Multi-slide visual copy with thumb-stopping slide 1 headline.', creditCost: 15, placeholder: 'e.g. 5 AI tools every freelance designer must master this year' },
  { id: 'ad_copy', name: 'Advertisement Copywriter', category: 'Marketing', description: 'Direct response copy with PAS (Problem-Agitate-Solve) or AIDA frameworks.', creditCost: 15, placeholder: 'e.g. High-conversion PPC ad for an all-in-one productivity workspace' },
  { id: 'product_description', name: 'Product Description Writer', category: 'Marketing', description: 'Sensory and benefit-driven descriptions for e-commerce and SaaS catalogs.', creditCost: 15, placeholder: 'e.g. Minimalist noise-canceling mechanical keyboard with hot-swappable switches' },
  { id: 'email_writer', name: 'Cold & Client Email Writer', category: 'Marketing', description: 'Compelling subject lines, warm intros, and friction-free call to action.', creditCost: 15, placeholder: 'e.g. Cold pitch offering web app performance audit to YC founders' },
  { id: 'proposal_writer', name: 'Client Proposal Generator', category: 'Marketing', description: 'Formal project scope, deliverables, timeline, and terms.', creditCost: 25, placeholder: 'e.g. Scope of work for full-stack SaaS UI overhaul and database migration' },
  { id: 'business_description', name: 'Business Concept Pitch', category: 'Marketing', description: 'One-liner taglines, elevator pitch, and investor problem-solution statement.', creditCost: 15, placeholder: 'e.g. AI-powered workspace unifying 7 generative studios for freelancers' },
  { id: 'youtube_script', name: 'YouTube Script Generator', category: 'Scripts', description: 'Full video script with visual cue notes, fast-paced hook, and CTA.', creditCost: 25, placeholder: 'e.g. 10 AI tools that actually replace entire marketing agencies in 2026' }
];

export const WritingStudio: React.FC = () => {
  const { user, credits, refreshCredits } = useAuth();
  const { showToast } = useToast();

  const [selectedTool, setSelectedTool] = useState<WritingTool>(WRITING_TOOLS[0]);
  const [prompt, setPrompt] = useState('');
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('Founders, Creators & Professionals');
  const [tone, setTone] = useState('Authoritative & Engaging');
  const [language, setLanguage] = useState('English');
  const [length, setLength] = useState('Medium (~400 words)');
  const [outputFormat, setOutputFormat] = useState('Markdown with Subheadings');
  
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = WRITING_TOOLS.filter(t => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a topic or brief before generating.', 'error');
      return;
    }

    if (credits && credits.balance < selectedTool.creditCost) {
      showToast(`Insufficient credits. You need ${selectedTool.creditCost} credits for this tool.`, 'error');
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
          studio: 'writing',
          tool: selectedTool.name,
          prompt,
          creditCost: selectedTool.creditCost,
          parameters: {
            keywords,
            audience: targetAudience,
            tone,
            language,
            length,
            format: outputFormat
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Generation failed', 'error');
      } else {
        setGeneratedOutput(data.output);
        showToast(`Generated in ${(data.latencyMs / 1000).toFixed(1)}s! ${selectedTool.creditCost} credits deducted.`, 'success');
        refreshCredits();
      }
    } catch (err: any) {
      showToast(err.message || 'Network connection failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedOutput) return;
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedOutput) return;
    const blob = new Blob([generatedOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora_${selectedTool.id}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Document downloaded.', 'info');
  };

  const handleSaveProject = async () => {
    if (!generatedOutput) return;
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          title: `${selectedTool.name}: ${prompt.slice(0, 40)}...`,
          description: generatedOutput.slice(0, 160) + '...',
          category: 'Writing',
          tags: ['AI Writing', selectedTool.name]
        })
      });
      if (res.ok) {
        showToast('Saved to your Workspace Projects!', 'success');
      }
    } catch (e) {
      showToast('Failed to save project', 'error');
    }
  };

  const wordCount = generatedOutput ? generatedOutput.trim().split(/\s+/).length : 0;
  const charCount = generatedOutput.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8B5CF6] mb-1">
            <PenTool className="w-4 h-4" />
            <span>Studio 1 of 7</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Writing Studio</h1>
          <p className="text-slate-400 text-sm mt-1">
            Engineered for high-conversion articles, persuasive copy, viral social content, and editorial prose.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101625] border border-[#1E293B] text-xs text-slate-300">
            <Coins className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Tool Cost:</span>
            <span className="font-bold text-white">{selectedTool.creditCost} credits</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs font-semibold text-purple-300">
            Gemini 3.8 Flash
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tool Selector & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tool Selector Card */}
          <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-white uppercase tracking-wider">Select AI Writing Mode</label>
              <span className="text-[11px] text-slate-400">{WRITING_TOOLS.length} specialized modes</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['All', 'Articles', 'Social', 'Marketing', 'Editing', 'Scripts'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    activeCategory === cat
                      ? 'bg-[#8B5CF6] text-white'
                      : 'bg-[#131C2D] text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Tools */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search tools (e.g. SEO, email, outline)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            {/* Scrollable Tool List */}
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {filteredTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between ${
                    selectedTool.id === tool.id
                      ? 'bg-[#131C2D] border border-[#8B5CF6]/50 shadow-inner'
                      : 'hover:bg-[#131C2D]/60'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-white">{tool.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{tool.description}</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#06B6D4] px-1.5 py-0.5 rounded bg-[#080B14] shrink-0 ml-2">
                    {tool.creditCost}cr
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt & Input Parameters Card */}
          <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] space-y-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white">Topic / Primary Brief *</label>
                <span className="text-[10px] text-slate-400">{prompt.length} chars</span>
              </div>
              <textarea
                rows={4}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={selectedTool.placeholder}
                className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Keywords (comma-separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="e.g. AI automation, SaaS architecture, productivity"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            {/* Fine-Tuning Controls Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option>Authoritative & Engaging</option>
                  <option>Professional & Corporate</option>
                  <option>Witty & Conversational</option>
                  <option>Urgent & Direct Response</option>
                  <option>Storytelling & Empathetic</option>
                  <option>Academic & Rigorous</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Output Length</label>
                <select
                  value={length}
                  onChange={e => setLength(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option>Short (~200 words)</option>
                  <option>Medium (~400 words)</option>
                  <option>Long Form (~800 words)</option>
                  <option>Comprehensive Deep-Dive</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Urdu</option>
                  <option>Arabic</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#06B6D4] text-white hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Copy with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Content ({selectedTool.creditCost} credits)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Editor & Generated Result (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] flex-1 flex flex-col shadow-xl min-h-[500px]">
            
            {/* Output Action Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Output Workspace</span>
                {generatedOutput && (
                  <span className="text-[11px] text-slate-400 bg-[#080B14] px-2 py-0.5 rounded-md border border-[#1E293B]">
                    {wordCount} words • {charCount} chars
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!generatedOutput}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#131C2D] border border-[#1E293B] text-xs text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!generatedOutput}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#131C2D] border border-[#1E293B] text-xs text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                  title="Download as Markdown"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                <button
                  onClick={handleSaveProject}
                  disabled={!generatedOutput}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#131C2D] border border-[#8B5CF6]/40 text-xs text-purple-300 hover:text-white disabled:opacity-40 transition-colors"
                  title="Save to project folder"
                >
                  <Save className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Save Project</span>
                </button>
              </div>
            </div>

            {/* Content Area / Empty State */}
            <div className="flex-1 py-4">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] p-0.5 animate-pulse">
                    <div className="w-full h-full bg-[#101625] rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#06B6D4] animate-spin" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white">Generating {selectedTool.name}...</p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Gemini 3.8 Flash is applying tone parameters, audience personas, and formatting constraints.
                  </p>
                </div>
              ) : generatedOutput ? (
                <textarea
                  value={generatedOutput}
                  onChange={e => setGeneratedOutput(e.target.value)}
                  className="w-full h-full min-h-[420px] p-4 text-xs font-mono leading-relaxed rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-[#8B5CF6] resize-y"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500">
                  <FileText className="w-12 h-12 mb-3 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">Ready to compose</p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Select one of the 18 writing tools on the left, enter your topic or prompt, and click Generate.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
