/*
 * Admin Dashboard - Moderation and management panel for PromptOverflow
 * 
 * UI Design: Farrel
 * Access Control & Logic: Ren
 * 
 * Admin Features:
 * - Review all community prompts
 * - Delete inappropriate content
 * - Monitor user accounts
 * - Send notifications and alerts
 * 
 * Farrel designed the admin interface with careful hierarchy.
 * Ren implemented access control and moderation logic
 * to ensure only admins can access these sensitive tools.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Question, User } from '../types';
import QuestionCard from '../components/QuestionCard';
import { 
  ShieldAlert, 
  Users, 
  Database, 
  MessageSquare, 
  Trash2, 
  Eye, 
  Check, 
  Calendar, 
  Settings, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, questions, users, deleteQuestion, addNotification } = useApp();
  const navigate = useNavigate();

  // Tab switching between prompts moderation and user management
  const [activeTab, setActiveTab] = useState<'prompts' | 'users'>('prompts');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Protect admin-only page - redirect if not authorized
  // This was implemented to ensure only admins can access moderation tools
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  // Stats derivation
  const totalPrompts = questions.length;
  const totalUsers = users.length;
  const totalAnswersCount = questions.reduce((sum, q) => sum + q.answers.length, 0);

  const handleDeletePrompt = (id: string) => {
    if (confirm('ADMIN ACTION: Are you sure you want to delete this prompt? This is permanent.')) {
      deleteQuestion(id);
      setSelectedQuestion(null);
    }
  };

  return (
    <div className="flex-1 min-h-screen text-slate-100 p-6 bg-[#070b16] select-none">
      
      {/* Admin Title Panel */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 to-slate-900/40 border border-amber-900/30 flex justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Admin Control Center</span>
              <span className="text-[10px] font-bold tracking-widest bg-amber-500/10 text-amber-500 py-0.5 px-2 rounded border border-amber-950">
                ROOT ACCOUNT
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Platform status, user directory, moderator actions, and contents audit tools.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-950/40 border border-amber-900/30 rounded-xl text-amber-500 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{totalUsers}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Registered Architects</p>
          </div>
        </div>

        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-950/40 border border-blue-900/30 rounded-xl text-blue-400 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{totalPrompts}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Shared Prompt Blocks</p>
          </div>
        </div>

        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-indigo-950/40 border border-indigo-900/30 rounded-xl text-indigo-400 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{totalAnswersCount}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Answers Contributed</p>
          </div>
        </div>

      </div>

      {/* Admin Subtabs Menu */}
      <div className="flex border-b border-slate-800/60 gap-1.5 mb-8 overflow-x-auto select-none custom-scrollbar">
        <button
          onClick={() => {
            setActiveTab('prompts');
            setSelectedQuestion(null);
          }}
          className={`px-4 py-2.5 border-b-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'prompts'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Prompt Submissions Base ({totalPrompts})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('users');
            setSelectedQuestion(null);
          }}
          className={`px-4 py-2.5 border-b-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'users'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Members Directory ({totalUsers})</span>
        </button>
      </div>

      {/* ADMIN TABS ACTION CONTENT */}
      <div>
        
        {/* VIEW: PROMPTS AUDIT TABLE */}
        {activeTab === 'prompts' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Prompts table list left 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-550 uppercase tracking-widest pl-1">
                Submissions Registry ledger
              </h3>

              <div className="bg-slate-900/45 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-slate-555 uppercase tracking-wider select-none">
                        <th className="py-4 px-5">Prompt Proposal</th>
                        <th className="py-4 px-5">Designer</th>
                        <th className="py-4 px-5 text-center">Engagement</th>
                        <th className="py-4 px-5 text-center">Mod Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {questions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-10 text-xs text-slate-500">
                            No prompts currently in index database.
                          </td>
                        </tr>
                      ) : (
                        questions.map(q => (
                          <tr 
                            key={q.id}
                            className={`hover:bg-slate-900/20 transition-colors cursor-pointer ${
                              selectedQuestion?.id === q.id ? 'bg-amber-950/5' : ''
                            }`}
                            onClick={() => setSelectedQuestion(q)}
                          >
                            <td className="py-4 px-5">
                              <div className="font-bold text-slate-200 line-clamp-1">{q.title}</div>
                              <div className="text-[10px] text-slate-550 mt-1 flex gap-2">
                                <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span className="text-blue-500">#{q.tags[0] || 'general'}</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-xs">
                              <div className="font-semibold text-slate-300">{q.authorName}</div>
                              <div className="text-slate-500">@{q.authorUsername}</div>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <div className="flex justify-center gap-3 text-xs">
                                <span className="text-emerald-400 font-bold">{q.votes} votes</span>
                                <span className="text-slate-500 shrink-0">|</span>
                                <span className="text-slate-300 font-medium">{q.answers.length} answers</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <div className="flex items-center justify-center gap-2"  onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setSelectedQuestion(selectedQuestion?.id === q.id ? null : q)}
                                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                  title="Expand view"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePrompt(q.id)}
                                  className="p-1.5 rounded-lg bg-rose-950/10 border border-rose-900/30 text-rose-450 hover:bg-rose-950/20 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Delete prompt"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Expanded details right audit panel */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest pl-1">
                Moderation Preview Inspector
              </h3>
              
              {selectedQuestion ? (
                <div className="animate-fade-in flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-850 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-500/10 text-amber-500 py-0.5 px-2 rounded border border-amber-950">
                        AUDITED ITEM
                      </span>
                      <button
                        onClick={() => handleDeletePrompt(selectedQuestion.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Item</span>
                      </button>
                    </div>
                    
                    <h4 className="text-sm font-bold text-white leading-snug">{selectedQuestion.title}</h4>
                    <span className="text-xs text-slate-500">Submitted by {selectedQuestion.authorName} (@{selectedQuestion.authorUsername})</span>
                  </div>

                  <QuestionCard 
                    question={selectedQuestion}
                    onDeleteClick={handleDeletePrompt}
                    showAdminControls={true}
                  />
                </div>
              ) : (
                <div className="p-10 border-2 border-dashed border-slate-800/50 rounded-2xl text-center text-xs text-slate-550 h-56 flex flex-col items-center justify-center">
                  <Sparkles className="w-5 h-5 text-slate-700 mb-2.5" />
                  <span>Select any prompt row from the registry table ledger to inspect detailed contents, answers, or execute deletions here.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: MEMBERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-4 animate-fade-in max-w-4xl mx-auto">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
              Active Core Platform Users ({users.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(u => (
                <div 
                  key={u.id}
                  className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-center gap-4 hover:border-slate-750 transition-all shadow-md relative"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt={u.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 shadow"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate">{u.name}</span>
                        {u.role === 'admin' && (
                          <span className="text-[8px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-900/40 px-1 rounded">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">@{u.username}</p>
                      <p className="text-[11px] text-slate-605 truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest select-none">
                      ID: {u.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-450 mt-1 flex items-center gap-1">
                      {u.role === 'admin' ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-amber-400">Moderator</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-blue-400">Architect Member</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
