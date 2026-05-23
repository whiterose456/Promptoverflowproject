/*
 * Storage Utilities - LocalStorage management for PromptOverflow
 * 
 * Architect: Ren
 * 
 * This module handles persistent data storage:
 * - Users and authentication
 * - Questions and answers
 * - Notifications
 * 
 * Ren designed this utility to ensure data persists reliably
 * across sessions and provides clean interfaces for data access.
 */

import { Question, User, Notification } from '../types';

const USERS_KEY = 'promptoverflow_users';
const QUESTIONS_KEY = 'promptoverflow_questions';
const NOTIFICATIONS_KEY = 'promptoverflow_notifications';

// Initial demo users for testing the platform
// These accounts help new users explore the app immediately
export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Sarah Chen',
    username: 'sarah_chen',
    email: 'user@promptoverflow.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'admin_1',
    name: 'Devin Carter',
    username: 'devin_admin',
    email: 'admin@promptoverflow.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'user_2',
    name: 'Alex Rivera',
    username: 'alex_prompt',
    email: 'alex@promptoverflow.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
];

// Initial sample questions to showcase the platform
const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q_1',
    title: 'How to structure system prompts to strictly output JSON for a dynamic menu parser?',
    description: 'I am struggling with LLM hallucinating text outside of the JSON block when parsing user emails into hierarchical commands. I need a robust system prompt structure.',
    content: 'Every time I ask the LLM to generate JSON, it prefixes the block with "Here is the JSON you requested:" or appends friendly remarks. I tried setting temperature/top_p, but the issue persists on edge cases. I need a clean system prompt strategy that isolates inputs and guarantees pure JSON.',
    promptText: `You are a strict, stateless menu structured-parser. 
Your input is a raw user request. Your output MUST be a JSON list structure complying ONLY with this TypeScript schema:
\`\`\`typescript
interface MenuCommandList {
  commands: {
    action: "ADD_ITEM" | "DELETE_ITEM" | "UPDATE_PRICE";
    payload: { itemId: string; name?: string; priceChange?: number };
  }[];
}
\`\`\`
CRITICAL RULE: Output ONLY the raw valid JSON. Do not include markdown \`\`\`json blocks, do not include introductory text, do not include trailing explanations. Answer in pure raw JSON text format.`,
    tags: ['system-prompt', 'json', 'parsers', 'structured-output'],
    authorId: 'user_2',
    authorName: 'Alex Rivera',
    authorUsername: 'alex_prompt',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-05-18T09:30:00Z',
    votes: 42,
    votedUsers: { 'user_1': 'up' },
    answers: [
      {
        id: 'ans_11',
        questionId: 'q_1',
        content: `To guarantee absolute strictness and zero surrounding conversational noise, try these strategies in combination:
1. **Emphasize negative reinforcement**: Specifically list a sentence like "If you generate any conversational text, explanations, or code-block wraps, your response is completely invalid."
2. **XML Tags wrapper**: Sometimes enclosing the variable components inside \`<user_input>\` and instructing the model to place JSON inside \`<json_payload>\` works best.
3. **Structured outputs configuration**: If you are using Google GenAI or OpenAI, make sure to use their native \`responseSchema\` or \`response_format\` APIs! In raw prompting, starting the prompt with the opening brace \`{\` can force-feed the starting token.`,
        authorName: 'Sarah Chen',
        authorUsername: 'sarah_chen',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        createdAt: '2026-05-18T10:15:00Z',
        votes: 18,
      },
    ],
  },
  {
    id: 'q_2',
    title: 'Few-shot Chain-of-Thought prompting template for complex multi-year financial calculations',
    description: 'I need a few-shot prompt that teaches the model how to compute compound interest sheets and cash flow margins over uneven sequences of financial years.',
    content: 'When evaluating complex financial questions, pure prompt execution fails on compound equations due to step-skipping. I tried standard zero-shot CoT ("Let\'s think step by step"), but it still confuses starting balances with year-end margins. A few-shot layout of intermediate calculations seems to perform 10x better. Sharing my current draft, looking for improvements.',
    promptText: `Given a multi-year investment description, compute the final balance. Follow the step-by-step example.

### Example:
Input: Invest $10,000 for 3 years at 5% annual interest. During year 2, withdraw $2,000.
Steps:
1. Year 1 Initial: $10,000. Interest: $10,000 * 0.05 = $500. End of Year 1 Balance: $10,500.
2. Year 2 Initial: $10,500. Withdrawal: -$2,000. Working Balance: $8,500. Interest: $8,500 * 0.05 = $425. End of Year 2 Balance: $8,925.
3. Year 3 Initial: $8,925. Interest: $8,925 * 0.05 = $446.25. End of Year 3 Balance: $9,371.25.
Final Output: $9,371.25

### Challenge:
Input: Invest $25,000 for 4 years at 4.5% annual interest. During year 2, deposit an extra $5,000. During year 3, withdraw $3,500.
Steps:`,
    tags: ['few-shot', 'chain-of-thought', 'financial', 'reasoning'],
    authorId: 'user_1',
    authorName: 'Sarah Chen',
    authorUsername: 'sarah_chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-05-19T14:20:00Z',
    votes: 29,
    votedUsers: {},
    answers: [
      {
        id: 'ans_21',
        questionId: 'q_2',
        content: `Your template structure is outstanding! The main thing you could add is a "Sanity Check" step inside the example.
Before calculating the final interest, let the example output:
\`\`\`
Interest Validation: (Initial Principal + Changes) * Rate = Interest.
\`\`\`
This encourages the model's self-correction mechanism to run a basic formula check before moving to the next year. Here is a modified step template that works wonders on reasoning-dense models.`,
        authorName: 'Alex Rivera',
        authorUsername: 'alex_prompt',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        createdAt: '2026-05-19T16:05:00Z',
        votes: 11,
      },
    ],
  },
  {
    id: 'q_3',
    title: 'Avoiding instructional dilution and attention drift in long (32k+ token) RAG context system prompts',
    description: 'When feeding massive legal texts into Gemini or GPT-4, the models often ignore secondary negative constraints. How do you keep rules active?',
    content: 'Our system feeds full multi-clause contracts as context. At the very end of the prompt we add negative constraints (e.g., "Do not mention confidential partner names"). However, because of the "lost in the middle" or instructional dispersion, the model occasionally leaks this info. What is the most effective prompt framing to counter this?',
    promptText: `[SYSTEM INSTRUCTION: EXTREMELY CRITICAL LEGAL AGENT AUDIT PROFILE]
You are reviewing the following contract for discrepancies.
=========================
[CONTEXT LEGAL CONTRACTS]
... (32k tokens of text) ...
=========================
[INSTRUCTIONS SUMMARY]
1. Find any pricing inconsistency.
2. CRITICAL CONSTRAINT: Under NO circumstances are you to disclose individual names, phone numbers, or emails present in the contracts.
3. Repeat your critical negative constraint immediately before outputting your final list to lock attention.
Answer:`,
    tags: ['rag', 'long-context', 'instruction-drift', 'security'],
    authorId: 'user_2',
    authorName: 'Alex Rivera',
    authorUsername: 'alex_prompt',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-05-20T11:10:00Z',
    votes: 56,
    votedUsers: { 'admin_1': 'up' },
    answers: [],
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n_1',
    userId: 'user_1',
    title: 'New Upvote',
    content: 'Your question "Few-shot Chain-of-Thought prompting template" received an upvote.',
    isRead: false,
    createdAt: '2026-05-21T08:00:00Z',
    type: 'vote',
  },
  {
    id: 'n_2',
    userId: 'user_1',
    title: 'New Answer',
    content: 'Alex Rivera contributed an answer to your compounding interest prompt question!',
    isRead: false,
    createdAt: '2026-05-19T16:05:00Z',
    type: 'answer',
  },
  {
    id: 'n_3',
    userId: 'admin_1',
    title: 'System Bulletin',
    content: 'PromptOverflow content guidelines updated. Please check the new tags layout in Admin.',
    isRead: false,
    createdAt: '2026-05-21T10:00:00Z',
    type: 'system',
  },
];

export const getStoredUsers = (): User[] => {
  const usersStr = localStorage.getItem(USERS_KEY);
  if (!usersStr) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(usersStr);
};

export const getStoredQuestions = (): Question[] => {
  const questionsStr = localStorage.getItem(QUESTIONS_KEY);
  if (!questionsStr) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(INITIAL_QUESTIONS));
    return INITIAL_QUESTIONS;
  }
  return JSON.parse(questionsStr);
};

export const getStoredNotifications = (): Notification[] => {
  const notificationsStr = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!notificationsStr) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  return JSON.parse(notificationsStr);
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const saveQuestions = (questions: Question[]): void => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};
