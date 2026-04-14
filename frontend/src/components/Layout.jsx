import { motion } from 'framer-motion';
import { Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Header component
 */

export const Header = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="px-4 py-4 flex items-center justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-200 transition-colors hover:bg-white/10 lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <h1 className="text-2xl font-bold gradient-text">
            User Management
          </h1>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-expanded={showUserMenu}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:border-cyan-300/30 hover:bg-white/10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-100">
              {user?.firstName} {user?.lastName}
            </span>
            <ChevronDown
              className={`hidden h-4 w-4 text-slate-300 transition-transform sm:block ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 bg-slate-950/95 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            >
              <div className="border-b border-white/10 p-3">
                <p className="font-medium text-slate-100">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>

              <nav className="p-2 space-y-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

/**
 * Sidebar component
 */

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const adminMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Reports', path: '/reports', icon: '📈' },
    { name: 'Users', path: '/users', icon: '👥' },
    { name: 'Create User', path: '/users/create', icon: '➕' },
  ];

  const managerMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Users', path: '/users', icon: '👥' },
  ];

  const userMenuItems = [
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  const getMenuItems = () => {
    if (user?.role === 'admin') return adminMenuItems;
    if (user?.role === 'manager') return managerMenuItems;
    return userMenuItems;
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}

      {/* Mobile sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        exit={{ x: -280 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 z-40 h-full w-64 border-r border-gray-200 bg-white pt-20 lg:hidden"
      >
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </motion.button>
          ))}
        </nav>

        {/* Role badge */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
              Role
            </p>
            <p className="text-sm font-bold text-gray-900 capitalize mt-1">
              {user?.role}
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Desktop sidebar */}
      <aside className="relative hidden h-full w-64 border-r border-white/10 bg-slate-950/55 backdrop-blur-sm lg:block">
        <nav className="space-y-2 px-4 py-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-all hover:bg-white/10 hover:text-cyan-200"
            >
              <span className="text-xl transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200/80">
              Role
            </p>
            <p className="mt-1 text-sm font-bold capitalize text-cyan-200">
              {user?.role}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
