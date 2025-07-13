# Component Reference Guide

## Quick Reference for All Components

### Context Providers

| Component | File | Purpose | Key Props |
|-----------|------|---------|-----------|
| `AuthProvider` | `src/context/AuthContext.jsx` | Authentication state management | `children` |
| `TourProvider` | `src/context/TourContext.jsx` | Guided tour management | `children` |

### Custom Hooks

| Hook | File | Returns | Parameters |
|------|------|---------|------------|
| `useAuth` | `src/context/AuthContext.jsx` | `{ session, user, loading }` | None |
| `useTour` | `src/context/TourContext.jsx` | `{ tourState, startTour, nextStep, stopTour }` | None |
| `useIntersectionObserver` | `src/hooks/useIntersectionObserver.js` | `[ref, isIntersecting]` | `options` (optional) |
| `useUserProfile` | `src/hooks/useUserProfile.js` | `{ profile, loading, error, refreshProfile }` | None |

### Core Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `ChatInterface` | `src/components/ChatInterface.jsx` | None | AI chat interface with streaming |
| `CareerRoadmap` | `src/components/CareerRoadmap.jsx` | None | Interactive career path visualization |
| `DashboardLayout` | `src/components/DashboardLayout.jsx` | `children` | Dashboard layout wrapper |
| `DashboardHeader` | `src/components/DashboardHeader.jsx` | None | Dashboard header component |
| `Sidebar` | `src/components/Sidebar.jsx` | None | Navigation sidebar |
| `Header` | `src/components/Header.jsx` | None | Main application header |
| `Footer` | `src/components/Footer.jsx` | None | Application footer |
| `Spinner` | `src/components/Spinner.jsx` | None | Loading spinner |
| `AnimatedSection` | `src/components/AnimatedSection.jsx` | `children` | Animated section wrapper |
| `TourGuide` | `src/components/TourGuide.jsx` | None | Guided tour overlay |
| `AchievementsDisplay` | `src/components/AchievementsDisplay.jsx` | None | User achievements display |
| `BriefingTOC` | `src/components/BriefingTOC.jsx` | None | Table of contents for briefings |
| `OnboardingSurvey` | `src/components/OnboardingSurvey.jsx` | None | User onboarding survey |
| `GenericSimulationPage` | `src/components/GenericSimulationPage.jsx` | None | Generic simulation page wrapper |

### Form Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `InputField` | `src/components/forms/InputField.jsx` | `name, type, placeholder, value, onChange, onBlur, icon, error, touched, isPassword, showPassword, onToggleShowPassword` | Reusable input field |
| `Avatar` | `src/components/forms/Avatar.jsx` | `currentImage, onImageChange, size` | User avatar with upload |

### Modal Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `ConfirmModal` | `src/components/modals/ConfirmModal.jsx` | `isOpen, onClose, onConfirm, title, children` | Confirmation dialog |
| `EditProfileModal` | `src/components/modals/EditProfileModal.jsx` | `isOpen, onClose, onSave, profile` | Profile editing modal |
| `FeedbackModal` | `src/components/modals/FeedbackModal.jsx` | `isOpen, onClose, taskId` | Task feedback collection |

### Navigation Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `NavLink` | `src/components/navigation/NavLink.jsx` | `link, isExpanded` | Navigation link with active state |

### Task Components

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `CodeChallengeTask` | `src/components/tasks/CodeChallengeTask.jsx` | `definition, onComplete, taskId, feedback, setFeedback, isSubmitting` | Code editing and testing |
| `MultipleChoiceTask` | `src/components/tasks/MultipleChoiceTask.jsx` | `definition, onComplete, feedback, isSubmitting` | Multiple choice questions |
| `ChatbotTask` | `src/components/tasks/ChatbotTask.jsx` | `definition, onComplete, taskId, feedback, setFeedback, isSubmitting` | AI chatbot interaction |
| `ProblemAnalysisTask` | `src/components/tasks/ProblemAnalysisTask.jsx` | `definition, onComplete, taskId, feedback, setFeedback, isSubmitting` | Problem analysis tasks |
| `DiagramInterpretationTask` | `src/components/tasks/DiagramInterpretationTask.jsx` | `definition, onComplete, taskId, feedback, setFeedback, isSubmitting` | Diagram interpretation |

## Common Props Patterns

### Task Definition Object
```javascript
const taskDefinition = {
  ui_schema: {
    // UI-specific configuration
    existing_code: "// Initial code",
    solution_display: "// Solution code",
    language: "javascript", // or "python"
    scenario: "Problem scenario",
    question: "Question text",
    options: ["Option 1", "Option 2", "Option 3"]
  },
  solution: {
    expected_value: "correct_answer"
  }
};
```

### Feedback Object
```javascript
const feedback = {
  is_correct: true,
  message: "Great job! Your answer is correct.",
  stdout: "Program output",
  stderr: "Error messages",
  testResults: [
    {
      passed: true,
      input: "test_input",
      expected_output: "expected",
      actual_output: "actual"
    }
  ]
};
```

### Navigation Link Object
```javascript
const navLink = {
  icon: <FaDashboard />,
  name: "Dashboard",
  path: "/dashboard",
  roles: ['student', 'admin']
};
```

## Usage Examples

### Basic Component Usage
```javascript
// Using a context provider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// Using a custom hook
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  // Component logic
}

// Using a form component
import InputField from './components/forms/InputField';

function LoginForm() {
  return (
    <InputField
      name="email"
      type="email"
      placeholder="Enter email"
      value={email}
      onChange={setEmail}
      icon={<FaEnvelope />}
    />
  );
}

// Using a task component
import CodeChallengeTask from './components/tasks/CodeChallengeTask';

function SimulationPage() {
  return (
    <CodeChallengeTask
      definition={taskDefinition}
      onComplete={handleComplete}
      taskId="task-123"
      feedback={feedback}
      setFeedback={setFeedback}
      isSubmitting={isSubmitting}
    />
  );
}
```

### Modal Usage Pattern
```javascript
import ConfirmModal from './components/modals/ConfirmModal';

function DeleteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Delete</button>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
      >
        Are you sure you want to delete this item?
      </ConfirmModal>
    </>
  );
}
```

### Navigation Usage
```javascript
import NavLink from './components/navigation/NavLink';
import { navLinks } from './config/navigation';

function Sidebar() {
  return (
    <nav>
      {navLinks.map(link => (
        <NavLink key={link.path} link={link} isExpanded={true} />
      ))}
    </nav>
  );
}
```

## File Structure Reference

```
src/
├── components/
│   ├── forms/
│   │   ├── Avatar.jsx
│   │   └── InputField.jsx
│   ├── modals/
│   │   ├── ConfirmModal.jsx
│   │   ├── EditProfileModal.jsx
│   │   └── FeedbackModal.jsx
│   ├── navigation/
│   │   └── NavLink.jsx
│   ├── tasks/
│   │   ├── ChatbotTask.jsx
│   │   ├── CodeChallengeTask.jsx
│   │   ├── DiagramInterpretationTask.jsx
│   │   ├── MultipleChoiceTask.jsx
│   │   └── ProblemAnalysisTask.jsx
│   ├── AchievementsDisplay.jsx
│   ├── AnimatedSection.jsx
│   ├── BriefingTOC.jsx
│   ├── CareerRoadmap.jsx
│   ├── ChatInterface.jsx
│   ├── DashboardHeader.jsx
│   ├── DashboardLayout.jsx
│   ├── FAQItem.jsx
│   ├── Footer.jsx
│   ├── GenericSimulationPage.jsx
│   ├── Header.jsx
│   ├── OnboardingSurvey.jsx
│   ├── Sidebar.jsx
│   ├── Spinner.jsx
│   └── TourGuide.jsx
├── context/
│   ├── AuthContext.jsx
│   └── TourContext.jsx
├── hooks/
│   ├── useIntersectionObserver.js
│   └── useUserProfile.js
├── config/
│   └── navigation.js
├── pages/
│   ├── AyedPage.jsx
│   ├── CareerBriefingPage.jsx
│   ├── CheckEmailPage.jsx
│   ├── DashboardPage.jsx
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── PrivacyPage.jsx
│   ├── ProfilePage.jsx
│   ├── SignupPage.jsx
│   ├── SimulationsPage.jsx
│   └── TermsPage.jsx
├── App.jsx
├── main.jsx
├── index.css
└── supabaseClient.js
```

## Common Patterns

### Error Handling
```javascript
try {
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
  // Handle success
} catch (error) {
  console.error('Error:', error.message);
  // Handle error
}
```

### Loading States
```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    // Async operation
  } finally {
    setLoading(false);
  }
};
```

### Conditional Rendering
```javascript
{loading ? (
  <Spinner />
) : error ? (
  <div className="text-red-500">{error}</div>
) : (
  <div>Content</div>
)}
```

This reference guide provides quick access to all components, their props, and common usage patterns in the Glint MVP application.