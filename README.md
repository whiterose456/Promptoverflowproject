<img width="2346" height="1467" alt="image" src="https://github.com/user-attachments/assets/18a2eb6c-c0c5-460f-855c-e7244ddf29da" />  
 

# PromptOverflow - Community AI Prompt Platform

A collaborative project by **Pujolaras**, **Farrel**, and **Ren**

## Project Overview

PromptOverflow is a community-driven platform where developers can share, discover, and improve AI prompts. 
Built with React, TypeScript, and Tailwind CSS, this application provides:

- **Community Feed**: Browse and search shared AI prompts
- **User Authentication**: Secure login and registration system
- **Question & Answer System**: Ask questions and get community feedback
- **Voting System**: Upvote/downvote prompts and answers
- **User Dashboard**: Personal space to manage your prompts and track notifications
- **Admin Panel**: Moderation tools for community management

## Team & Responsibilities

This project was built collaboratively with each team member contributing their expertise:

### Pujolaras
- **Lead Developer** for core navigation and component integration
- Built: Navbar component, QuestionCard component
- Responsible for: Navigation flows, component linking, user experience continuity

### Farrel
- **Lead UI/UX Designer** and frontend specialist
- Designed and styled: Form layouts, dashboards, all page designs
- Responsible for: Visual hierarchy, user interface mockups, responsive design, overall aesthetic

### Ren
- **Architecture & Logic Lead**
- Designed: App context, data structures, validation logic, access control
- Responsible for: Functional architecture, state management, validation rules, security

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

### Demo Accounts

For testing purposes, you can use these accounts:
- **User Account**: user@promptoverflow.com / password123
- **Admin Account**: admin@promptoverflow.com / admin123

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Animations**: Motion
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: Browser LocalStorage

## Features Implemented

✅ User Authentication (Login/Register)  
✅ Community Feed with Search & Filtering  
✅ Create, Edit, Delete Prompts  
✅ Voting System (Upvote/Downvote)  
✅ Answer Threads with Voting  
✅ Tagging System for Organization  
✅ User Dashboard & Notifications  
✅ Admin Moderation Panel  
✅ Responsive Design  
✅ Dark Theme UI  

## Development Notes

This project showcases best practices in collaborative development:
- Clear separation of responsibilities (Design, Logic, Integration)
- Component reusability and composition
- Context API for scalable state management
- TypeScript for type safety and maintainability
- Clean code architecture with individual ownership
- Responsive UI design with accessibility in mind
- Proper validation and error handling

Each file in the codebase indicates which team member led its development, showing genuine collaboration and skill distribution.

---

Built with funn by Pujolaras, Farrel, and Ren

final project example 
