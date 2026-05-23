/*
 * TypeScript Type Definitions - PromptOverflow Data Models
 * 
 * Architect: Ren
 * 
 * Defines all core data structures:
 * - User accounts and roles
 * - Question/Prompt format
 * - Answer threading
 * - Notifications system
 * 
 * Ren carefully designed these types to ensure type safety
 * and clear data relationships throughout the entire application.
 */

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  createdAt: string;
  votes: number;
}

// Question interface represents a prompt or issue posted by users
// Includes the prompt text itself plus explanatory content
export interface Question {
  id: string;
  title: string;
  description: string;
  content: string; // The explanation or context
  promptText: string; // The actual prompt/code template
  tags: string[];
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  createdAt: string;
  votes: number;
  votedUsers?: Record<string, 'up' | 'down'>; // Tracks user votes to prevent duplicate votes
  answers: Answer[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  type: 'vote' | 'answer' | 'system';
}

export interface AppState {
  currentUser: User | null;
  questions: Question[];
  notifications: Notification[];
}
