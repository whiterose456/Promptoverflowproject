/*
 * Feed Page - Heart of PromptOverflow Community
 * 
 * UI/Layout: Farrel
 * Functional Implementation: Ren
 * Component Integration: Pujolaras
 * 
 * Features:
 * - Browse community prompts and questions
 * - Search and filter by keywords and tags
 * - Create new questions
 * - Vote and engage with content
 * 
 * Farrel designed the clean, intuitive layout.
 * Ren implemented the filtering and search logic.
 * Pujolaras integrated the components for seamless functionality.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';
import QuestionForm from '../components/QuestionForm';
import { Search, Tag, Sparkles, FilterX, HelpCircle, Trophy } from 'lucide-react';

export default function Feed() {
  const { questions, currentUser } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Store search and tag filters in URL params for state persistence and sharing
  // This was our team's solution for keeping filter state in the URL for better UX
  const searchQuery = searchParams.get('q') || '';
  const tagQuery = searchParams.get('tag') || '';

  const handleTagSelect = (tag: string) => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    params.tag = tag;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  // Extract all unique tags from questions for tag-based navigation
  // Users can click tags to filter the feed - intuitive way to explore topics
  const uniqueTags = Array.from(
    new Set<string>(questions.flatMap(q => q.tags))
  ).slice(0, 10); // limit to top 10 tags for cleaner UI

  // Filter questions based on search query and selected tag
  // Our team carefully considers search across title, description, content, and prompt text
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = searchQuery 
      ? q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // Allow searching in descriptions and prompt content
        q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // This was important - users should be able to find prompts by their actual text
        q.promptText.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesTag = tagQuery 
      ? q.tags.includes(tagQuery.toLowerCase()) 
      : true;

    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex-1 min-h-screen text-slate-100 flex flex-col lg:flex-row gap-6 p-6 select-none bg-[#070b16]">
      {/* Main Feed Column */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Banner header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-transparent border border-b-2 border-slate-800/80 flex items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 to-transparent blur-3xl" />
          <div className="relative z-10 flex-1">
            <h1 className="text-xl lg:text-3xl font-black text-white tracking-tight leading-none mb-2">
              Prompt Engineered Database
            </h1>
            <p className="text-sm text-slate-400">
              Browse, test, and copy optimized instructions, system system prompt blocks, and chain-of-thought few-shots.
            </p>
          </div>
          {currentUser && currentUser.role !== 'admin' && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] active:scale-98 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/20 transition-all shrink-0 cursor-pointer text-sm"
            >
              Share Prompt
            </button>
          )}
        </div>

        {/* Filters Summary */}
        {(searchQuery || tagQuery) && (
          <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
                    Search: <span className="text-blue-400 font-semibold">"{searchQuery}"</span>
                  </span>
                )}
                {tagQuery && (
                  <span className="px-3 py-1 rounded-lg bg-blue-950/30 border border-blue-900/30 text-xs text-blue-400 font-semibold">
                    #{tagQuery}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between select-none">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Prompt Index ({filteredQuestions.length} of {questions.length})
          </span>
        </div>

        {/* Questions Listing */}
        <div className="flex flex-col gap-4">
          {filteredQuestions.length === 0 ? (
            <div className="p-16 border-2 border-dashed border-slate-800/60 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-4 text-slate-600">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-350">No prompts found</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
                Try loosening your search keywords, exploring other tags, or clear the search parameters.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Reset Feed
              </button>
            </div>
          ) : (
            filteredQuestions.map(q => (
              <QuestionCard
                key={q.id}
                question={q}
                onTagClick={handleTagSelect}
              />
            ))
          )}
        </div>
      </div>

      {/* Visual Workspace Sidebar Column */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        
        {/* Popular Tags Index Card */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Tag className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Popular Channels</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueTags.length === 0 ? (
              <span className="text-xs text-slate-600">No active channels yet.</span>
            ) : (
              uniqueTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                    tag === tagQuery
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500 font-semibold'
                      : 'bg-slate-950/50 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  #{tag}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Prompt Quality Guidelines Banner */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-450">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Architect Guidelines</span>
          </div>
          <ul className="flex flex-col gap-3">
            {[
              { id: 'g1', title: 'Clear Objectives', text: 'Define the strict target persona first.' },
              { id: 'g2', title: 'XML Segmented Context', text: 'Wrap variable documents inside <context> wrappers.' },
              { id: 'g3', title: 'Examples / Few-Shot', text: 'CoT examples increase reasoning precision by up to 10x.' },
              { id: 'g4', title: 'Negative Bounds', text: 'Emphasize what the AI agent is forbidden from attempting.' }
            ].map(item => (
              <li key={item.id} className="flex gap-3 text-xs leading-relaxed">
                <span className="font-extrabold text-blue-400 shrink-0">✓</span>
                <div>
                  <h5 className="font-bold text-slate-300">{item.title}</h5>
                  <p className="text-slate-500 mt-0.5">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Floating Prompt Creation Form */}
      <QuestionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}
