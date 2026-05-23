/*
 * Sidebar Component - Left navigation for PromptOverflow
 * 
 * UI Design: Farrel
 * Navigation Logic: Pujolaras
 * 
 * Provides quick access to:
 * - Feed (main community hub)
 * - User dashboard (personal space)
 * - Admin panel (for moderators)
 * - Notifications and logout
 * 
 * Farrel designed the clean, intuitive sidebar layout.
 * Pujolaras implemented the navigation logic and routing.
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Terminal, 
  Newspaper, 
  Bell, 
  LogOut, 
  ShieldAlert, 
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';

interface SidebarProps {
  onAskClick?: () => void;
}

export default function Sidebar({ onAskClick }: SidebarProps) {
  const { currentUser, logout, notifications } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Styling classes for active and inactive menu items
  // Active items highlight the current page - helps users know where they are
  const activeClasses = "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500 font-medium";
  const inactiveClasses = "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 transition-all duration-200";

  // Helper to determine if menu item is current page
  const getMenuItemClass = (path: string) => {
    return `flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${location.pathname === path ? activeClasses : inactiveClasses}`;
  };

  // Handle logout - clears session and returns to login
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => currentUser && n.userId === currentUser.id && !n.isRead).length;

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800 flex flex-col h-[calc(100vh-64px)] shrink-0 sticky top-16 select-none z-10">
      <div className="p-4 flex flex-col gap-6 justify-between flex-1">
        {/* Nav Links */}
        <nav className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-slate-500 px-4 uppercase tracking-wider mb-2">
            Explore
          </div>
          
          <Link to="/" className={getMenuItemClass('/')}>
            <Newspaper className="w-5 h-5" />
            <span>Feed & Prompts</span>
          </Link>

          {currentUser && (
            <>
              <div className="text-xs font-semibold text-slate-500 px-4 uppercase tracking-wider mt-6 mb-2">
                Workspace
              </div>

              {currentUser.role === 'admin' ? (
                <Link to="/admin" className={getMenuItemClass('/admin')}>
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-amber-400">Admin Panel</span>
                </Link>
              ) : (
                <Link to="/dashboard" className={getMenuItemClass('/dashboard')}>
                  <LayoutDashboard className="w-5 h-5" />
                  <span>My Dashboard</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Action button & Account area */}
        <div className="flex flex-col gap-4 mt-auto">
          {currentUser ? (
            <>
              {onAskClick && currentUser.role !== 'admin' && (
                <button
                  onClick={onAskClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Share a Prompt</span>
                </button>
              )}

              <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                  />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-sm font-semibold text-white truncate">{currentUser.name}</h4>
                    <p className="text-xs text-slate-500 truncate">@{currentUser.username}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 rounded-lg text-sm transition-all duration-200 mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-lg text-sm font-medium transition-all duration-200 text-center justify-center"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 rounded-lg text-sm font-medium transition-all duration-200 text-center justify-center"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
