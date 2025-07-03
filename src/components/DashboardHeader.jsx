import { FaBars } from 'react-icons/fa';

const DashboardHeader = ({ onOpenSidebar, openSidebarButtonRef }) => {
    return (
        <header className="bg-gray-900 text-white p-4 sticky top-0 z-10 md:hidden">
            <button 
                ref={openSidebarButtonRef}
                onClick={onOpenSidebar} 
                className="text-white hover:text-blue-400"
                aria-label="Open navigation"
                aria-controls="main-sidebar"
            >
                <FaBars className="text-2xl" />
            </button>
        </header>
    );
};

export default DashboardHeader; 