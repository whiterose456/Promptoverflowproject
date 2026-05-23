/*
 * User Dashboard - Personal hub for each PromptOverflow user
 * 
 * Layout & UI: Farrel
 * Feature Logic: Ren
 * Component Integration: Pujolaras
 * 
 * Features:
 * - Overview tab: user stats and recent activity
 * - Prompts tab: manage personal questions and prompts
 * - Notifications tab: track community interactions
 * - Settings tab: user profile management
 * 
 * Farrel designed the dashboard layout and tabs.
 * Ren built the underlying logic for each feature.
 * Pujolaras integrated all components together.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';
import QuestionForm from '../components/QuestionForm';
import { Question } from '../types';
import { 
  BarChart2, 
  Settings, 
  Bell, 
  Database, 
  Trophy, 
  Calendar, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  User, 
  AtSign, 
  Mail, 
  Check, 
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function UserDashboard() {
  const { 
    currentUser, 
    questions, 
    notifications, 
    deleteQuestion, 
    markNotificationRead, 
    markAllNotificationsRead,
    addNotification,
    users
  } = useApp();
  const navigate = useNavigate();

  // Tab management - allows users to switch between different views
  // Our team designed this to keep all user info organized and accessible
  const [activeTab, setActiveTab] = useState<'overview' | 'prompts' | 'notifications' | 'settings'>('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Profile Settings Form States
  const [profileName, setProfileName] = useState('');
  const [profileUsername, setProfileUsername] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setProfileName(currentUser.name);
      setProfileUsername(currentUser.username);
      setProfileAvatar(currentUser.avatar || '');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Derive stats
  const myQuestions = questions.filter(q => q.authorId === currentUser.id);
  const totalVotes = myQuestions.reduce((sum, q) => sum + q.votes, 0);
  const totalAnswers = myQuestions.reduce((sum, q) => sum + q.answers.length, 0);

  // Unread notification count
  const myNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleEditClick = (q: Question) => {
    setEditingQuestion(q);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingQuestion(null);
    setIsFormOpen(true);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (!profileName.trim() || !profileUsername.trim()) {
      setSettingsError('Name and Username are required.');
      return;
    }

    // Check if username already taken by another user
    const userConflict = users.find(u => u.id !== currentUser.id && u.username.toLowerCase() === profileUsername.trim().toLowerCase());
    if (userConflict) {
      setSettingsError('Username handle is already taken.');
      return;
    }

    // Update the local instance in AppContext (since currentUser is stored in storage too)
    currentUser.name = profileName.trim();
    currentUser.username = profileUsername.trim();
    currentUser.avatar = profileAvatar.trim();

    // Persist to trigger Context state synchronize
    localStorage.setItem('promptoverflow_current_user', JSON.stringify(currentUser));
    
    // Also update current author info inside existing database questions for consistency
    questions.forEach(q => {
      if (q.authorId === currentUser.id) {
        q.authorName = currentUser.name;
        q.authorUsername = currentUser.username;
        q.authorAvatar = currentUser.avatar;
      }
    });
    localStorage.setItem('promptoverflow_questions', JSON.stringify(questions));

    setSettingsSuccess('Workspace agent profile synchronized successfully!');
    
    // Auto-timeout success notice
    setTimeout(() => {
      setSettingsSuccess('');
    }, 3000);
  };

  return (
    <div className="flex-1 min-h-screen text-slate-100 p-6 bg-[#070b16] select-none">
      
      {/* Header Profile Area */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900/60 to-slate-900/20 border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl border border-slate-700 object-cover shadow-lg shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">{currentUser.name}</h1>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-600/10 text-blue-400 py-0.5 px-2 rounded border border-blue-950">
                PROMPT ARCHITECT
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">@{currentUser.username} • {currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateClick}
            className="bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] active:scale-98 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Prompt</span>
          </button>
        </div>
      </div>

      {/* Dashboard Sub-tabs Navigation */}
      <div className="flex border-b border-slate-800/60 gap-1.5 mb-8 overflow-x-auto select-none custom-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2.5 border-b-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'prompts'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>My Prompts ({myQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 border-b-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all relative ${
            activeTab === 'notifications'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alert Logs</span>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 border-b-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === 'settings'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Workspace Engine</span>
        </button>
      </div>

      {/* TABS INNER PAGES */}
      <div>
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Stats board Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 shrink-0">
                  <Database className="w-24 h-24 text-blue-500" />
                </div>
                <div className="p-3 bg-blue-950/40 border border-blue-900/30 rounded-xl text-blue-400 shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{myQuestions.length}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Shared Prompts</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 shrink-0">
                  <Trophy className="w-24 h-24 text-emerald-500" />
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/30 rounded-xl text-emerald-400 shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{totalVotes}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Votes Gathered</p>
                </div>
              </div>

              <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 shrink-0">
                  <Bell className="w-24 h-24 text-blue-500" />
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 shrink-0">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{myNotifications.length}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Platform Alerts Trace</p>
                </div>
              </div>

            </div>

            {/* Recent Notifications segment inside overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left double column: Profile Quicklook and Recent activity */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/20 border border-slate-800/60 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>Prompt Design Insights</span>
                  </h3>
                  <p className="text-xs text-slate-450 leading-relaxed">
                    Welcome to your Prompt Engineering workbench. Within this workspace, you can manage your uploaded instruction blocks, monitor responses contributed by other prompters, and fine-tune your templates anytime. 
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    Prompting Rule #1: Place delimiters around instructions (e.g. triple quotes, backticks or XML brackets) to ensure systems isolate actual prompts from static documents cleanly and safely.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Recently shared Prompts ({Math.min(myQuestions.length, 2)})
                  </h3>
                  {myQuestions.length === 0 ? (
                    <div className="p-10 text-center text-xs text-slate-500 bg-slate-900/10 border border-slate-800/50 border-dashed rounded-xl">
                      You haven't posted any prompt template yet. Ready to submit?
                    </div>
                  ) : (
                    myQuestions.slice(0, 2).map(q => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        onEditClick={handleEditClick}
                        onDeleteClick={deleteQuestion}
                        showAdminControls={true}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Right Single column: Pending Alerts */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col gap-4 h-fit">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Recent Activity</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                    >
                      Clear all ({unreadCount})
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                  {myNotifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No notifications history found.</p>
                  ) : (
                    myNotifications.slice(0, 4).map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                          notif.isRead 
                            ? 'bg-slate-950/20 border-slate-800/30 opacity-60' 
                            : 'bg-blue-950/10 border-blue-900/20 hover:bg-blue-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-200">{notif.title}</span>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{notif.content}</p>
                        <span className="text-[9px] text-slate-500 mt-0.5">
                          {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: MY QUESTIONS (FULL CRUD) */}
        {activeTab === 'prompts' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Workspace Database ({myQuestions.length} prompts)
              </h3>
              <button
                onClick={handleCreateClick}
                className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-900/40 text-xs font-bold py-2 px-3.5 rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Prompt</span>
              </button>
            </div>

            {myQuestions.length === 0 ? (
              <div className="p-16 border-2 border-dashed border-slate-800/60 rounded-2xl flex flex-col items-center justify-center text-center">
                <Database className="w-8 h-8 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-slate-400">Database is empty</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1 mb-6">
                  You haven't added any optimized prompt blocks to your repository yet. Let's make your first!
                </p>
                <button
                  onClick={handleCreateClick}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer transition-colors"
                >
                  Create Prompt
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {myQuestions.map(q => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onEditClick={handleEditClick}
                    onDeleteClick={deleteQuestion}
                    showAdminControls={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: ALERT LOGS notifications */}
        {activeTab === 'notifications' && (
          <div className="flex flex-col gap-4 animate-fade-in max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Platform Activity Traces ({myNotifications.length} items)
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                >
                  Clear all unread badges
                </button>
              )}
            </div>

            {myNotifications.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 bg-slate-900/10 border border-slate-800/40 rounded-2xl">
                No systemic actions or feedback logged yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {myNotifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition-all ${
                      notif.isRead 
                        ? 'bg-slate-950/20 border-slate-800/40 opacity-60' 
                        : 'bg-blue-950/20 border-blue-900/20 hover:bg-blue-950/30'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 self-start shrink-0">
                      <Bell className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-200">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="bg-blue-550/30 text-blue-405 font-bold text-[8px] tracking-wider uppercase py-0.5 px-1.5 rounded-full border border-blue-900/40">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed select-text">{notif.content}</p>
                      <span className="text-[10px] text-slate-550 inline-block mt-2">
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: WORKSPACE ENGINE settings */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 max-w-2xl mx-auto animate-fade-in">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 pb-2.5 border-b border-slate-800/60">
              Workspace Profile Fine-Tuner
            </h3>

            {settingsError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/35 text-rose-400 text-xs flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{settingsError}</span>
              </div>
            )}

            {settingsSuccess && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/35 text-emerald-400 text-xs flex gap-2 items-center">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Display Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                      required
                    />
                    <User className="w-4 h-4 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Username handle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Unique Handle</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileUsername}
                      onChange={(e) => setProfileUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                      required
                    />
                    <AtSign className="w-4 h-4 text-slate-550 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

              </div>

              {/* Read Only Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Email (Immutable connection)</label>
                <div className="relative">
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full bg-slate-950/40 border border-slate-800/40 text-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-500 cursor-not-allowed select-none"
                  />
                  <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Avatar Url config */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Avatar Image URL</label>
                <div className="flex gap-4 items-center">
                  <img
                    src={profileAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl border border-slate-700 object-cover shadow-inner shrink-0"
                  />
                  <input
                    type="url"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-550/60 focus:ring-1 focus:ring-blue-550/30 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800/60 mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                >
                  Synchronize Workspace
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* Shared Create/Edit Prompt Form Dialog */}
      <QuestionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingQuestion(null);
        }}
        questionToEdit={editingQuestion}
      />
    </div>
  );
}
