import DashboardLayout from '../components/DashboardLayout';
import ChatInterface from '../components/ChatInterface';

export default function SanadPage() {
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
        <div className="flex-grow min-h-0">
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
}

