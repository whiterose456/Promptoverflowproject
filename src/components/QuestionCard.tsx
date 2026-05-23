/*
 * QuestionCard Component - Reusable display for community prompts
 * 
 * Lead Developer: Pujolaras
 * UI/Design Support: Farrel
 * 
 * Features:
 * - Display questions with metadata (author, date, upvotes)
 * - Allow users to vote and answer
 * - Show expandable answer threads
 * - Copy prompts with one click
 * - Enable admin moderation (if needed)
 * 
 * Pujolaras built the core component logic and interaction patterns.
 * Farrel refined the UI/UX design and visual presentation.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Search,
  PenLine,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionCardProps {
  question: Question;
  onTagClick?: (tag: string) => void;
  onEditClick?: (q: Question) => void;
  onDeleteClick?: (id: string) => void;
  showAdminControls?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onTagClick, 
  onEditClick, 
  onDeleteClick, 
  showAdminControls = false 
}) => {
  const { currentUser, voteQuestion, addAnswer, deleteAnswer } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [copied, setCopied] = useState(false);

  // Format date in readable format - makes content feel more human and current
  const parsedDate = new Date(question.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const hasUpvoted = currentUser && question.votedUsers?.[currentUser.id] === 'up';
  const hasDownvoted = currentUser && question.votedUsers?.[currentUser.id] === 'down';

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(question.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleVote = (e: React.MouseEvent, direction: 'up' | 'down') => {
    e.stopPropagation();
    if (!currentUser) {
      alert('You must be logged in to vote on prompts!');
      return;
    }
    voteQuestion(question.id, direction);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to contribute an answer!');
      return;
    }
    if (!answerContent.trim()) return;

    addAnswer(question.id, answerContent.trim());
    setAnswerContent('');
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all duration-300 shadow-xl flex flex-col overflow-hidden">
      
      {/* Top Main Section */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex gap-4 cursor-pointer select-none"
      >
        {/* Voting Sidebar */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 self-start bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/80">
          <button
            onClick={(e) => handleVote(e, 'up')}
            className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
              hasUpvoted ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            <ThumbsUp className="w-4 h-4 fill-current opacity-80" />
          </button>
          
          <span className={`text-xs font-bold leading-none ${
            question.votes > 0 ? 'text-emerald-400' : question.votes < 0 ? 'text-rose-400' : 'text-slate-400'
          }`}>
            {question.votes}
          </span>

          <button
            onClick={(e) => handleVote(e, 'down')}
            className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
              hasDownvoted ? 'text-rose-400' : 'text-slate-500'
            }`}
          >
            <ThumbsDown className="w-4 h-4 fill-current opacity-80" />
          </button>
        </div>

        {/* Question Details */}
        <div className="flex-1 min-w-0">
          {/* Metadata of Author */}
          <div className="flex items-center gap-2.5 text-xs text-slate-500 mb-2">
            <img
              src={question.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt={question.authorName}
              className="w-5 h-5 rounded-full object-cover border border-slate-800"
            />
            <span className="font-semibold text-slate-300 hover:underline">
              {question.authorName}
            </span>
            <span>•</span>
            <span>{parsedDate}</span>
          </div>

          <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors tracking-tight leading-snug mb-2">
            {question.title}
          </h3>

          <p className="text-sm text-slate-450 line-clamp-2 leading-relaxed mb-4">
            {question.description}
          </p>

          {/* Bottom stats and tags */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/40">
            {/* Tags list */}
            <div className="flex flex-wrap gap-1.5">
              {question.tags.map(tag => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTagClick) onTagClick(tag);
                  }}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-950/20 text-blue-400 hover:bg-blue-900/40 border border-blue-900/30 transition-all cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Answers count and expansion trigger */}
            <div className="flex items-center gap-4 text-xs text-slate-450 self-end">
              <div className="flex items-center gap-1.5 bg-slate-950/30 px-2 py-1 rounded border border-slate-800/80">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-300">{question.answers.length}</span>
                <span className="text-slate-500">answers</span>
              </div>

              <div className="text-blue-400 font-semibold flex items-center gap-1">
                <span>{isExpanded ? 'Collapse' : 'View Prompt & Answers'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details and Answers using Framer Motion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-slate-800 bg-slate-950/50"
          >
            <div className="p-5 flex flex-col gap-6">
              
              {/* Detailed Explanation */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Explanation / Context</h4>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
                  {question.content}
                </p>
              </div>

              {/* Terminal-themed Prompt Text Container */}
              <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-[#0d1527]">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-slate-500 ml-2">PROMPT_ENGINEER_SHELL.txt</span>
                  </div>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-blue-400 bg-slate-950/60 hover:bg-slate-950/90 py-1 px-2.5 rounded-md border border-slate-800 transition-all cursor-pointer select-none"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 max-h-80 overflow-y-auto font-mono text-xs text-blue-300/90 leading-relaxed whitespace-pre-wrap select-text scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {question.promptText}
                </div>
              </div>

              {/* Author Specific Actions */}
              {(showAdminControls || (currentUser && question.authorId === currentUser.id)) && (
                <div className="flex items-center justify-end gap-2 border-t border-slate-800/60 pt-4">
                  {onEditClick && currentUser && question.authorId === currentUser.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(question);
                      }}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      <PenLine className="w-3.5 h-3.5" />
                      <span>Edit Prompt</span>
                    </button>
                  )}
                  {onDeleteClick && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you absolutely sure you want to delete this prompt? This action cannot be undone.')) {
                          onDeleteClick(question.id);
                        }
                      }}
                      className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/10 border border-rose-900/30 px-3.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Prompt</span>
                    </button>
                  )}
                </div>
              )}

              {/* Answers Segment */}
              <div className="border-t border-slate-800 pt-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Answers & Alternatives ({question.answers.length})
                </h4>

                <div className="flex flex-col gap-4">
                  {question.answers.map(ans => (
                    <div 
                      key={ans.id} 
                      className="p-4 bg-slate-900/20 border border-slate-800/60 rounded-xl flex gap-3.5 relative hover:border-slate-800 transition-all"
                    >
                      <img
                        src={ans.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                        alt={ans.authorName}
                        className="w-8 h-8 rounded-full border border-slate-800 object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-200">{ans.authorName}</span>
                            <span className="text-[10px] text-slate-500">@{ans.authorUsername}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {new Date(ans.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {ans.content}
                        </p>

                        {/* Admin delete answer control */}
                        {(currentUser?.role === 'admin') && (
                          <button
                            onClick={() => {
                              if (confirm('Delete this answer?')) {
                                deleteAnswer(question.id, ans.id);
                              }
                            }}
                            className="absolute bottom-2 right-3 text-xs text-rose-500 hover:text-rose-400 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Submit an Answer */}
                  {currentUser ? (
                    <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-3 mt-2">
                      <div className="text-xs font-bold text-slate-300">Contribute Answer</div>
                      <textarea
                        rows={3}
                        placeholder="Share your prompt adjustment, instructions suggestion, or model parameters config..."
                        value={answerContent}
                        onChange={(e) => setAnswerContent(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                        required
                      />
                      <button
                        type="submit"
                        className="self-end bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer transition-colors"
                      >
                        Submit Response
                      </button>
                    </form>
                  ) : (
                    <p className="text-xs text-slate-500 bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-center mt-2">
                      You must be logged in to contribute responses.
                    </p>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionCard;
