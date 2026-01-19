import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ReportingForm from './components/ReportingForm';
import LocationMap from './components/LocationMap';
import ImpactHistory from './components/ImpactHistory';
import ToastContainer from './components/ToastContainer';
import { useGeolocation } from './hooks/useGeolocation';
import { useTheme } from './hooks/useTheme';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useGeolocation();
  const [toasts, setToasts] = useState([]);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleReportSubmitted = () => {
    setHistoryRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-deep-charcoal-900 dark:via-deep-charcoal-800 dark:to-deep-charcoal-900 transition-colors duration-300">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <div className="container mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-electric-blue-600 to-electric-blue-800 dark:from-electric-blue-400 dark:to-electric-blue-600 bg-clip-text text-transparent">
              AI Civic Action Platform
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Report civic issues with AI-powered vision recognition
            </p>
          </motion.div>

          {/* Reporting Form */}
          <ReportingForm
            location={location}
            addToast={addToast}
            onReportSubmitted={handleReportSubmitted}
          />

          {/* Location Map */}
          <LocationMap location={location} isDarkMode={isDarkMode} />

          {/* Impact History */}
          <ImpactHistory refreshTrigger={historyRefresh} />
        </motion.div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <p>
          Powered by <span className="font-semibold text-electric-blue-600 dark:text-electric-blue-400">Gemini AI</span> • Built with React & Tailwind CSS
        </p>
      </motion.footer>
    </div>
  );
}

export default App;
