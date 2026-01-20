import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, Sun, AlertCircle, LayoutDashboard, FileText } from 'lucide-react';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-none border-x-0 border-t-0 mb-6 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <AlertCircle className="text-electric-blue-500 w-7 h-7" />
              <span className="text-xl font-bold bg-gradient-to-r from-electric-blue-500 to-electric-blue-700 bg-clip-text text-transparent">
                CityGuardian
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    !isDashboard
                      ? 'bg-electric-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Report Issue
                </motion.button>
              </Link>

              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isDashboard
                      ? 'bg-electric-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </motion.button>
              </Link>
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-full glass-input focus-ring"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-electric-blue-600" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2 mt-4">
          <Link to="/" className="flex-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                !isDashboard
                  ? 'bg-electric-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Report
            </motion.button>
          </Link>

          <Link to="/dashboard" className="flex-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isDashboard
                  ? 'bg-electric-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
