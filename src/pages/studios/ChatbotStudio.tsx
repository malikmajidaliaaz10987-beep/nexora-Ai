/**
 * NEXORA AI — AI Chatbot Studio (Studio 5)
 * Custom AI Chatbot builder with knowledge base grounding,
 * real-time simulator, embeddable widget code generator, and lead capture.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Chatbot } from '../../types';
import { 
  Bot, 
  Sparkles, 
  Plus, 
  Send, 
  Code, 
  Database, 
  Settings2, 
  Copy, 
  Users, 
  MessageSquare, 
  Check, 
  Coins,
  ShieldCheck,
  Headphones
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  chatbot_id: string;
  title: string;
  content: string;
  type: string;
}

export const ChatbotStudio: React.FC = () => {
  const { user, refreshCredits } = useAuth();
  const { showToast } = useToast();

  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selectedBot, setSelectedBot] = useState<Chatbot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bot creation modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [botName, setBotName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are an expert customer concierge for NEXORA AI. Answer questions concisely and politely based on our knowledge base.');
  const [welcomeMessage, setWelcomeMessage] = useState('Hello! I am your AI assistant. How can I help you today?');
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');

  // Knowledge base state
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [kbTitle, setKbTitle] = useState('');
  const [kbContent, setKbContent] = useState('');

  // Simulator chat state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const fetchChatbots = async () => {
    try {
      const res = await fetch('/api/chatbots', {
        headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChatbots(data.chatbots || []);
        if (data.chatbots && data.chatbots.length > 0 && !selectedBot) {
          setSelectedBot(data.chatbots[0]);
          setMessages([
            { sender: 'bot', text: data.chatbots[0].welcome_message }
          ]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbots();
  }, []);

  const handleSelectBot = (bot: Chatbot) => {
    setSelectedBot(bot);
    setMessages([
      { sender: 'bot', text: bot.welcome_message }
    ]);
  };

  const handleCreateBot = async () => {
    if (!botName.trim()) {
      showToast('Please provide a chatbot name.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/chatbots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          name: botName,
          systemPrompt,
          welcomeMessage,
          primaryColor
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Chatbot "${botName}" created!`, 'success');
        setShowCreateModal(false);
        setBotName('');
        await fetchChatbots();
        if (data.chatbot) {
          handleSelectBot(data.chatbot);
        }
      }
    } catch (e) {
      showToast('Failed to create chatbot', 'error');
    }
  };

  const handleAddKnowledge = async () => {
    if (!selectedBot || !kbTitle.trim() || !kbContent.trim()) {
      showToast('Knowledge title and content required.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/chatbots/${selectedBot.id}/knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          title: kbTitle,
          content: kbContent,
          type: 'faq'
        })
      });

      if (res.ok) {
        showToast('Knowledge item added to chatbot context.', 'success');
        setShowKnowledgeModal(false);
        setKbTitle('');
        setKbContent('');
        await fetchChatbots();
      }
    } catch (e) {
      showToast('Failed to add knowledge item', 'error');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedBot || !inputMessage.trim() || isSending) return;

    const userText = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsSending(true);

    try {
      const res = await fetch(`/api/chatbots/${selectedBot.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
        refreshCredits();
      }
    } catch (e) {
      showToast('Error getting chatbot response', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const embedCodeSnippet = selectedBot ? `<script 
  src="https://app.nexora.ai/widget.js" 
  data-nexora-bot-id="${selectedBot.id}" 
  data-theme="${selectedBot.primary_color}" 
  async>
</script>` : '';

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedEmbed(true);
    showToast('Embed widget script copied to clipboard!', 'success');
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1">
            <Bot className="w-4 h-4" />
            <span>Studio 5 of 7</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Chatbot Studio</h1>
          <p className="text-slate-400 text-sm mt-1">
            Deploy custom knowledge-grounded AI concierges, collect qualified leads, and embed interactive widgets.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-[#8B5CF6] text-white font-bold text-xs hover:opacity-95 shadow-lg shadow-pink-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Chatbot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Bots List & Configuration (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Your Chatbots</h3>
            <div className="space-y-2">
              {chatbots.map(bot => (
                <button
                  key={bot.id}
                  onClick={() => handleSelectBot(bot)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedBot?.id === bot.id
                      ? 'bg-[#131C2D] border-pink-500/50 shadow-inner'
                      : 'bg-[#080B14] border-[#1E293B] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs"
                      style={{ backgroundColor: bot.primary_color }}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{bot.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {bot.knowledgeCount || 0} FAQs / Docs • {bot.leads_collected} leads
                      </div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </button>
              ))}
            </div>
          </div>

          {selectedBot && (
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Grounding Knowledge</span>
                <button
                  onClick={() => setShowKnowledgeModal(true)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#131C2D] border border-pink-500/30 text-pink-300 font-medium hover:bg-pink-950/20"
                >
                  + Add FAQ / Document
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B] text-xs space-y-1">
                <div className="text-slate-400 font-medium">System Persona:</div>
                <div className="text-slate-300 line-clamp-3 italic">"{selectedBot.system_prompt}"</div>
              </div>

              {/* Embed Widget Generator */}
              <div className="pt-2">
                <label className="text-xs font-bold text-white block mb-1.5 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Embeddable Website Snippet</span>
                </label>
                <div className="relative">
                  <pre className="p-3 rounded-xl bg-[#080B14] border border-[#1E293B] text-[10px] font-mono text-slate-300 overflow-x-auto">
                    {embedCodeSnippet}
                  </pre>
                  <button
                    onClick={copyEmbedCode}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#131C2D] border border-[#1E293B] text-slate-300 hover:text-white"
                    title="Copy Embed Code"
                  >
                    {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Human Handover & Lead Settings */}
              <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Headphones className="w-3.5 h-3.5 text-pink-400" />
                  Human Handover Active
                </span>
                <span className="text-emerald-400 font-semibold">Ready</span>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Interactive Chat Simulator (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedBot ? (
            <div className="p-5 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-xl flex flex-col h-[580px]">
              
              {/* Simulator Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedBot.primary_color }}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{selectedBot.name} — Live Simulator</h3>
                    <p className="text-[10px] text-slate-400">Testing responses grounded in your knowledge base</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300 font-medium">
                  Active Endpoint
                </span>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-pink-600 to-[#8B5CF6] text-white rounded-tr-none'
                          : 'bg-[#131C2D] border border-[#1E293B] text-slate-200 rounded-tl-none whitespace-pre-wrap'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-[#131C2D] border border-[#1E293B] text-xs text-slate-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" />
                      <span>Synthesizing answer from knowledge base...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="pt-3 border-t border-[#1E293B] flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Test chatbot: Ask a question about your business or services..."
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputMessage.trim()}
                  className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs disabled:opacity-40 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500">
              <Bot className="w-10 h-10 mb-2" />
              <p className="text-xs">No chatbot selected</p>
            </div>
          )}
        </div>

      </div>

      {/* Create Chatbot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create New AI Chatbot</h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Bot Name *</label>
              <input
                type="text"
                value={botName}
                onChange={e => setBotName(e.target.value)}
                placeholder="e.g. Acme SaaS Concierge"
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">System Persona & Tone</label>
              <textarea
                rows={3}
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Initial Welcome Greeting</label>
              <input
                type="text"
                value={welcomeMessage}
                onChange={e => setWelcomeMessage(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Brand Accent Color</label>
              <div className="flex gap-2">
                {['#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPrimaryColor(c)}
                    className={`w-8 h-8 rounded-xl border-2 transition-transform ${
                      primaryColor === c ? 'scale-110 border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1E293B]">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBot}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white"
              >
                Create Bot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Knowledge Modal */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#101625] border border-[#1E293B] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Grounding Knowledge</h3>
            <p className="text-xs text-slate-400">
              Inject factual information (pricing, refund rules, company policies) so your chatbot answers accurately.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Knowledge Title / Question *</label>
              <input
                type="text"
                value={kbTitle}
                onChange={e => setKbTitle(e.target.value)}
                placeholder="e.g. What is the cancellation policy?"
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Detailed Knowledge Content *</label>
              <textarea
                rows={4}
                value={kbContent}
                onChange={e => setKbContent(e.target.value)}
                placeholder="e.g. Subscriptions can be canceled at any time from the Billing page with zero penalties. Unused credits remain valid until the period ends."
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1E293B]">
              <button
                onClick={() => setShowKnowledgeModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddKnowledge}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white"
              >
                Save Knowledge
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
