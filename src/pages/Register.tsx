/*
 * Registration Page - Onboarding new users to PromptOverflow
 * 
 * UI Design: Farrel
 * Validation Logic: Ren
 * 
 * Built with careful validation to ensure:
 * - Username follows valid format (alphanumeric + underscores)
 * - Passwords match and meet minimum requirements
 * - All required fields are filled
 * 
 * Farrel designed the registration form with excellent UX.
 * Ren implemented the validation rules and error handling.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Mail, KeyRound, User, AtSign, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { registerUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Check username format (alphanumeric and underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    const registrationSuccess = registerUser(name.trim(), username.trim(), email.trim());
    
    if (registrationSuccess) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setError('Registration failed. Username or Email already in use.');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#070b16] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      {/* Register Card */}
      <div className="w-full max-w-md bg-slate-900/45 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 relative z-10 shadow-2xl shadow-blue-500/5">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-6 text-center select-none">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight mt-3">
            Prompt<span className="text-blue-500 font-semibold text-xl">Overflow</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Join the prompt engineering workspace</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/35 text-rose-450 text-xs flex gap-2 items-center">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/35 text-emerald-400 text-xs flex gap-2 items-center animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Registry completed! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                required
              />
              <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Username Handle</label>
            <div className="relative">
              <input
                type="text"
                placeholder="sarah_prompter"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                required
              />
              <AtSign className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Connection</label>
            <div className="relative">
              <input
                type="email"
                placeholder="sarah@skynet-audit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                required
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Create Access Phrase</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                minLength={6}
                required
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Verify Access Phrase</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
                minLength={6}
                required
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={success}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Initialize Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-blue-400 hover:underline font-semibold">
            Decrypt Profile
          </Link>
        </div>

      </div>
    </div>
  );
}
