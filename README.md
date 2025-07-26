# Print Goals

A simple goal tracking app designed for printing and physical tracking.

## Features

- 🔐 Magic link authentication (via Supabase)
- 📝 Create and manage goal lists
- ✅ Two goal types: checkbox and step-based goals
- 🖨️ Print-optimized layout matching your original HTML design
- 📱 Inline editing for goals and categories
- 🏠 Deployable to Netlify + Supabase

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. In your Supabase SQL editor, run the SQL from `lib/database.sql`

### 2. Configure Environment

1. Copy `.env.example` to `.env.local`
2. Add your Supabase URL and anon key

### 3. Install and Run

```bash
npm install
npm run dev
```

### 4. Deploy to Netlify

1. Push to GitHub
2. Connect to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## Usage

1. Sign in with magic link
2. Create goal lists
3. Add goals with categories
4. Click "Print Goals" to get print-ready format
5. Print and hang on wall for physical tracking

## Goal Types

- **Checkbox**: Simple yes/no goals
- **Steps**: Numbered or monthly progress tracking (matches your original HTML)