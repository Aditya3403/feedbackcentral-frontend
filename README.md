Feedback Central - Frontend
A modern feedback management system built with Next.js and Tailwind CSS, designed to streamline the collection, organization, and analysis of user feedback.
🚀 Features

Modern UI/UX: Clean and responsive interface built with Tailwind CSS
Real-time Feedback: Instant feedback submission and updates
Dashboard Analytics: Comprehensive feedback analytics and insights
User Management: Role-based access control for administrators and users

🛠️ Tech Stack

Framework: Next.js 14+ (App Router)
Styling: Tailwind CSS
TypeScript: Full type safety
State Management: React Context API / Zustand
Authentication: NextAuth.js
UI Components: Custom components with Tailwind
Icons: Lucide React 
Deployment: Vercel (https://feedbackcentral-frontend-mlbh.vercel.app/)


🏗️ Installation

Clone the repository
bashgit clone (https://github.com/Aditya3403/feedbackcentral-frontend.git)
cd client

Install dependencies
npm install
# or
yarn install
# or
pnpm install

Set up environment variables
NEXT_PUBLIC_BACKEND_URL = http://127.0.0.1:8000

Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev

Open your browser
Navigate to http://localhost:3000 to see the application.

📁 Project Structure
feedback-central-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard pages
│   ├── feedback/          # Feedback-related pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── shared/           # Shared components
├── context/              # React Context providers
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
├── store/                # State management
├── types/                # TypeScript type definitions
└── utils/                # Helper functions

npm run dev - Start development server


Built with ❤️ using Next.js and Tailwind CSS
