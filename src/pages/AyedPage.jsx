import DashboardLayout from '../components/DashboardLayout';
import ChatInterface from '../components/ChatInterface';

export default function AyedPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 h-full flex flex-col">
        <div className="flex-grow">
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
} 