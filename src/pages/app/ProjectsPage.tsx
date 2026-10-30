/**
 * NEXORA AI — Projects & Workspace Files (Page 17)
 * Project directory, tag filters, file export, and management.
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, Project } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Download, 
  Search, 
  Tag, 
  Calendar, 
  Sparkles,
  X,
  FileText
} from 'lucide-react';

export const ProjectsPage: React.FC<{ setActivePage: (p: ActivePage) => void }> = ({ setActivePage }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Marketing');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newTitle.trim()) {
      showToast('Please enter a project title.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexora_token')}`
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          tags: [newCategory, 'Active']
        })
      });

      if (res.ok) {
        showToast('Project created successfully!', 'success');
        setShowCreateModal(false);
        setNewTitle('');
        setNewDesc('');
        fetchProjects();
      }
    } catch (e) {
      showToast('Failed to create project', 'error');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('nexora_token')}` }
      });
      if (res.ok) {
        showToast('Project deleted', 'info');
        if (selectedProject?.id === id) setSelectedProject(null);
        fetchProjects();
      }
    } catch (e) {
      showToast('Failed to delete project', 'error');
    }
  };

  const categories = ['All', 'Marketing', 'Business', 'Writing', 'Design'];

  const filtered = projects.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize outputs, documents, and marketing briefs generated across all 7 AI studios.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-[#101625] border border-[#1E293B] text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#101625] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(proj => (
          <div
            key={proj.id}
            onClick={() => setSelectedProject(proj)}
            className="cursor-pointer p-5 rounded-2xl bg-[#101625] border border-[#1E293B] hover:border-[#8B5CF6]/50 transition-all flex flex-col justify-between shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-purple-300 px-2 py-0.5 rounded bg-[#131C2D] border border-purple-500/20">
                  {proj.category}
                </span>
                <button
                  onClick={e => handleDelete(proj.id, e)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-[#06B6D4] transition-colors">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {proj.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(proj.created_at).toLocaleDateString()}</span>
              </span>
              <span className="text-purple-400 font-semibold group-hover:underline">
                Open Details →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-bold text-purple-300 px-2 py-0.5 rounded bg-[#131C2D]">
              {selectedProject.category}
            </span>

            <h3 className="text-lg font-bold text-white">{selectedProject.title}</h3>

            <div className="p-4 rounded-xl bg-[#080B14] border border-[#1E293B] text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
              {selectedProject.description}
            </div>

            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-slate-500">Created: {new Date(selectedProject.created_at).toLocaleString()}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedProject.description);
                  showToast('Project content copied to clipboard!', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-[#131C2D] border border-[#1E293B] text-slate-200 hover:text-white"
              >
                Copy Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#101625] border border-[#1E293B] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create New Project</h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Project Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Q4 Growth Marketing Series"
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-slate-200 focus:outline-none"
              >
                <option>Marketing</option>
                <option>Business</option>
                <option>Writing</option>
                <option>Design</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Description / Notes</label>
              <textarea
                rows={4}
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Describe project deliverables or paste text..."
                className="w-full p-2.5 text-xs rounded-xl bg-[#080B14] border border-[#1E293B] text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8B5CF6] hover:bg-purple-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
