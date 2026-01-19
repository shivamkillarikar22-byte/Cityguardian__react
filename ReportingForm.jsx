import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Upload, Send, Loader, Image as ImageIcon } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import axios from 'axios';
import { generatePDF, saveToHistory } from '../utils/helpers';

const ReportingForm = ({ location, addToast, onReportSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    complaint: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isListening, transcript, isSupported, startListening } = useSpeechRecognition();

  // Update complaint field when speech recognition completes
  useEffect(() => {
    if (transcript) {
      setFormData(prev => ({ ...prev, complaint: transcript }));
      addToast('Voice captured successfully!', 'success');
    }
  }, [transcript, addToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      addToast('Already listening...', 'info');
      return;
    }
    startListening();
    addToast('Listening... Please speak clearly', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location.latitude) {
      addToast('Wait for location to load', 'warning');
      return;
    }

    if (!formData.complaint.trim() && !imageFile) {
      addToast('Please provide a description OR upload a photo', 'warning');
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('name', formData.name || 'Anonymous');
    submitData.append('email', formData.email || 'no-email@provided.com');
    submitData.append('complaint', formData.complaint);
    submitData.append('latitude', location.latitude);
    submitData.append('longitude', location.longitude);
    submitData.append('address', location.address);

    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const response = await axios.post(
        'https://city-guardian.onrender.com/send-report',
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const data = response.data;

      if (data.status === 'success') {
        const finalDescription = formData.complaint.trim() || data.ai_description || 'Image-based report';

        addToast('Success! Downloading Receipt...', 'success');

        // Save to history
        const historyData = {
          complaint: finalDescription,
          department: data.department,
          urgency: data.urgency
        };
        saveToHistory(historyData);
        onReportSubmitted(historyData);

        // Generate PDF
        generatePDF(
          formData.name || 'Anonymous',
          finalDescription,
          data.department,
          location.address
        );

        // Reset form
        setFormData({ name: '', email: '', complaint: '' });
        setImageFile(null);
        setImagePreview(null);

        setTimeout(() => {
          addToast('Your report is being processed', 'info');
        }, 1000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.response?.status === 409) {
        addToast('📍 Duplicate: This issue is already being handled', 'warning');
      } else {
        const errorMsg = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        'Server error. Please try again later.';
        addToast(errorMsg, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Report a Civic Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            required
            className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus-ring"
          />
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your Email"
            required
            className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus-ring"
          />
        </motion.div>

        {/* Complaint Textarea */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <textarea
            name="complaint"
            value={formData.complaint}
            onChange={handleInputChange}
            rows="4"
            placeholder="Describe the issue (e.g., Pothole, broken light...)"
            className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus-ring resize-none"
          />
        </motion.div>

        {/* Voice & Image Inputs */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.button
            type="button"
            onClick={handleVoiceInput}
            disabled={!isSupported || isListening}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all focus-ring ${
              isListening
                ? 'bg-red-500 text-white'
                : 'glass-input text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            {isListening ? 'Recording...' : isSupported ? 'Voice Input' : 'Not Supported'}
          </motion.button>

          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-4 py-3 glass-input rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all focus-ring h-full"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload Image</span>
            </motion.div>
          </label>
        </motion.div>

        {/* Image Preview */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-48 object-cover"
              />
              <motion.button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg focus-ring ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-electric-blue-500 to-electric-blue-700 hover:from-electric-blue-600 hover:to-electric-blue-800'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            )}
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ReportingForm;
