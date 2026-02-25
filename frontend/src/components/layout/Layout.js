import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Store,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Chatbot from '../ui/Chatbot';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isNormalUser, isStoreOwner } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (isAdmin()) {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Stores', href: '/admin/stores', icon: Store },
      ];
    }

    if (isNormalUser()) {
      return [
        { name: 'Stores', href: '/stores', icon: Store },
        { name: 'My Ratings', href: '/my-ratings', icon: Star },
      ];
    }

    if (isStoreOwner()) {
      return [
        { name: 'Dashboard', href: '/my-store', icon: BarChart3 },
      ];
    }

    return [];
  };

  const navigation = getNavigationItems();

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-gray-800 shadow border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                <Store className="w-8 h-8 text-primary-500" />
                <span className="ml-2 text-xl font-bold text-white hidden sm:block">
                  Rately
                </span>
              </Link>

              {/* Navigation Links (Desktop) */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${isActivePath(item.href)
                      ? 'border-primary-500 text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Icons & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Settings (Desktop) */}
              <Link
                to="/settings"
                className="hidden sm:inline-flex items-center text-gray-400 hover:text-gray-200"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* User Avatar (Desktop) */}
              <div className="hidden sm:flex items-center relative group">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold cursor-pointer">
                  {user?.name?.charAt(0) || 'U'}
                </div>

                {/* Hover Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ring-1 ring-gray-700 ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-white border-b border-gray-700 font-medium truncate">
                    {user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {sidebarOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {sidebarOpen && (
          <div className="sm:hidden border-t border-gray-700 bg-gray-800">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${isActivePath(item.href)
                    ? 'bg-primary-900/50 border-primary-500 text-primary-300'
                    : 'border-transparent text-gray-400 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-200'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              <Link
                to="/settings"
                className={`${isActivePath('/settings')
                  ? 'bg-primary-900/50 border-primary-500 text-primary-300'
                  : 'border-transparent text-gray-400 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-200'
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center`}
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </div>
            <div className="pt-4 pb-4 border-t border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-900/50 rounded-full flex items-center justify-center text-primary-400 font-bold border border-primary-700">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <div className="flex items-center">
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign out
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow rounded-lg p-6 min-h-[calc(100vh-10rem)]">
          {children}
        </div>
      </main>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;