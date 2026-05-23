/*
 * Navbar Component - Main navigation hub for PromptOverflow
 * 
 * Lead Developer: Pujolaras
 * 
 * Features:
 * - Search functionality with real-time filtering
 * - Notification center with read/unread states
 * - User profile dropdown
 * - Quick access to admin features
 * 
 * Pujolaras designed and built this component with careful attention
 * to navigation flow and user experience.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Bell, 
  Sparkles, 
  User, 
  ShieldAlert, 
  Check, 
  AlertCircle,
  Vote,
  MessageSquare
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    navigate('/');
  };

  const userNotifications = currentUser 
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];
  
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return <Vote className="w-4 h-4 text-emerald-400" />;
      case 'answer':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 w-full z-40 select-none">
      <div className="max-w-[1600px] h-full mx-auto px-6 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group select-none shrink-0" onClick={handleClearSearch}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
            Prompt<span className="text-blue-500 font-semibold text-lg">Overflow</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search prompt titles, tags, content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-slate-900/90 focus:ring-1 focus:ring-blue-500/30 transition-all duration-300"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
          </div>
        </form>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-all duration-200 relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                      <h4 className="font-bold text-sm text-white">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                      {userNotifications.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-6">No new alerts.</p>
                      ) : (
                        userNotifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`p-2.5 rounded-lg border flex gap-3 cursor-pointer select-none transition-all duration-200 ${
                              notif.isRead 
                                ? 'bg-slate-950/40 border-slate-800/40 opacity-60' 
                                : 'bg-blue-950/20 border-blue-900/30 hover:bg-blue-950/30'
                            }`}
                          >
                            <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 shrink-0 h-fit self-start">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{notif.content}</p>
                              <p className="text-[9px] text-slate-500 mt-1">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {!notif.isRead && (
                              <Check className="w-3.5 h-3.5 text-blue-400 self-center shrink-0" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profiling Badge */}
              <div 
                onClick={() => navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard')}
                className="flex items-center gap-2 px-1.5 py-1.5 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/60 cursor-pointer transition-all duration-200 select-none max-w-40"
              >
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg border border-slate-700 object-cover shrink-0"
                />
                <span className="text-xs font-semibold text-slate-300 truncate max-w-20 hidden md:block">
                  {currentUser.username}
                </span>
                {currentUser.role === 'admin' && (
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-slate-400 hover:text-white px-3 py-1.5 text-sm font-medium transition-all"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/10"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
