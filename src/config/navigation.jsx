import { FaTachometerAlt, FaClipboardList, FaUser, FaRobot, FaCog } from 'react-icons/fa';

export const navLinks = [
    { 
        icon: <FaTachometerAlt />, 
        name: "لوحة التحكم", 
        path: "/dashboard",
        roles: ['student', 'admin'] 
    },
    { 
        icon: <FaClipboardList />, 
        name: "المحاكاة", 
        path: "/simulations",
        roles: ['student'] 
    },
    { 
        icon: <FaRobot />, 
        name: "عايد", 
        path: "/ayed",
        roles: ['student'] 
    },
    { 
        icon: <FaUser />, 
        name: "الملف الشخصي", 
        path: "/profile",
        roles: ['student', 'admin'] 
    },
    { 
        icon: <FaCog />, 
        name: "Admin", 
        path: "/admin",
        roles: ['admin'] 
    }
]; 