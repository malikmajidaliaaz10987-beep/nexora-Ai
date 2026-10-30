/**
 * NEXORA AI — AI Video Studio (Studio 3)
 * Asynchronous video pipeline, Reels/Shorts planner,
 * video script synthesis, and provider configuration status.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Video, 
  Sparkles, 
  Film, 
  Clapperboard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  RotateCw,
  Coins,
  Settings2,
  FileVideo
} from 'lucide-react';

interface VideoJob {
  id: string;
  title: string;
  prompt: string;
  type: 'Text-to-Video' | 'Reels / Shorts Script' | 'Storyboard Scene Breakdown';
  status: 'queued' | 'processing' | 'completed' | 'setup_required';
  progress: number;
  output?: string;
  createdAt: string;
}

export const VideoStudio: React.FC = () => {
  const { user, credits, refreshCredits } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'script_planner' | 'storyboard' | 'render_pipeline'>('script_planner');
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('YouTube Shorts & Instagram Reels (9:16)');
  const [duration, setDuration] = useState('30-60 Seconds (High Retention)');
  const [voiceTone, setVoiceTone] = useState('Energetic & Engaging');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobs, setJobs] = useState<VideoJob[]>([
    {
      id: 'job_101',
      title: 'Autonomous AI SaaS Demo Reel',
      prompt: 'Showcase of 7 AI studios operating in dark futuristic glass interface',
      type: 'Storyboard Scene Breakdown',
      status: 'completed',
      progress: 100,
      output: '### Scene 1: Hook (0:00 - 0:04)\n**Visual:** Fast zoom into glowing abstract N logo emitting cyan shockwaves.\n**Voiceover:** "Tired of paying for 8 different AI tools that do not talk to each other?"\n\n### Scene 2: The Solution (0:05 - 0:15)\n**Visual:** Screen splits into 7 dynamic holographic glass studios.\n**Voiceover:** "Meet NEXORA AI. The unified workspace engineered for 10x output."',
      createdAt: '2026-10-30T04:00:00Z'
    }
  ]);
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(jobs[0]);
  const [videoProviderConfigured, setVideoProviderConfigured] = useState(false);

  useEffect(() => {
    fetch('/api/ai/providers-status')
      .then(res => res.json())
      .then(data => {
        if (data.video) {
          setVideoProviderConfigured(data.video.configured);
        }
      })
      .catch(() => {});
  }, []);

  const creditCost = activeTab === 'render_pipeline' ? 100 : 25;

  const handleGenerateScriptOrStoryboard = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a video topic or concept.', 'error');
      return;
    }

    if (credits && credits.balance < creditCost) {
      showToast(`Insufficient credits. Required: ${creditCost}`, 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const toolName = activeTab === 'script_planner' ? 'Short Video Script Planner' : 'Video Storyboard Breakdown';
      
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          studio: 'video',
          tool: toolName,
          prompt,
          creditCost,
          parameters: {
            platform,
            duration,
            voiceTone,
            format: 'Structured visual cues + Voiceover narration'
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Generation failed', 'error');
      } else {
        const newJob: VideoJob = {
          id: 'job_' + Date.now(),
          title: prompt.slice(0, 45) + '...',
          prompt,
          type: activeTab === 'script_planner' ? 'Reels / Shorts Script' : 'Storyboard Scene Breakdown',
          status: 'completed',
          progress: 100,
          output: data.output,
          createdAt: new Date().toISOString()
        };

        setJobs(prev => [newJob, ...prev]);
        setSelectedJob(newJob);
        refreshCredits();
        showToast(`Video plan generated! ${creditCost} credits deducted.`, 'success');
      }
    } catch (e: any) {
      showToast(e.message || 'Generation failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Video className="w-4 h-4" />
            <span>Studio 3 of 7</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Video Studio</h1>
          <p className="text-slate-400 text-sm mt-1">
            Reels & Shorts production, scene-by-scene storyboards, voiceover script generation, and render queues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101625] border border-[#1E293B] text-xs text-slate-300">
            <Coins className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Plan Cost:</span>
            <span className="font-bold text-white">{creditCost} credits</span>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-[#1E293B] mb-6 gap-2">
        <button
          onClick={() => setActiveTab('script_planner')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'script_planner'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Reels & Shorts Script Planner
        </button>
        <button
          onClick={() => setActiveTab('storyboard')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'storyboard'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Scene-by-Scene Storyboard Generator
        </button>
        <button
          onClick={() => setActiveTab('render_pipeline')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 ${
            activeTab === 'render_pipeline'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          External Video Render Pipeline
        </button>
      </div>

      {activeTab === 'render_pipeline' ? (
        /* Video Provider Status & Setup Information (per Section 6 & 18 requirements) */
        <div className="p-8 rounded-2xl bg-[#101625] border border-[#1E293B] text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Clapperboard className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-xs font-bold text-amber-300 uppercase tracking-wider">
              Setup Required for Heavy Video Synthesis
            </span>
            <h2 className="text-xl font-bold text-white mt-3">External Video Compute Provider Status</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
              In accordance with NEXORA AI security and transparency guidelines, video rendering requires a configured high-compute worker pipeline (<code className="text-amber-300">VIDEO_PROVIDER_API_KEY</code>). Video scripts, scene storyboards, and prompts operate live using Gemini 3.8 Flash.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080B14] border border-[#1E293B] text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="font-semibold text-white">How to connect external video rendering:</div>
            <p className="text-slate-400">1. Supply an approved video generation API provider key in <code className="text-purple-300">.env</code>.</p>
            <p className="text-slate-400">2. Configure webhook callback endpoint in Admin Settings.</p>
            <p className="text-slate-400">3. Activate asynchronous video job workers.</p>
          </div>

          <button
            onClick={() => setActiveTab('script_planner')}
            className="px-6 py-2.5 rounded-xl bg-[#131C2D] border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-950/20"
          >
            Switch to Live Script & Storyboard Planner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] space-y-4 shadow-xl">
              <div>
                <label className="text-xs font-bold text-white block mb-1.5">Video Concept / Brief *</label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g. 5 SaaS growth hacks that cost zero dollars to scale from $0 to $10k MRR..."
                  className="w-full p-3 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Target Format</label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option>YouTube Shorts & Reels (9:16)</option>
                    <option>YouTube Long Form (16:9)</option>
                    <option>TikTok Fast Paced (9:16)</option>
                    <option>LinkedIn Square Promo (1:1)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option>30-60 Seconds (High Retention)</option>
                    <option>60-90 Seconds (Deep Hook)</option>
                    <option>2-3 Minutes (Detailed Tutorial)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">Voiceover Tone</label>
                <select
                  value={voiceTone}
                  onChange={e => setVoiceTone(e.target.value)}
                  className="w-full p-2 rounded-xl bg-[#080B14] border border-[#1E293B] text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option>Energetic & Engaging</option>
                  <option>Calm & Authoritative</option>
                  <option>Dramatic & Cinematic</option>
                  <option>Friendly Conversational</option>
                </select>
              </div>

              <button
                onClick={handleGenerateScriptOrStoryboard}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-[#8B5CF6] text-white hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Orchestrating Video Breakdown...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Video Plan ({creditCost} credits)</span>
                  </>
                )}
              </button>
            </div>

            {/* Asynchronous Queue / Job List */}
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Video Job History</h3>
              <div className="space-y-2">
                {jobs.map(j => (
                  <button
                    key={j.id}
                    onClick={() => setSelectedJob(j)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedJob?.id === j.id
                        ? 'bg-[#131C2D] border-amber-400/50'
                        : 'bg-[#080B14] border-[#1E293B] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white truncate max-w-[200px]">{j.title}</span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{j.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Script / Storyboard Viewer (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl min-h-[520px] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {selectedJob?.type || 'Video Plan Output'}
                </span>
                {selectedJob?.output && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedJob.output || '');
                      showToast('Copied video plan to clipboard!', 'success');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131C2D] border border-[#1E293B] text-xs text-slate-300 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Plan</span>
                  </button>
                )}
              </div>

              <div className="flex-1">
                {selectedJob?.output ? (
                  <textarea
                    value={selectedJob.output}
                    readOnly
                    className="w-full h-full min-h-[440px] p-4 text-xs font-mono leading-relaxed rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <FileVideo className="w-10 h-10 mb-2" />
                    <p className="text-xs">No video plan selected</p>
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
