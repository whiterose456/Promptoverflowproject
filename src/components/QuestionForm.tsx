/*
 * QuestionForm Component - Modal for creating and editing prompts
 * 
 * UI/Form Design: Farrel
 * Form Logic & Validation: Ren
 * 
 * Handles:
 * - Creating new questions/prompts
 * - Editing existing questions
 * - Validating required fields
 * - Managing tags for categorization
 * 
 * Farrel designed the form layout and user experience.
 * Ren implemented the validation logic and data handling.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { X, Sparkles, AlertCircle, FileText, Code } from 'lucide-react';

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  questionToEdit?: Question | null;
}

export default function QuestionForm({ isOpen, onClose, questionToEdit = null }: QuestionFormProps) {
  const { addQuestion, updateQuestion } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [promptText, setPromptText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');

  // Load question data if editing an existing one
  useEffect(() => {
    if (questionToEdit) {
      setTitle(questionToEdit.title);
      setDescription(questionToEdit.description);
      setContent(questionToEdit.content);
      setPromptText(questionToEdit.promptText);
      setTagsInput(questionToEdit.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setContent('');
      setPromptText('');
      setTagsInput('');
    }
    setError('');
  }, [questionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !content.trim() || !promptText.trim()) {
      setError('Please fill in all the text fields.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && /^[a-z0-9-]+$/.test(tag)); // alphanumeric plus dash

    if (tagsInput.trim() && tags.length === 0) {
      setError('Tags should be comma-separated single words composed of letters, numbers or dashes.');
      return;
    }

    if (questionToEdit) {
      updateQuestion(questionToEdit.id, title.trim(), description.trim(), content.trim(), promptText.trim(), tags);
    } else {
      addQuestion(title.trim(), description.trim(), content.trim(), promptText.trim(), tags);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Dim */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-all"
      />

      {/* Form Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {questionToEdit ? 'Modify Your Shared Prompt' : 'Share a New Prompt Template'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto px-6 py-5 gap-4">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-400 text-xs flex gap-2 items-start shrink-0">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prompt Goal / Question Title</label>
            <input
              type="text"
              placeholder="e.g., How to force JSON output representation in system prompt schemas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
              maxLength={150}
              required
            />
          </div>

          {/* Short Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Challenge Description (Tagline)</label>
            <input
              type="text"
              placeholder="A brief summary showing up in the prompt card. e.g. Struggles with parser hallucinations in LLM system calls."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
              maxLength={250}
              required
            />
          </div>

          {/* Content / Explanation */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Context & Explanation</label>
            </div>
            <textarea
              rows={4}
              placeholder="Describe what models you are testing, the specific prompt drift issues, what you have tried, or context about the workspace parameters."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
              required
            />
          </div>

          {/* Prompt Text / Template */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-slate-500" />
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">The Prompt Text / System Instructions Template</label>
            </div>
            <textarea
              rows={6}
              placeholder="Write the exact prompt or system instruction string here. You can include placeholders like [USER_DOCUMENT] or {{INPUT_TEXT}}."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-[#070d19] font-mono border border-slate-800 rounded-xl p-4 text-xs text-blue-300 placeholder-slate-650 focus:outline-none focus:border-blue-550/60 focus:ring-1 focus:ring-blue-550/30 transition-all duration-300"
              required
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Associated Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., system-prompt, json, chain-of-thought, reasoning"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
            />
            <span className="text-[10px] text-slate-500">
              Only alphanumeric characters and dashes allowed. Use commas to split.
            </span>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60 mt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-5 rounded-xl shadow-lg shadow-blue-500/15 cursor-pointer transition-colors select-none"
            >
              {questionToEdit ? 'Save Changes' : 'Publish Prompt'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
