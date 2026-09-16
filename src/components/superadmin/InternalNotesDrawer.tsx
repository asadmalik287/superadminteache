import React, { useState } from 'react';
import { X, Plus, MessageSquare, Tag, UserCheck, Calendar, Lock } from 'lucide-react';
import { InternalNote, Company } from '../../types';

interface InternalNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  notes: InternalNote[];
  onAddNote: (note: Omit<InternalNote, 'id' | 'createdAt'>) => void;
  currentUser: { name: string; role: 'Platform Owner' | 'Operations Specialist' | 'HR Consultant' | 'Support Rep' };
}

export const InternalNotesDrawer: React.FC<InternalNotesDrawerProps> = ({
  isOpen,
  onClose,
  company,
  notes,
  onAddNote,
  currentUser,
}) => {
  const [newContent, setNewContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<InternalNote['category']>('Onboarding Help');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen || !company) return null;

  const companyNotes = notes.filter((n) => n.companyId === company.id);
  const filteredNotes = filterCategory === 'all' 
    ? companyNotes 
    : companyNotes.filter((n) => n.category === filterCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddNote({
      companyId: company.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      category: selectedCategory,
      content: newContent.trim(),
    });

    setNewContent('');
  };

  const getCategoryColor = (cat: InternalNote['category']) => {
    switch (cat) {
      case 'Onboarding Help':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Payroll Setup':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'HR Consulting':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Poster Dispatch':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Billing & Cap':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div 
      id="internal-notes-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-xl bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200 border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-900 text-white">
                <Lock className="w-3 h-3 text-amber-400" />
                Internal Teache Team Only
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {company.id}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Internal Ops Notes: {company.name}
            </h3>
            <p className="text-xs text-slate-500">
              Activity & action records for internal staff performance tracking (never visible to client).
            </p>
          </div>
          <button
            id="close-internal-notes-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-slate-600">
            Filter by Category:
          </span>
          <select
            id="filter-category-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-200 rounded px-2.5 py-1 text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Categories ({companyNotes.length})</option>
            <option value="Onboarding Help">Onboarding Help</option>
            <option value="Payroll Setup">Payroll Setup</option>
            <option value="Poster Dispatch">Poster Dispatch</option>
            <option value="HR Consulting">HR Consulting</option>
            <option value="Billing & Cap">Billing & Cap</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Notes Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/60">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">No internal notes for this category yet.</p>
              <p className="text-xs text-slate-500 mt-1">Log internal actions taken on this company's profile below.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                      {note.authorName}
                    </span>
                    <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                      {note.authorRole}
                    </span>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {note.createdAt}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: {note.id}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              Log Internal Action / Performance Note
            </span>
            <div className="flex items-center gap-2">
              <Tag className="w-3 h-3 text-slate-400" />
              <select
                id="new-note-category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as InternalNote['category'])}
                className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-700 bg-slate-50 font-medium"
              >
                <option value="Onboarding Help">Onboarding Help</option>
                <option value="Payroll Setup">Payroll Setup</option>
                <option value="Poster Dispatch">Poster Dispatch</option>
                <option value="HR Consulting">HR Consulting</option>
                <option value="Billing & Cap">Billing & Cap</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <textarea
            id="internal-note-content-input"
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={`Log what you did for ${company.name} (e.g., reviewed payroll records, assisted with Everee setup, phone consultation notes)...`}
            className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-slate-800"
          />

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Logging as: <strong className="text-slate-600">{currentUser.name}</strong> ({currentUser.role})
            </span>
            <button
              id="save-internal-note-btn"
              type="submit"
              disabled={!newContent.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
