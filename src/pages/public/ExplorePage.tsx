/**
 * NEXORA AI — Explore AI Tools (Page 2)
 * Comprehensive directory of all generative tools across the 7 studios
 * with search, filtering, and instant launch.
 */

import React, { useState } from 'react';
import { ActivePage } from '../../types';
import { 
  Compass, 
  Search, 
  PenTool, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Bot, 
  Megaphone, 
  Briefcase, 
  Coins, 
  ArrowUpRight 
} from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  studioName: string;
  studioPage: ActivePage;
  icon: any;
  category: string;
  credits: number;
  description: string;
  tags: string[];
}

const ALL_TOOLS: ToolItem[] = [
  // Studio 1: Writing
  { id: 'w_1', name: 'Blog Article Writer', studioName: 'AI Writing Studio', studioPage: 'studio-writing', icon: PenTool, category: 'Writing', credits: 20, description: 'Long-form editorial articles formatted with Markdown subheadings.', tags: ['Blog', 'SEO', 'Long-form'] },
  { id: 'w_2', name: 'SEO Article Generator', studioName: 'AI Writing Studio', studioPage: 'studio-writing', icon: PenTool, category: 'Writing', credits: 25, description: 'Keyword-optimized articles designed for high authority search rank.', tags: ['SEO', 'Articles', 'Content'] },
  { id: 'w_3', name: 'Social Media Caption Writer', studioName: 'AI Writing Studio', studioPage: 'studio-writing', icon: PenTool, category: 'Writing', credits: 10, description: 'Viral hooks, concise storytelling, and hashtag recommendations.', tags: ['Social', 'Captions'] },
  { id: 'w_4', name: 'YouTube Script Generator', studioName: 'AI Writing Studio', studioPage: 'studio-writing', icon: PenTool, category: 'Writing', credits: 25, description: 'Scene visual cues, fast hook, and call to action for high retention.', tags: ['YouTube', 'Video', 'Script'] },
  { id: 'w_5', name: 'Client Proposal Generator', studioName: 'AI Writing Studio', studioPage: 'studio-writing', icon: PenTool, category: 'Writing', credits: 25, description: 'Formal statement of work, milestone timelines, deliverables and pricing.', tags: ['Proposal', 'Clients'] },

  // Studio 2: Image
  { id: 'i_1', name: 'Photorealistic Text-to-Image', studioName: 'AI Image Studio', studioPage: 'studio-image', icon: ImageIcon, category: 'Image', credits: 30, description: 'High-resolution image rendering across cinematic and 3D styles.', tags: ['Image', '3D', 'Cinematic'] },
  { id: 'i_2', name: 'Product Concept Photography', studioName: 'AI Image Studio', studioPage: 'studio-image', icon: ImageIcon, category: 'Image', credits: 30, description: 'Studio commercial photography concepts for physical and digital products.', tags: ['Product', 'Commercial'] },
  { id: 'i_3', name: 'Abstract Brand Logo Synthesis', studioName: 'AI Image Studio', studioPage: 'studio-image', icon: ImageIcon, category: 'Image', credits: 30, description: 'Minimalist vector and futuristic 3D brand logo exploration.', tags: ['Logo', 'Brand'] },

  // Studio 3: Video
  { id: 'v_1', name: 'Reels & Shorts Script Planner', studioName: 'AI Video Studio', studioPage: 'studio-video', icon: Video, category: 'Video', credits: 25, description: '9:16 vertical video planning with hook-hold-payoff pacing.', tags: ['Reels', 'Shorts', 'TikTok'] },
  { id: 'v_2', name: 'Scene-by-Scene Storyboard Generator', studioName: 'AI Video Studio', studioPage: 'studio-video', icon: Video, category: 'Video', credits: 25, description: 'Structured visual shots, audio cues, and voiceover pacing breakdowns.', tags: ['Storyboard', 'Video'] },

  // Studio 4: Document
  { id: 'd_1', name: 'Chat with PDF & Documents', studioName: 'AI Document Studio', studioPage: 'studio-document', icon: FileText, category: 'Document', credits: 15, description: 'Ask questions, query SLAs, and verify legal clauses against source text.', tags: ['PDF', 'Chat', 'Analysis'] },
  { id: 'd_2', name: 'Executive Document Summarizer', studioName: 'AI Document Studio', studioPage: 'studio-document', icon: FileText, category: 'Document', credits: 15, description: 'Condenses multi-page whitepapers into key decisions and risks.', tags: ['Summary', 'Executive'] },
  { id: 'd_3', name: 'ATS Resume & Cover Letter Builder', studioName: 'AI Document Studio', studioPage: 'studio-document', icon: FileText, category: 'Document', credits: 20, description: 'Tailors your experience to job descriptions for ATS ranking.', tags: ['Resume', 'Career'] },

  // Studio 5: Chatbot
  { id: 'c_1', name: 'Knowledge-Grounded Bot Builder', studioName: 'AI Chatbot Studio', studioPage: 'studio-chatbot', icon: Bot, category: 'Chatbot', credits: 10, description: 'Train bots on FAQs and company documents with zero hallucination.', tags: ['Chatbot', 'Grounding'] },
  { id: 'c_2', name: 'Website Embed Widget Generator', studioName: 'AI Chatbot Studio', studioPage: 'studio-chatbot', icon: Bot, category: 'Chatbot', credits: 10, description: 'Generates one-line script tag to embed AI concierges on any website.', tags: ['Embed', 'Widget', 'Leads'] },

  // Studio 6: Marketing
  { id: 'm_1', name: 'Omnichannel Campaign Planner', studioName: 'AI Marketing Studio', studioPage: 'studio-marketing', icon: Megaphone, category: 'Marketing', credits: 25, description: '30-day multi-channel roadmap with angles, audiences, and CTAs.', tags: ['Campaign', 'Marketing'] },
  { id: 'm_2', name: 'Google Search & Meta Ad Copy', studioName: 'AI Marketing Studio', studioPage: 'studio-marketing', icon: Megaphone, category: 'Marketing', credits: 15, description: 'RSA ad headlines and Facebook copy with PAS conversion frameworks.', tags: ['Ads', 'Google', 'Meta'] },
  { id: 'm_3', name: 'Brand Voice & Tone Guide', studioName: 'AI Marketing Studio', studioPage: 'studio-marketing', icon: Megaphone, category: 'Marketing', credits: 20, description: 'Institutional style guide defining personality and vocabulary.', tags: ['Branding', 'Voice'] },

  // Studio 7: Business
  { id: 'b_1', name: 'Deterministic Invoice Calculator', studioName: 'AI Business Assistant', studioPage: 'studio-business', icon: Briefcase, category: 'Business', credits: 20, description: 'Validated mathematical billing engine paired with AI client notes.', tags: ['Invoice', 'Math', 'Finance'] },
  { id: 'b_2', name: 'Full Investor Business Plan', studioName: 'AI Business Assistant', studioPage: 'studio-business', icon: Briefcase, category: 'Business', credits: 20, description: 'Executive summary, market size, revenue models, and unit economics.', tags: ['Business Plan', 'Pitch'] },
  { id: 'b_3', name: 'Meeting Notes to Action Matrix', studioName: 'AI Business Assistant', studioPage: 'studio-business', icon: Briefcase, category: 'Business', credits: 20, description: 'Converts unstructured meeting audio notes into owners and deadlines.', tags: ['Meetings', 'Action Items'] }
];

export const ExplorePage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Writing', 'Image', 'Video', 'Document', 'Chatbot', 'Marketing', 'Business'];

  const filtered = ALL_TOOLS.filter(t => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.description.toLowerCase().includes(search.toLowerCase()) ||
                          t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101625] border border-[#1E293B] text-xs font-semibold text-[#8B5CF6] mb-3">
          <Compass className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Interactive Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Explore AI Tools</h1>
        <p className="text-slate-400 text-sm mt-2">
          Discover all tools available across the 7 studios. Launch any tool directly into your active workspace.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools by name, tag, or use case (e.g. invoice, SEO, resume, video)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#101625] border border-[#1E293B] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white shadow-md'
                : 'bg-[#101625] border border-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(tool => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => setActivePage(tool.studioPage)}
              className="cursor-pointer p-5 rounded-2xl bg-[#101625] border border-[#1E293B] hover:border-[#8B5CF6]/50 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-[#8B5CF6]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{tool.studioName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#06B6D4] px-2 py-0.5 rounded-full bg-[#080B14] border border-[#1E293B]">
                    {tool.credits} cr
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#06B6D4] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {tool.tags.map(t => (
                    <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-[#131C2D] text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Launch in Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
