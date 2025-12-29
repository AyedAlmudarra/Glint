import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import Button from './ui/Button';

export default function Header({ openSidebarButtonRef }) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-20 transition-all duration-300
        ${hasScrolled 
          ? 'bg-[var(--color-bg-primary)]/90 backdrop-blur-lg border-b border-[var(--color-border-default)] shadow-lg' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/GlintFullLogoWhite.png" 
            alt="Glint" 
            className="h-8 w-auto"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-colors"
          >
            تسجيل الدخول
          </Link>
          <Button as={Link} to="/signup" variant="primary" size="md" isPill>
            ابدأ مجانًا
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          ref={openSidebarButtonRef}
          onClick={() => setMenuOpen(true)} 
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-surface-1)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]"
          aria-label="فتح القائمة"
        >
          <FaBars className="w-5 h-5" />
        </button>
      </div>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[var(--color-bg-primary)] z-50 sm:hidden"
          >
            {/* Close Button */}
            <button 
              onClick={() => setMenuOpen(false)} 
              className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--color-surface-1)] text-[var(--color-text-primary)]"
              aria-label="إغلاق القائمة"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            
            {/* Menu Content */}
            <div className="flex flex-col items-center justify-center h-full px-8">
              <motion.img
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                src="/GlintFullLogoWhite.png"
                alt="Glint"
                className="h-12 w-auto mb-12"
              />
              
              <motion.nav
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-4 w-full max-w-xs"
              >
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="
                    w-full text-center py-4 rounded-xl
                    bg-[var(--color-surface-1)] border border-[var(--color-border-default)]
                    text-[var(--color-text-primary)] font-medium
                    hover:bg-[var(--color-surface-2)] transition-colors
                  "
                >
                  تسجيل الدخول
                </Link>
                
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="
                    w-full text-center py-4 rounded-xl
                    bg-[var(--color-primary)] text-white font-bold
                    hover:bg-[var(--color-primary-hover)] transition-colors
                    shadow-lg shadow-[var(--color-primary)]/30
                  "
                >
                  ابدأ مجانًا
                </Link>
              </motion.nav>
              
              {/* Footer Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-8 flex gap-6 text-sm text-[var(--color-text-muted)]"
              >
                <Link to="/privacy" onClick={() => setMenuOpen(false)}>الخصوصية</Link>
                <Link to="/terms" onClick={() => setMenuOpen(false)}>الشروط</Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
