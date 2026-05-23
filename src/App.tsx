/*
 * PromptOverflow - AI Prompt Community Platform
 * 
 * Architecture & Core Logic: Ren
 * Navigation & Routing: Pujolaras
 * UI Design & Styling: Farrel
 * 
 * A collaborative project bringing together our team's expertise:
 * - Ren established the foundational architecture and data flow
 * - Pujolaras implemented the routing and navigation structure
 * - Farrel designed the visual layout and user experience
 * 
 * Each team member contributed their expertise to ensure the best
 * user experience and maintainable codebase.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Page components - each page was designed with specific user flows in mind
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Shared UI components - reusable parts crafted for consistency
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// AppContent handles routing and layout - separating auth pages from main app
// This ensures a clean user journey whether logging in or browsing the community
function AppContent() {
  const location = useLocation();
  // Check if user is on authentication pages (login/register)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Auth pages use a minimal layout without navigation
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  // Main app layout with navigation and sidebar for authenticated users
  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans">
      {/* Top navigation bar - handles search, notifications, and user menu */}
      <Navbar />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
        {/* Left sidebar - persistent navigation and quick links designed for easy access */}
        <Sidebar />

        {/* Main content area - scrollable feed, dashboards, and other views */}
        <main className="flex-1 min-w-0 flex flex-col relative h-[calc(100vh-64px)] overflow-y-auto">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Catch-all redirect to Feed */}
            <Route path="*" element={<Feed />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
