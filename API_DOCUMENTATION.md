# Glint MVP - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Context Providers](#context-providers)
3. [Custom Hooks](#custom-hooks)
4. [Components](#components)
   - [Core Components](#core-components)
   - [Form Components](#form-components)
   - [Modal Components](#modal-components)
   - [Navigation Components](#navigation-components)
   - [Task Components](#task-components)
5. [Configuration](#configuration)
6. [External Services](#external-services)

## Overview

Glint MVP is a React-based learning platform that provides interactive simulations and AI-powered assistance. The application uses:

- **React 19** with functional components and hooks
- **React Router DOM** for navigation
- **Supabase** for backend services and authentication
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **CodeMirror** for code editing

## Context Providers

### AuthContext

Provides authentication state management throughout the application.

#### API

```javascript
import { AuthProvider, useAuth } from './context/AuthContext';

// Provider component
<AuthProvider>
  {children}
</AuthProvider>

// Hook usage
const { session, user, loading } = useAuth();
```

#### Properties

- `session` (Object | null): Current Supabase session object
- `user` (Object | null): Current authenticated user object
- `loading` (boolean): Loading state for authentication

#### Example Usage

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.email}!</div>;
}
```

### TourContext

Manages guided tour functionality for user onboarding.

#### API

```javascript
import { TourProvider, useTour } from './context/TourContext';

// Provider component
<TourProvider>
  {children}
</TourProvider>

// Hook usage
const { tourState, startTour, nextStep, stopTour } = useTour();
```

#### Properties

- `tourState` (Object): Current tour state
  - `isActive` (boolean): Whether tour is currently active
  - `stepIndex` (number): Current step index
  - `steps` (Array): Array of tour steps
- `startTour(steps)` (Function): Start a new tour with provided steps
- `nextStep()` (Function): Move to next tour step
- `stopTour()` (Function): Stop the current tour

#### Example Usage

```javascript
import { useTour } from '../context/TourContext';

function TourGuide() {
  const { tourState, startTour, nextStep, stopTour } = useTour();
  
  const handleStartTour = () => {
    const steps = [
      { target: '#dashboard', content: 'Welcome to your dashboard!' },
      { target: '#simulations', content: 'Access your simulations here.' }
    ];
    startTour(steps);
  };
  
  return (
    <div>
      <button onClick={handleStartTour}>Start Tour</button>
      {tourState.isActive && (
        <div>
          <p>{tourState.steps[tourState.stepIndex].content}</p>
          <button onClick={nextStep}>Next</button>
          <button onClick={stopTour}>Stop</button>
        </div>
      )}
    </div>
  );
}
```

## Custom Hooks

### useIntersectionObserver

Custom hook for detecting when elements enter the viewport.

#### API

```javascript
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

const [ref, isIntersecting] = useIntersectionObserver(options);
```

#### Parameters

- `options` (Object): Intersection Observer options (optional)

#### Returns

- `ref` (RefObject): Ref to attach to the target element
- `isIntersecting` (boolean): Whether the element is intersecting

#### Example Usage

```javascript
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

function AnimatedSection() {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.5
  });
  
  return (
    <div 
      ref={ref}
      className={`transition-opacity duration-1000 ${
        isIntersecting ? 'opacity-100' : 'opacity-0'
      }`}
    >
      This section animates when it comes into view
    </div>
  );
}
```

### useUserProfile

Custom hook for managing user profile data.

#### API

```javascript
import { useUserProfile } from './hooks/useUserProfile';

const { profile, loading, error, refreshProfile } = useUserProfile();
```

#### Returns

- `profile` (Object | null): User profile data
- `loading` (boolean): Loading state
- `error` (string | null): Error message if any
- `refreshProfile` (Function): Function to refresh profile data

#### Example Usage

```javascript
import { useUserProfile } from '../hooks/useUserProfile';

function ProfileDisplay() {
  const { profile, loading, error, refreshProfile } = useUserProfile();
  
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;
  
  return (
    <div>
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
      <button onClick={refreshProfile}>Refresh</button>
    </div>
  );
}
```

## Components

### Core Components

#### ChatInterface

AI-powered chat interface with streaming responses and feedback functionality.

#### API

```javascript
import ChatInterface from './components/ChatInterface';

<ChatInterface />
```

#### Features

- Real-time streaming chat responses
- Message feedback (thumbs up/down)
- Copy message functionality
- Clear conversation option
- Automatic scroll to bottom
- Loading states

#### Example Usage

```javascript
import ChatInterface from '../components/ChatInterface';

function DashboardPage() {
  return (
    <div className="h-screen">
      <ChatInterface />
    </div>
  );
}
```

#### CareerRoadmap

Interactive career roadmap component with progress tracking.

#### API

```javascript
import CareerRoadmap from './components/CareerRoadmap';

<CareerRoadmap />
```

#### Features

- Visual career path representation
- Progress tracking
- Interactive navigation
- Achievement display

#### DashboardLayout

Layout wrapper for dashboard pages with sidebar navigation.

#### API

```javascript
import DashboardLayout from './components/DashboardLayout';

<DashboardLayout>
  {children}
</DashboardLayout>
```

#### Features

- Responsive sidebar navigation
- User profile integration
- Tour guide integration
- Collapsible sidebar

#### Example Usage

```javascript
import DashboardLayout from '../components/DashboardLayout';

function DashboardPage() {
  return (
    <DashboardLayout>
      <div>Dashboard content here</div>
    </DashboardLayout>
  );
}
```

### Form Components

#### InputField

Reusable input field component with validation and password toggle.

#### API

```javascript
import InputField from './components/forms/InputField';

<InputField
  name="email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={handleEmailChange}
  onBlur={handleEmailBlur}
  icon={<FaEnvelope />}
  error={errors.email}
  touched={touched.email}
  isPassword={false}
  showPassword={showPassword}
  onToggleShowPassword={togglePassword}
/>
```

#### Props

- `name` (string): Input field name
- `type` (string): Input type (text, email, password, etc.)
- `placeholder` (string): Placeholder text
- `value` (string): Current input value
- `onChange` (Function): Change handler
- `onBlur` (Function): Blur handler
- `icon` (ReactNode): Icon to display
- `error` (string): Error message
- `touched` (boolean): Whether field has been touched
- `isPassword` (boolean): Whether this is a password field
- `showPassword` (boolean): Whether password is visible
- `onToggleShowPassword` (Function): Password visibility toggle

#### Example Usage

```javascript
import InputField from '../components/forms/InputField';
import { FaEnvelope } from 'react-icons/fa';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  return (
    <InputField
      name="email"
      type="email"
      placeholder="البريد الإلكتروني"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onBlur={() => setTouched({...touched, email: true})}
      icon={<FaEnvelope />}
      error={errors.email}
      touched={touched.email}
    />
  );
}
```

#### Avatar

User avatar component with image upload functionality.

#### API

```javascript
import Avatar from './components/forms/Avatar';

<Avatar
  currentImage={user.avatar_url}
  onImageChange={handleAvatarChange}
  size="large"
/>
```

#### Props

- `currentImage` (string): Current avatar image URL
- `onImageChange` (Function): Image change handler
- `size` (string): Avatar size ('small', 'medium', 'large')

### Modal Components

#### ConfirmModal

Confirmation dialog modal with customizable content.

#### API

```javascript
import ConfirmModal from './components/modals/ConfirmModal';

<ConfirmModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onConfirm={handleConfirm}
  title="Confirm Action"
>
  Are you sure you want to proceed with this action?
</ConfirmModal>
```

#### Props

- `isOpen` (boolean): Whether modal is open
- `onClose` (Function): Close handler
- `onConfirm` (Function): Confirm action handler
- `title` (string): Modal title
- `children` (ReactNode): Modal content

#### Example Usage

```javascript
import ConfirmModal from '../components/modals/ConfirmModal';

function DeleteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDelete = () => {
    // Delete logic here
    setIsModalOpen(false);
  };
  
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Delete Item
      </button>
      
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Item"
      >
        Are you sure you want to delete this item? This action cannot be undone.
      </ConfirmModal>
    </>
  );
}
```

#### EditProfileModal

Modal for editing user profile information.

#### API

```javascript
import EditProfileModal from './components/modals/EditProfileModal';

<EditProfileModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleProfileSave}
  profile={userProfile}
/>
```

#### Props

- `isOpen` (boolean): Whether modal is open
- `onClose` (Function): Close handler
- `onSave` (Function): Save handler
- `profile` (Object): Current profile data

#### FeedbackModal

Modal for collecting user feedback on tasks.

#### API

```javascript
import FeedbackModal from './components/modals/FeedbackModal';

<FeedbackModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  taskId="task-123"
/>
```

#### Props

- `isOpen` (boolean): Whether modal is open
- `onClose` (Function): Close handler
- `taskId` (string): ID of the task for feedback

### Navigation Components

#### NavLink

Navigation link component with active state and tooltips.

#### API

```javascript
import NavLink from './components/navigation/NavLink';

<NavLink
  link={{
    icon: <FaDashboard />,
    name: "Dashboard",
    path: "/dashboard"
  }}
  isExpanded={sidebarExpanded}
/>
```

#### Props

- `link` (Object): Navigation link object
  - `icon` (ReactNode): Link icon
  - `name` (string): Link name
  - `path` (string): Link path
- `isExpanded` (boolean): Whether sidebar is expanded

#### Example Usage

```javascript
import NavLink from '../components/navigation/NavLink';
import { FaDashboard } from 'react-icons/fa';

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const dashboardLink = {
    icon: <FaDashboard />,
    name: "لوحة التحكم",
    path: "/dashboard"
  };
  
  return (
    <nav>
      <NavLink link={dashboardLink} isExpanded={isExpanded} />
    </nav>
  );
}
```

### Task Components

#### CodeChallengeTask

Interactive code challenge component with syntax highlighting and testing.

#### API

```javascript
import CodeChallengeTask from './components/tasks/CodeChallengeTask';

<CodeChallengeTask
  definition={taskDefinition}
  onComplete={handleTaskComplete}
  taskId="challenge-123"
  feedback={taskFeedback}
  setFeedback={setTaskFeedback}
  isSubmitting={isSubmitting}
/>
```

#### Props

- `definition` (Object): Task definition object
  - `ui_schema` (Object): UI configuration
    - `existing_code` (string): Initial code
    - `solution_display` (string): Solution code
    - `language` (string): Programming language ('javascript' or 'python')
- `onComplete` (Function): Task completion handler
- `taskId` (string): Unique task identifier
- `feedback` (Object): Task feedback object
- `setFeedback` (Function): Feedback setter
- `isSubmitting` (boolean): Submission state

#### Features

- CodeMirror integration with syntax highlighting
- Real-time code execution
- Test case validation
- Solution display option
- Progress tracking
- Confetti animation on success

#### Example Usage

```javascript
import CodeChallengeTask from '../components/tasks/CodeChallengeTask';

function SimulationPage() {
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const taskDefinition = {
    ui_schema: {
      existing_code: 'function add(a, b) {\n  // Your code here\n}',
      solution_display: 'function add(a, b) {\n  return a + b;\n}',
      language: 'javascript'
    }
  };
  
  const handleTaskComplete = async (code) => {
    setIsSubmitting(true);
    // Submit code for evaluation
    const result = await evaluateCode(code);
    setFeedback(result);
    setIsSubmitting(false);
  };
  
  return (
    <CodeChallengeTask
      definition={taskDefinition}
      onComplete={handleTaskComplete}
      taskId="add-function"
      feedback={feedback}
      setFeedback={setFeedback}
      isSubmitting={isSubmitting}
    />
  );
}
```

#### MultipleChoiceTask

Multiple choice question component with immediate feedback.

#### API

```javascript
import MultipleChoiceTask from './components/tasks/MultipleChoiceTask';

<MultipleChoiceTask
  definition={taskDefinition}
  onComplete={handleTaskComplete}
  feedback={taskFeedback}
  isSubmitting={isSubmitting}
/>
```

#### Props

- `definition` (Object): Task definition object
  - `ui_schema` (Object): UI configuration
    - `scenario` (string): Question scenario
    - `question` (string): Question text
    - `options` (Array): Available options
- `onComplete` (Function): Task completion handler
- `feedback` (Object): Task feedback object
- `isSubmitting` (boolean): Submission state

#### Example Usage

```javascript
import MultipleChoiceTask from '../components/tasks/MultipleChoiceTask';

function QuizPage() {
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const taskDefinition = {
    ui_schema: {
      scenario: "You are a software developer working on a new project.",
      question: "What is the first step you should take?",
      options: [
        "Start coding immediately",
        "Plan and design the architecture",
        "Deploy to production",
        "Write documentation"
      ]
    }
  };
  
  const handleTaskComplete = async (selectedOption) => {
    setIsSubmitting(true);
    // Submit answer for evaluation
    const result = await evaluateAnswer(selectedOption);
    setFeedback(result);
    setIsSubmitting(false);
  };
  
  return (
    <MultipleChoiceTask
      definition={taskDefinition}
      onComplete={handleTaskComplete}
      feedback={feedback}
      isSubmitting={isSubmitting}
    />
  );
}
```

#### ChatbotTask

AI chatbot interaction task component.

#### API

```javascript
import ChatbotTask from './components/tasks/ChatbotTask';

<ChatbotTask
  definition={taskDefinition}
  onComplete={handleTaskComplete}
  taskId="chatbot-123"
  feedback={taskFeedback}
  setFeedback={setTaskFeedback}
  isSubmitting={isSubmitting}
/>
```

#### Props

- `definition` (Object): Task definition object
- `onComplete` (Function): Task completion handler
- `taskId` (string): Unique task identifier
- `feedback` (Object): Task feedback object
- `setFeedback` (Function): Feedback setter
- `isSubmitting` (boolean): Submission state

#### ProblemAnalysisTask

Problem analysis and solution task component.

#### API

```javascript
import ProblemAnalysisTask from './components/tasks/ProblemAnalysisTask';

<ProblemAnalysisTask
  definition={taskDefinition}
  onComplete={handleTaskComplete}
  taskId="analysis-123"
  feedback={taskFeedback}
  setFeedback={setTaskFeedback}
  isSubmitting={isSubmitting}
/>
```

#### Props

- `definition` (Object): Task definition object
- `onComplete` (Function): Task completion handler
- `taskId` (string): Unique task identifier
- `feedback` (Object): Task feedback object
- `setFeedback` (Function): Feedback setter
- `isSubmitting` (boolean): Submission state

#### DiagramInterpretationTask

Diagram interpretation and analysis task component.

#### API

```javascript
import DiagramInterpretationTask from './components/tasks/DiagramInterpretationTask';

<DiagramInterpretationTask
  definition={taskDefinition}
  onComplete={handleTaskComplete}
  taskId="diagram-123"
  feedback={taskFeedback}
  setFeedback={setTaskFeedback}
  isSubmitting={isSubmitting}
/>
```

#### Props

- `definition` (Object): Task definition object
- `onComplete` (Function): Task completion handler
- `taskId` (string): Unique task identifier
- `feedback` (Object): Task feedback object
- `setFeedback` (Function): Feedback setter
- `isSubmitting` (boolean): Submission state

## Configuration

### Navigation Configuration

Navigation links configuration for the sidebar.

#### API

```javascript
import { navLinks } from './config/navigation';

// navLinks array structure
[
  {
    icon: <FaTachometerAlt />,
    name: "لوحة التحكم",
    path: "/dashboard",
    roles: ['student', 'admin']
  }
]
```

#### Properties

- `icon` (ReactNode): Navigation icon
- `name` (string): Display name
- `path` (string): Route path
- `roles` (Array): Allowed user roles

#### Example Usage

```javascript
import { navLinks } from '../config/navigation';

function Sidebar() {
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  
  const filteredLinks = navLinks.filter(link => 
    link.roles.includes(userRole)
  );
  
  return (
    <nav>
      {filteredLinks.map(link => (
        <NavLink key={link.path} link={link} />
      ))}
    </nav>
  );
}
```

## External Services

### Supabase Client

Supabase client configuration for backend services.

#### API

```javascript
import { supabase } from './supabaseClient';

// Authentication
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Database operations
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value');

// Real-time subscriptions
const subscription = supabase
  .channel('table_name')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'table_name' }, payload => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

#### Features

- Authentication (sign up, sign in, sign out)
- Database CRUD operations
- Real-time subscriptions
- File storage
- Edge functions

#### Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Best Practices

### Component Usage

1. **Always use TypeScript-like prop validation** even in JavaScript
2. **Implement proper error boundaries** for task components
3. **Use loading states** for async operations
4. **Handle authentication states** properly
5. **Implement proper cleanup** in useEffect hooks

### State Management

1. **Use context providers** for global state (auth, tour)
2. **Use local state** for component-specific data
3. **Implement proper loading and error states**
4. **Use optimistic updates** where appropriate

### Performance

1. **Memoize expensive components** with React.memo
2. **Use useCallback** for event handlers passed to child components
3. **Implement proper cleanup** for subscriptions and timers
4. **Use lazy loading** for large components

### Accessibility

1. **Provide proper ARIA labels** for interactive elements
2. **Ensure keyboard navigation** works properly
3. **Use semantic HTML** elements
4. **Provide alt text** for images
5. **Ensure proper color contrast**

## Error Handling

### Common Error Patterns

```javascript
// Authentication errors
try {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) throw error;
} catch (error) {
  console.error('Authentication error:', error.message);
}

// Database errors
try {
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
} catch (error) {
  console.error('Database error:', error.message);
}

// Component error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Testing

### Component Testing

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import ChatInterface from '../components/ChatInterface';

test('ChatInterface renders correctly', () => {
  render(
    <AuthProvider>
      <ChatInterface />
    </AuthProvider>
  );
  
  expect(screen.getByText('Ayed Chat')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('اكتب رسالتك هنا...')).toBeInTheDocument();
});
```

### Hook Testing

```javascript
import { renderHook } from '@testing-library/react';
import { useUserProfile } from '../hooks/useUserProfile';

test('useUserProfile returns correct state', () => {
  const { result } = renderHook(() => useUserProfile());
  
  expect(result.current.loading).toBe(true);
  expect(result.current.profile).toBe(null);
  expect(result.current.error).toBe(null);
});
```

This documentation provides a comprehensive overview of all public APIs, components, and utilities in the Glint MVP application. For additional information or specific implementation details, refer to the individual component files and their inline documentation.