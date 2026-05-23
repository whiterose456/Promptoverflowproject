<img width="2346" height="1467" alt="PromptOverflow Banner" src="https://github.com/user-attachments/assets/18a2eb6c-c0c5-460f-855c-e7244ddf29da" />

# 🚀 PromptOverflow - Community AI Prompt Platform

> **Share, Discover, and Perfect AI Prompts with Your Community**

A collaborative project by **Pujolaras**, **Farrel**, and **Ren**

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge)](https://promptoverflowproject.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-98.9%25-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

## 🎯 About PromptOverflow

PromptOverflow is a **community-driven platform** designed for AI enthusiasts, developers, and prompt engineers to collaborate, share expertise, and collectively improve AI prompts. Think of it as "Stack Overflow meets Prompt Engineering" — a space where knowledge flows, ideas are refined, and best practices emerge through community feedback.
VERCEL DEPLOYEMENT PREVIEW: https://promptoverflowproject.vercel.app?_vercel_share=9PqDjG0vQdqZkB8scx13fpJwcZ2SSYou
### Why PromptOverflow?

- 🤖 **AI Literacy Growing** - More people need to learn prompt engineering
- 💡 **Collective Intelligence** - Crowdsourced prompt optimization leads to better results
- 🔗 **Community-Driven** - Real people solving real problems together
- 📊 **Transparent Quality** - Voting systems surface the best prompts

---

## ✨ Key Features

### 📱 Community Feed
Browse thousands of shared AI prompts, search by keywords, and discover new techniques from the community. Filter by tags, categories, or trending prompts.

### 🔐 Secure Authentication
User registration and login system with proper validation and security measures. Demo accounts available for testing.

### ❓ Question & Answer System
Ask questions about prompts, methodology, or AI techniques. Get detailed answers from experienced community members. Each Q&A can be voted on for visibility.

### 👍 Smart Voting System
- Upvote/downvote prompts to surface the best ones
- Downvote inferior or problematic answers
- Reputation-based visibility (best content rises to the top)

### 👤 Personal Dashboard
- Manage your prompts and answers
- Track notifications in real-time
- View your contribution history
- Monitor community reputation

### 🛡️ Admin Moderation Panel
- Review flagged content
- Manage community guidelines
- Remove spam and inappropriate content
- Analytics and moderation tools

### 🏷️ Intelligent Tagging
Organize prompts by category, topic, and use case. Easy navigation through a hierarchical tag system.

### 🌙 Modern Dark Theme UI
Beautiful, responsive design optimized for readability and accessibility across all devices.

---

## 🏗️ Project Architecture

This project demonstrates **professional collaborative development** with clear role separation:

### 👨‍💼 **Pujolaras** — Lead Developer & Integration Specialist
- **Core Navigation**: Built seamless routing and navigation flows
- **Component Architecture**: Designed reusable component structure
- **Navbar & Cards**: Created Navbar and QuestionCard components
- **Focus**: User experience continuity, component integration

### 🎨 **Farrel** — UI/UX Designer & Frontend Specialist
- **Visual Design**: Created all page designs and mockups
- **Form Layouts**: Designed intuitive form components
- **Dashboard UI**: Styled the user dashboard and admin panel
- **Focus**: Visual hierarchy, responsive design, aesthetic excellence

### 🧠 **Ren** — Architecture & Logic Lead
- **State Management**: Implemented App Context API
- **Data Structures**: Designed efficient data models
- **Validation Logic**: Built comprehensive validation system
- **Access Control**: Implemented authentication and permissions
- **Focus**: Functional architecture, security, scalability

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- Gemini API key (get it free at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/whiterose456/Promptoverflowproject.git
cd Promptoverflowproject

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env.local file in the root directory
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Start development server
npm run dev
```

The app will launch at **http://localhost:3000**

### 🧪 Demo Accounts

Test the platform with these pre-configured accounts:

| Account Type | Email | Password |
|---|---|---|
| **User** | `user@promptoverflow.com` | `password123` |
| **Admin** | `admin@promptoverflow.com` | `admin123` |

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 19** — Latest React features with hooks and concurrent rendering
- **TypeScript** — Full type safety and excellent developer experience
- **React Router v7** — Client-side routing with advanced features
- **Vite** — Lightning-fast development and optimized builds

### Styling & UI
- **Tailwind CSS 4** — Utility-first CSS for rapid development
- **Lucide React** — Beautiful, consistent icon library
- **Motion** — Smooth animations and transitions

### State Management
- **React Context API** — Lightweight, no extra dependencies
- **Browser LocalStorage** — Persistent client-side data

### Backend Integration
- **Google Gemini API** — AI-powered prompt suggestions and improvements
- **Express** — Optional backend for future scalability

---

## 📋 Features Implemented

- ✅ User Authentication (Registration & Login)
- ✅ Community Feed with Full-Text Search
- ✅ Advanced Filtering & Sorting
- ✅ Create, Edit, Delete Prompts
- ✅ Voting System (Upvote/Downvote)
- ✅ Threaded Answers with Community Voting
- ✅ Tagging System for Organization
- ✅ User Dashboard with Profile Management
- ✅ Real-time Notifications
- ✅ Admin Moderation Panel
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Dark Theme UI
- ✅ Input Validation & Error Handling
- ✅ Accessibility Features (WCAG compliance)

---

## 📂 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.tsx      # Navigation header
│   ├── QuestionCard.tsx # Prompt display card
│   └── ...
├── pages/              # Page components
│   ├── Feed.tsx        # Community feed
│   ├── Dashboard.tsx   # User dashboard
│   ├── AdminPanel.tsx  # Moderation tools
│   └── ...
├── context/            # React Context API
│   └── AppContext.tsx  # Global state management
├── types/              # TypeScript type definitions
├── utils/              # Helper functions & validators
└── App.tsx            # Main app component
```

---

## 🎓 Learning Outcomes

This project demonstrates:

- ✨ **Modern React Patterns** — Hooks, Context API, component composition
- 🔐 **Authentication & Security** — Secure login systems and access control
- 🎨 **Professional UI/UX Design** — Responsive, accessible interfaces
- 📊 **State Management at Scale** — Managing complex application state
- 🧪 **TypeScript Best Practices** — Type-safe development
- 🤝 **Collaborative Development** — Clear role separation and ownership
- 📱 **Responsive Design** — Mobile-first development approach
- ♿ **Accessibility** — WCAG-compliant interfaces

---

## 🌟 Deployment

The application is live and deployed at:
📌 **https://promptoverflowproject.vercel.app**

Built and deployed with **Vercel** for optimal performance and reliability.

---

## 🤝 Contributing

This project was a collaborative learning experience. For inquiries about contributions or future development:

- 👤 **Pujolaras** — Navigation & Components
- 🎨 **Farrel** — Design & UI
- 🧠 **Ren** — Architecture & Logic

---

## 📝 Development Notes

This codebase showcases **professional development practices**:

- ✓ **Clear Separation of Concerns** — Design, Logic, and Integration are distinct
- ✓ **Component Reusability** — DRY principle throughout
- ✓ **Type Safety** — Full TypeScript coverage
- ✓ **Scalable Architecture** — Easy to extend and maintain
- ✓ **Validation & Error Handling** — Robust input validation
- ✓ **Accessibility** — WCAG compliance and inclusive design
- ✓ **Code Organization** — Logical file structure and naming conventions

Each file includes attribution to the team member who led its development, demonstrating genuine collaboration and skill distribution.

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

Built with teamwork by **Pujolaras**, **Farrel**, and **Ren** as a final project showcase of collaborative web development excellence.

*Join the community and start sharing your best prompts today!*

---

<div align="center">

**[Visit PromptOverflow →](https://promptoverflowproject.vercel.app)**

Made with React • Styled with Tailwind • Powered by TypeScript

</div>
