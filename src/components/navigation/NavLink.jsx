import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ link, isExpanded }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(link.path);

    return (
        <Link 
            to={link.path}
            data-tour-id={`sidebar-${link.path.replace('/', '')}`}
            aria-label={link.name}
            className={`group relative flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${
                isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
        >
            <span className="text-xl">{link.icon}</span>
            <span className={`whitespace-nowrap mr-4 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {link.name}
            </span>
            {!isExpanded && (
                <div className="absolute left-full items-center ml-4 px-2 py-1.5 rounded-md bg-gray-700 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {link.name}
                </div>
            )}
        </Link>
    );
};

export default React.memo(NavLink); 