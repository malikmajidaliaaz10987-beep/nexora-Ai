/**
 * NEXORA AI — Blog & Insights (Page 13)
 * High-value AI productivity, architecture, and prompt engineering articles.
 */

import React, { useState, useEffect } from 'react';
import { BlogPost, ActivePage } from '../../types';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight, 
  X, 
  Share2, 
  Tag 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const BlogPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/blog/posts')
      .then(res => res.json())
      .then(data => {
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101625] border border-[#1E293B] text-xs font-semibold text-[#8B5CF6] mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Engineering & Strategy Insights</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">NEXORA AI Blog</h1>
        <p className="text-slate-400 text-sm mt-3">
          Deep dives into modern autonomous AI pipelines, prompt architecture, deterministic financial calculations, and unified workspaces.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map(post => (
          <article
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="cursor-pointer rounded-3xl bg-[#101625] border border-[#1E293B] hover:border-[#8B5CF6]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#080B14]/85 backdrop-blur-md text-purple-300 border border-[#1E293B]">
                  {post.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.read_time}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#06B6D4] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-[#1E293B]/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
              <span>Read Full Article</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8B5CF6] group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-2xl relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#131C2D]"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider block mb-2">
              {selectedPost.category} • {selectedPost.read_time}
            </span>

            <h2 className="text-2xl font-extrabold text-white leading-tight mb-4">
              {selectedPost.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-400 pb-4 mb-6 border-b border-[#1E293B]">
              <span>By {selectedPost.author}</span>
              <span>•</span>
              <span>Published October 2026</span>
            </div>

            <img
              src={selectedPost.cover_image}
              alt={selectedPost.title}
              className="w-full h-56 object-cover rounded-2xl mb-6 border border-[#1E293B]"
            />

            <div className="prose prose-invert text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed whitespace-pre-wrap">
              {selectedPost.content}
            </div>

            <div className="pt-6 mt-8 border-t border-[#1E293B] flex justify-between items-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Article URL copied!', 'success');
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#131C2D] text-white hover:bg-[#1E293B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
