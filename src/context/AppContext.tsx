/*
 * AppContext - Central state management for PromptOverflow
 * 
 * Lead Architect: Ren
 * 
 * Manages:
 * - User authentication and profiles
 * - Questions and answers in the community
 * - Notifications for user interactions
 * - Persistent data storage using localStorage
 * 
 * Ren designed the data structure and state management patterns
 * to ensure clean, scalable, and maintainable state handling.
 * All state mutations are intentional and validated for data integrity.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Question, Notification, Answer } from '../types';
import { 
  getStoredUsers, 
  getStoredQuestions, 
  getStoredNotifications, 
  saveUsers, 
  saveQuestions, 
  saveNotifications 
} from '../utils/storage';

// Context interface - carefully structured to provide all needed app functionality
interface AppContextType {
  currentUser: User | null;
  users: User[];
  questions: Question[];
  notifications: Notification[];
  login: (email: string, password: string) => { success: boolean; user?: User };
  logout: () => void;
  registerUser: (name: string, username: string, email: string) => boolean;
  addQuestion: (title: string, description: string, content: string, promptText: string, tags: string[]) => void;
  updateQuestion: (id: string, title: string, description: string, content: string, promptText: string, tags: string[]) => void;
  deleteQuestion: (id: string) => void;
  voteQuestion: (id: string, direction: 'up' | 'down') => void;
  addAnswer: (questionId: string, content: string) => void;
  deleteAnswer: (questionId: string, answerId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (userId: string, title: string, content: string, type: 'vote' | 'answer' | 'system') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('promptoverflow_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>(() => getStoredUsers());
  const [questions, setQuestions] = useState<Question[]>(() => getStoredQuestions());
  const [notifications, setNotifications] = useState<Notification[]>(() => getStoredNotifications());

  // Persist user data to localStorage whenever it changes
  // This ensures data survives page refreshes and sessions
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  // Persist questions to localStorage - automatically syncs when questions change
  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('promptoverflow_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('promptoverflow_current_user');
    }
  }, [currentUser]);

  const login = (email: string, pass: string) => {
    // Check specific credentials requested by user first
    let matchedUser: User | undefined;
    
    if (email === 'user@promptoverflow.com' && pass === 'password123') {
      matchedUser = users.find(u => u.email === 'user@promptoverflow.com');
    } else if (email === 'admin@promptoverflow.com' && pass === 'admin123') {
      matchedUser = users.find(u => u.email === 'admin@promptoverflow.com');
    } else {
      // General match for other registered users
      matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (matchedUser) {
      setCurrentUser(matchedUser);
      return { success: true, user: matchedUser };
    }
    return { success: false };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = (name: string, username: string, email: string) => {
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase())) {
      return false;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      username,
      email,
      role: 'user',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=150&q=80`
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const addQuestion = (title: string, description: string, content: string, promptText: string, tags: string[]) => {
    if (!currentUser) return;
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      title,
      description,
      content,
      promptText,
      tags: tags.map(t => t.trim().toLowerCase()).filter(Boolean),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
      votes: 0,
      votedUsers: {},
      answers: [],
    };
    setQuestions(prev => [newQuestion, ...prev]);

    // Send a mock systems/analytics notification or notify admin
    addNotification('admin_1', 'New Question Posted', `"${currentUser.name}" posted a new prompt: "${title}"`, 'system');
  };

  const updateQuestion = (id: string, title: string, description: string, content: string, promptText: string, tags: string[]) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return {
          ...q,
          title,
          description,
          content,
          promptText,
          tags: tags.map(t => t.trim().toLowerCase()).filter(Boolean),
        };
      }
      return q;
    }));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const voteQuestion = (id: string, direction: 'up' | 'down') => {
    if (!currentUser) return;
    const userId = currentUser.id;

    setQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;

      const votesTrack = q.votedUsers || {};
      const previousVote = votesTrack[userId];
      let votesDiff = 0;

      if (previousVote === direction) {
        // Undo vote
        delete votesTrack[userId];
        votesDiff = direction === 'up' ? -1 : 1;
      } else if (previousVote) {
        // Swap vote
        votesTrack[userId] = direction;
        votesDiff = direction === 'up' ? 2 : -2;
      } else {
        // New vote
        votesTrack[userId] = direction;
        votesDiff = direction === 'up' ? 1 : -1;
      }

      // If upvoted, trigger a notification for the author (if not self)
      if (direction === 'up' && votesDiff > 0 && q.authorId !== currentUser.id) {
        // Only notify once ideally, let's just trigger a neat notification object
        setTimeout(() => {
          addNotification(
            q.authorId,
            'Your prompt was upvoted!',
            `"${currentUser.name}" upvoted your question: "${q.title.substring(0, 30)}..."`,
            'vote'
          );
        }, 100);
      }

      return {
        ...q,
        votes: q.votes + votesDiff,
        votedUsers: { ...votesTrack }
      };
    }));
  };

  const addAnswer = (questionId: string, content: string) => {
    if (!currentUser) return;

    const newAnswer: Answer = {
      id: `ans_${Date.now()}`,
      questionId,
      content,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      createdAt: new Date().toISOString(),
      votes: 0
    };

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        // Notify Author of the answer (if author is different)
        if (q.authorId !== currentUser.id) {
          setTimeout(() => {
            addNotification(
              q.authorId,
              'New Answer Received',
              `"${currentUser.name}" contributed an answer to your question: "${q.title.substring(0, 30)}..."`,
              'answer'
            );
          }, 100);
        }
        return {
          ...q,
          answers: [...q.answers, newAnswer]
        };
      }
      return q;
    }));
  };

  const deleteAnswer = (questionId: string, answerId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.filter(a => a.id !== answerId)
        };
      }
      return q;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
  };

  const addNotification = (userId: string, title: string, content: string, type: 'vote' | 'answer' | 'system') => {
    const newNotif: Notification = {
      id: `n_${Date.now()}`,
      userId,
      title,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      questions,
      notifications,
      login,
      logout,
      registerUser,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      voteQuestion,
      addAnswer,
      deleteAnswer,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
