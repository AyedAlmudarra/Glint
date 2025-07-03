import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { TourProvider } from "../context/TourContext";
import TourGuide from "./TourGuide";
import DashboardHeader from './DashboardHeader';

export default function DashboardLayout({ children, simulationTitle, tasks, currentTaskId, userProgress }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const sidebarRef = useRef(null);
  const openSidebarButtonRef = useRef(null);

  useEffect(() => {
    if (isMobileNavOpen) {
      // Focus the first focusable element in the sidebar when it opens
      const focusableElements = sidebarRef.current?.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements?.[0]?.focus();
    } else {
      // Return focus to the button that opened it
      openSidebarButtonRef.current?.focus();
    }
  }, [isMobileNavOpen]);

  return (
    <TourProvider>
      <div className="flex bg-gray-900 text-white min-h-screen">
        <Sidebar 
          ref={sidebarRef}
          isMobileOpen={isMobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          simulationTitle={simulationTitle}
          tasks={tasks}
          currentTaskId={currentTaskId}
          userProgress={userProgress}
        />
        <div className="flex-1 flex flex-col overflow-auto">
          <DashboardHeader openSidebarButtonRef={openSidebarButtonRef} onOpenSidebar={() => setMobileNavOpen(true)} />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        <TourGuide />
      </div>
    </TourProvider>
  );
} 