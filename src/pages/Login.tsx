/*
 * Login Page - Secure entry point for PromptOverflow
 * 
 * UI Design: Farrel
 * Auth Logic & Validation: Ren
 * 
 * Features:
 * - Email and password authentication
 * - Quick login for demo users (user and admin accounts)
 * - Redirects to appropriate dashboard based on user role
 * 
 * Farrel designed the clean, accessible login interface.
 * Ren implemented the authentication logic and validation.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, KeyRound, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login, currentUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = login(email, password);
    if (res.success && res.user) {
      setSuccess(true);
      setTimeout(() => {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 800);
    } else {
      setError('Invalid email or password combination.');
    }
  };

  const handleQuickFill = (role: 'user' | 'admin') => {
    if (role === 'user') {
      setEmail('user@promptoverflow.com');
      setPassword('password123');
    } else {
      setEmail('admin@promptoverflow.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#070b16] bg-radial-gradient flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/45 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 relative z-10 shadow-2xl shadow-blue-500/5 transition-all">
        
        {/* Brand / Logo */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center select-none">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight mt-3">
            Prompt<span className="text-blue-500 font-semibold text-xl">Overflow</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">The Q&A Engine for Prompt Architects</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/35 text-rose-450 text-xs flex gap-2 items-center">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/35 text-emerald-400 text-xs flex gap-2 items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Login successful! Loading workspace...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Connection</label>
            <div className="relative">
              <input
                type="email"
                placeholder="architect@promptoverflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between pl-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Access Phrase</label>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                required
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={success}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Decrypt & Authenticate</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Quick Fills */}
        <div className="mt-6 border-t border-slate-800/60 pt-5 flex flex-col gap-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
            Quick-access simulator keys
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => handleQuickFill('user')}
              className="flex-1 py-1.5 px-2 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Demo User
            </button>
            <button
              onClick={() => handleQuickFill('admin')}
              className="flex-1 py-1.5 px-2 bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 rounded-lg text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          Don't have an active profile?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-semibold">
            Registry Office
          </Link>
        </div>

      </div>
    </div>
  );
}
