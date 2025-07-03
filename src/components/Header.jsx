import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';

export default function Header({ onOpenSidebar, openSidebarButtonRef }) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-20 transition-all duration-300 ${hasScrolled ? 'bg-gray-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          <Link to="/">جلينت</Link>
        </div>
        <nav className="space-x-4">
          <Link to="/login" className="text-white hover:text-gray-300">تسجيل الدخول</Link>
          <Link to="/signup" className="bg-white text-blue-600 font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300">
            إنشاء حساب
          </Link>
        </nav>
        <button 
          ref={openSidebarButtonRef}
          onClick={onOpenSidebar} 
          className="text-white hover:text-blue-400 md:hidden"
          aria-label="Open navigation"
          aria-controls="main-sidebar"
        >
          <FaBars className="text-2xl" />
        </button>
      </div>
    </header>
  );
} 