import { useState, forwardRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaBars, FaTimes, FaCheckCircle, FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { navLinks } from '../config/navigation.jsx';
import Badge from './ui/Badge';
import Tooltip from './ui/Tooltip';

const NavLinkItem = ({ link, isExpanded, isActive }) => {
  const content = (
    <Link
      to={link.path}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl
        transition-all duration-200
        ${isActive 
          ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30' 
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]'
        }
        ${!isExpanded ? 'justify-center' : ''}
      `}
    >
      <span className={`text-xl ${isActive ? 'text-white' : ''}`}>
        {link.icon}
      </span>
      {isExpanded && (
        <span className="font-medium whitespace-nowrap">{link.name}</span>
      )}
    </Link>
  );

  if (!isExpanded) {
    return (
      <Tooltip content={link.name} position="left">
        {content}
      </Tooltip>
    );
  }

  return content;
};

const TaskItem = ({ task, simulationId, currentTaskId, isCompleted, isExpanded }) => {
  const isActive = currentTaskId === task.id;
  
  return (
    <motion.li
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/simulations/task/${simulationId}?task=${task.id}`}
        className={`
          w-full flex items-center gap-3 p-3 rounded-lg
          transition-all duration-200 text-right
          ${isActive 
            ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30' 
            : 'hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]'
          }
        `}
      >
        {/* Status indicator */}
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center shrink-0
          ${isCompleted 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : isActive 
              ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
              : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
          }
        `}>
          {isCompleted ? (
            <FaCheckCircle className="w-3 h-3" />
          ) : (
            <span className="text-xs font-medium">{task.order_index + 1}</span>
          )}
        </div>
        
        {isExpanded && (
          <span className="flex-1 text-sm font-medium truncate">{task.title}</span>
        )}
      </Link>
    </motion.li>
  );
};

const Sidebar = forwardRef(({ simulationTitle, tasks, currentTaskId, userProgress, isMobileOpen, onClose }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTasksExpanded, setIsTasksExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { simulationId } = useParams();
  
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

  const completedCount = userProgress?.length || 0;
  const totalCount = tasks?.length || 0;

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        id="main-sidebar"
        ref={ref}
        data-tour-id="sidebar" 
        className={`
          bg-[var(--color-surface-1)] border-l border-[var(--color-border-default)]
          text-[var(--color-text-primary)] h-screen flex flex-col
          transition-all duration-300 ease-in-out
          fixed inset-y-0 right-0 z-40 
          md:sticky md:top-0 md:translate-x-0 
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} 
          ${isExpanded ? 'w-72' : 'w-20'}
        `}
      >
        {/* Header */}
        <div className={`
          p-4 border-b border-[var(--color-border-default)]
          flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}
        `}>
          {isExpanded ? (
            <Link to="/" className="flex items-center">
              <img 
                src="/GlintFullLogoWhite.png" 
                alt="Glint" 
                className="h-7 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Link>
          ) : (
            <Link to="/" className="flex items-center justify-center">
              <img 
                src="/GlintLogo.svg" 
                alt="Glint" 
                className="h-8 w-8"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Link>
          )}
          
          {/* Toggle button - Desktop */}
          <button 
            data-tour-id="sidebar-toggle" 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)] transition-colors"
            aria-label={isExpanded ? 'طي القائمة' : 'توسيع القائمة'}
          >
            <FaChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Close button - Mobile */}
          <button 
            onClick={onClose} 
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            aria-label="إغلاق القائمة"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {accessibleLinks.map((link) => (
            <NavLinkItem
              key={link.path}
              link={link}
              isExpanded={isExpanded}
              isActive={location.pathname === link.path}
            />
          ))}
          
          {/* Simulation Tasks */}
          {tasks && tasks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[var(--color-border-default)]">
              <button 
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg
                  text-sm font-semibold text-[var(--color-text-secondary)]
                  hover:bg-[var(--color-surface-2)] transition-colors
                  ${!isExpanded ? 'justify-center' : 'justify-between'}
                `}
                onClick={() => setIsTasksExpanded(!isTasksExpanded)}
                aria-expanded={isTasksExpanded}
              >
                {isExpanded && (
                  <>
                    <span className="truncate">{simulationTitle}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">
                        {completedCount}/{totalCount}
                      </Badge>
                      <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTasksExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </>
                )}
                {!isExpanded && (
                  <Tooltip content={simulationTitle} position="left">
                    <Badge variant="primary" size="sm">{completedCount}</Badge>
                  </Tooltip>
                )}
              </button>
              
              <AnimatePresence>
                {isTasksExpanded && isExpanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 space-y-1 overflow-hidden"
                  >
                    {tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        simulationId={simulationId}
                        currentTaskId={currentTaskId}
                        isCompleted={userProgress?.includes(task.id)}
                        isExpanded={isExpanded}
                      />
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border-default)]">
          <button 
            onClick={handleLogout}
            data-tour-id="sidebar-logout"
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl
              text-[var(--color-text-secondary)] 
              hover:bg-red-500/10 hover:text-red-400
              transition-all duration-200
              ${!isExpanded ? 'justify-center' : ''}
            `}
          >
            <FaSignOutAlt className="text-xl" />
            {isExpanded && (
              <span className="font-medium whitespace-nowrap">تسجيل الخروج</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
