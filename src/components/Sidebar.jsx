import { useState, forwardRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaSignOutAlt, FaBars, FaTimes, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { navLinks } from '../config/navigation.jsx';
import NavLink from './navigation/NavLink';

const Sidebar = forwardRef(({ simulationTitle, tasks, currentTaskId, userProgress, isMobileOpen, onClose }, ref) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isTasksExpanded, setIsTasksExpanded] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { simulationId } = useParams();
    
    // Default to 'student' role if not specified in user metadata
    const userRole = user?.user_metadata?.role || 'student';

    const accessibleLinks = navLinks.filter(link => 
        !link.roles || link.roles.includes(userRole)
    );

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            navigate('/login');
        } else {
            console.error('Error logging out:', error);
        }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isMobileOpen && <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"></div>}

            <aside 
                id="main-sidebar"
                ref={ref}
                data-tour-id="sidebar" 
                className={`bg-gray-800 text-white h-screen p-4 flex flex-col transition-all duration-300
                    fixed inset-y-0 right-0 z-40 transform md:sticky md:top-0 md:translate-x-0 
                    ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} 
                    ${isExpanded ? 'w-72' : 'w-20'}`}
            >
                <div className={`flex items-center mb-10 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                    <Link to="/" className={`font-bold text-2xl transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'hidden'}`}>
                        جلينت
                    </Link>
                    <button 
                        data-tour-id="sidebar-toggle" 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        className="text-white hover:text-blue-400 hidden md:block"
                        aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
                    >
                        {isExpanded ? <FaTimes /> : <FaBars />}
                    </button>
                    <button 
                        onClick={onClose} 
                        className="text-white hover:text-blue-400 md:hidden"
                        aria-label="Close navigation"
                    >
                        <FaTimes />
                    </button>
                </div>

                <nav className="flex-grow overflow-y-auto">
                    {accessibleLinks.map((link) => (
                        <NavLink key={link.path} link={link} isExpanded={isExpanded} />
                    ))}
                    
                    {tasks && tasks.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-700">
                             <button 
                                className="w-full flex items-center justify-between px-3 text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2"
                                onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                                aria-expanded={isTasksExpanded}
                                aria-controls="simulation-tasks-list"
                            >
                                <span>{simulationTitle}</span>
                                <FaChevronDown className={`transition-transform duration-300 ${isTasksExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            <div 
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${isTasksExpanded ? 'max-h-96' : 'max-h-0'}`}
                            >
                                <ul id="simulation-tasks-list" className="space-y-2 mt-2">
                                    {tasks.map((task) => (
                                        <li key={task.id}>
                                            <Link
                                                to={`/simulations/task/${simulationId}?task=${task.id}`}
                                                className={`w-full text-right flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                                                    currentTaskId === task.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
                                                }`}
                                            >
                                                <span className="font-semibold">{task.title}</span>
                                                {userProgress?.includes(task.id) && <FaCheckCircle className="text-green-400" />}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </nav>

                <div className="mt-auto">
                    <button 
                        onClick={handleLogout}
                        data-tour-id="sidebar-logout"
                        className={`w-full flex items-center p-3 my-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 ${!isExpanded && 'justify-center'}`}
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span className={`whitespace-nowrap mr-4 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'hidden'}`}>
                            تسجيل الخروج
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
});

export default Sidebar; 