import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpenIcon, 
  HomeIcon,
  BookmarkIcon,
  UserIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon, show: true },
    { name: 'Catalog', href: '/catalog', icon: BookOpenIcon, show: true },
    { name: 'My Library', href: '/library', icon: BookmarkIcon, show: !!user },
    { name: 'Admin', href: '/admin', icon: ChartBarIcon, show: user?.role === 'admin' },
  ];

  return (
    <motion.div
      className="bg-gray-800 text-white w-64 h-screen fixed flex flex-col"
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <BookOpenIcon className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold">BookVault</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => item.show && (
          <Link key={item.name} to={item.href}>
            <motion.div
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === item.href ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="h-6 w-6 mr-3" />
              <span>{item.name}</span>
            </motion.div>
          </Link>
        ))}
      </nav>
      {user && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <UserIcon className="h-8 w-8 rounded-full bg-gray-700 p-1 mr-3" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center p-3 rounded-lg hover:bg-red-500 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;