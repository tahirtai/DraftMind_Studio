# DraftMind Studio ✍️

DraftMind Studio is a modern, AI-powered writing and project management workspace. It combines a distraction-free editor with powerful organization tools and AI assistance to help you create better content, faster.

![DraftMind Studio](https://via.placeholder.com/1200x600?text=DraftMind+Studio+Screenshot)

## 🚀 Features

*   **AI Writing Assistant**: Generate content, brainstorm ideas, and refine text using Gemini/OpenRouter AI.
*   **Smart Editor**: Rich text editor with formatting, bubble menu, and distraction-free mode.
*   **Project Management**: Organize documents into projects with status tracking (Draft, Review, Final).
*   **Analytics Dashboard**: Track your writing habits, word counts, and AI token usage.
*   **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
*   **Secure Authentication**: Powered by Supabase Auth with RLS policies.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS v4, PostCSS
*   **State/Data**: Supabase (Database, Auth, Realtime)
*   **Editor**: Tiptap (Headless wrapper for ProseMirror)
*   **Charts**: Recharts

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/draftmind-studio.git
    cd draftmind-studio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Copy `.env.example` to `.env` and fill in your Supabase credentials.
    ```bash
    cp .env.example .env
    ```
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    VITE_OPENROUTER_API_KEY=your_openrouter_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🚀 Deployment

The project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Vercel will automatically detect Vite.
4.  Add your Environment Variables in the Vercel Project Settings.
5.  Deploy!

## 📄 License

This project is licensed under the MIT License.
<!-- CodeRabbit test -->
