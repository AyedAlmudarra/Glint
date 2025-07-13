# Glint MVP - Setup and Installation Guide

## Prerequisites

Before setting up the Glint MVP application, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase account** for backend services

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd glint-mvp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Development Configuration
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

### 4. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

#### Database Schema

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message feedback table
CREATE TABLE public.message_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- User task progress table
CREATE TABLE public.user_task_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, task_id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_task_progress ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Chat messages policies
CREATE POLICY "Users can view own messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON public.chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Message feedback policies
CREATE POLICY "Users can view own feedback" ON public.message_feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback" ON public.message_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User task progress policies
CREATE POLICY "Users can view own progress" ON public.user_task_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_task_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Edge Functions Setup

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy edge functions:
```bash
supabase functions deploy chat-with-ayed
```

### 5. Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
glint-mvp/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── forms/         # Form components
│   │   ├── modals/        # Modal components
│   │   ├── navigation/    # Navigation components
│   │   └── tasks/         # Task components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── config/            # Configuration files
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── supabaseClient.js  # Supabase client configuration
├── supabase/              # Supabase configuration
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Supabase (if using CLI)
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase status      # Check Supabase status
```

## Configuration Options

### Vite Configuration

The project uses Vite for build tooling. Key configurations in `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Tailwind CSS Configuration

The project uses Tailwind CSS v4. Configuration is handled automatically by the Vite plugin.

### ESLint Configuration

ESLint is configured for React development with the following rules:

```javascript
// eslint.config.js
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  js.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
```

## Deployment

### Netlify Deployment

The project includes a `netlify.toml` configuration for easy deployment:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

To deploy to Netlify:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
```

## Troubleshooting

### Common Issues

#### 1. Supabase Connection Issues

**Problem**: Cannot connect to Supabase
**Solution**: 
- Verify environment variables are correct
- Check Supabase project status
- Ensure RLS policies are properly configured

#### 2. Build Errors

**Problem**: Build fails with dependency errors
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. Development Server Issues

**Problem**: Development server won't start
**Solution**:
- Check if port 5173 is available
- Verify all dependencies are installed
- Check for syntax errors in code

#### 4. Authentication Issues

**Problem**: Users can't sign up/sign in
**Solution**:
- Verify Supabase auth settings
- Check email templates are configured
- Ensure RLS policies allow user creation

### Performance Optimization

#### 1. Code Splitting

The application uses React Router for code splitting. Lazy load components:

```javascript
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <DashboardPage />
    </Suspense>
  );
}
```

#### 2. Bundle Analysis

Analyze bundle size:

```bash
npm run build
npx vite-bundle-analyzer dist
```

#### 3. Image Optimization

Use optimized images and consider lazy loading for better performance.

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly

### 2. Supabase Security

- Enable Row Level Security (RLS) on all tables
- Use proper RLS policies
- Regularly audit access patterns

### 3. Input Validation

- Validate all user inputs
- Sanitize data before database operations
- Use proper error handling

### 4. Authentication

- Implement proper session management
- Use secure password policies
- Enable MFA where possible

## Contributing

### Development Workflow

1. Create a feature branch
2. Make changes
3. Write tests
4. Submit pull request
5. Code review
6. Merge to main

### Code Style

- Use ESLint for code linting
- Follow React best practices
- Use TypeScript-like prop validation
- Write meaningful commit messages

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the API documentation
3. Check Supabase documentation
4. Create an issue in the repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.