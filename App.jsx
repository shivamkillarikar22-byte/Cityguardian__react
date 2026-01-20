import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileText } from 'lucide-react';
import Navbar from './components/Navbar';
import ReportingForm from './components/ReportingForm';
import LocationMap from './components/LocationMap';
import ImpactHistory from './components/ImpactHistory';
import ToastContainer from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import { useGeolocation } from './hooks/useGeolocation';
import { useTheme } from './hooks/useTheme';

// Home Page Component
const HomePage = ({ isDarkMode, location, toasts, removeToast, addToast, historyRefresh, handleReportSubmitted }) => {
  return (
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

        {/* Quick Access to Dashboard */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/dashboard">
            <div className="glass-card rounded-2xl p-4 hover:shadow-xl transition-all cursor-pointer border-2 border-electric-blue-500/20 hover:border-electric-blue-500/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-electric-blue-500 to-electric-blue-600 rounded-xl">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">
                    Executive Dashboard
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View analytics and monitor all civic reports
                  </p>
                </div>
                <div className="text-electric-blue-600 dark:text-electric-blue-400">→</div>
              </div>
            </div>
          </Link>
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
  );
};

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
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-deep-charcoal-900 dark:via-deep-charcoal-800 dark:to-deep-charcoal-900 transition-colors duration-300">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                isDarkMode={isDarkMode}
                location={location}
                toasts={toasts}
                removeToast={removeToast}
                addToast={addToast}
                historyRefresh={historyRefresh}
                handleReportSubmitted={handleReportSubmitted}
              />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={<Dashboard isDarkMode={isDarkMode} />} 
          />
        </Routes>

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
    </Router>
  );
}

export default App;
