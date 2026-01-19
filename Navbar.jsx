import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, AlertCircle } from 'lucide-react';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-none border-x-0 border-t-0 mb-6 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <AlertCircle className="text-electric-blue-500 w-7 h-7" />
            <span className="text-xl font-bold bg-gradient-to-r from-electric-blue-500 to-electric-blue-700 bg-clip-text text-transparent">
              CityGuardian
            </span>
          </motion.div>
          
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
    </motion.nav>
  );
};

export default Navbar;
