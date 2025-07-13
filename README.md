# Glint MVP - Interactive Learning Platform

A modern React-based learning platform that provides interactive simulations, AI-powered assistance, and personalized career guidance.

## 🚀 Features

- **AI-Powered Chat Interface** - Real-time streaming conversations with Ayed, your personal AI assistant
- **Interactive Code Challenges** - Practice coding with syntax highlighting and real-time testing
- **Multiple Learning Task Types** - Code challenges, multiple choice questions, problem analysis, and more
- **Career Roadmap** - Visual career path progression with achievement tracking
- **User Authentication** - Secure user management with Supabase
- **Responsive Design** - Modern UI built with Tailwind CSS
- **Guided Tours** - Interactive onboarding experience
- **Progress Tracking** - Monitor your learning journey

## 📚 Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Comprehensive guide to all public APIs, components, and hooks
- **[Component Reference](COMPONENT_REFERENCE.md)** - Quick reference for all components and their props
- **[Setup Guide](SETUP_GUIDE.md)** - Complete installation and configuration instructions

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI/UX**: Framer Motion, React Icons
- **Code Editing**: CodeMirror with syntax highlighting
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd glint-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see the application.

For detailed setup instructions, see the [Setup Guide](SETUP_GUIDE.md).

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── forms/          # Form components
│   ├── modals/         # Modal components
│   ├── navigation/     # Navigation components
│   └── tasks/          # Interactive task components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── config/             # Configuration files
└── supabaseClient.js   # Supabase configuration
```

## 🎯 Key Components

### Core Features

- **ChatInterface** - AI-powered chat with streaming responses
- **CodeChallengeTask** - Interactive code editor with testing
- **MultipleChoiceTask** - Quiz-style questions with feedback
- **DashboardLayout** - Main application layout with navigation
- **CareerRoadmap** - Visual career progression

### Context Providers

- **AuthContext** - User authentication state management
- **TourContext** - Guided tour functionality

### Custom Hooks

- **useAuth** - Authentication state access
- **useUserProfile** - User profile data management
- **useIntersectionObserver** - Viewport intersection detection

## 🔧 Configuration

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

The application is configured for deployment on Netlify with automatic builds from the main branch.

For other deployment options, see the [Setup Guide](SETUP_GUIDE.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test your changes thoroughly

## 📖 API Reference

For detailed API documentation, see:
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Component Reference](COMPONENT_REFERENCE.md) - Quick component lookup

## 🐛 Troubleshooting

Common issues and solutions are documented in the [Setup Guide](SETUP_GUIDE.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting section](SETUP_GUIDE.md#troubleshooting)
2. Review the [API documentation](API_DOCUMENTATION.md)
3. Create an issue in the repository

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Backend powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
