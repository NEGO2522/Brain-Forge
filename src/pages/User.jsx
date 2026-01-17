import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';

const User = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    github: '',
    linkedin: '',
    techStack: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('You must be logged in to save your profile');
      }
      
      const db = getFirestore(app);
      const userData = {
        ...formData,
        userId: user.uid,
        email: user.email || formData.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add a new document with a generated ID
      const docRef = await addDoc(collection(db, 'userProfiles'), userData);
      
      setSubmitStatus({
        success: true,
        message: 'Profile saved successfully!'
      });
      
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to save profile. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: null, message: '' });
      }, 5000);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start pt-24 pb-12 px-4 relative overflow-auto bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-gray-900/95"
      style={{
        backgroundImage: 'url(/User.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 animate-gradient"></div>
      
      <div className="w-full max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-['redHatDisplay'] bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">
            Your Profile
          </h1>
          <p className="text-amber-100/80 text-sm">Update your personal information</p>
        </div>
        
        <form onSubmit={handleSubmit} className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-100/90 mb-2 flex items-center">
                  Full Name <span className="text-amber-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400/60 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-200 hover:bg-white/10 focus:bg-white/10"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-100/90 mb-2 flex items-center">
                  Email <span className="text-amber-400 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400/60 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-200 hover:bg-white/10 focus:bg-white/10"
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* GitHub Profile */}
              <div>
                <label htmlFor="github" className="block text-sm font-medium text-amber-100/90 mb-2">
                  GitHub Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-amber-100/60 text-sm">github.com/</span>
                  </div>
                  <input
                    type="text"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full pl-24 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400/60 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-200 hover:bg-white/10 focus:bg-white/10"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* LinkedIn Profile */}
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-amber-100/90 mb-2">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-amber-100/60 text-sm">linkedin.com/in/</span>
                  </div>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full pl-32 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400/60 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-200 hover:bg-white/10 focus:bg-white/10"
                    placeholder="profile-id"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label htmlFor="techStack" className="block text-sm font-medium text-amber-100/90 mb-2 flex items-center">
                  Tech Stack <span className="text-amber-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400/60 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-200 hover:bg-white/10 focus:bg-white/10"
                  placeholder="e.g., React, Node.js, Python, MongoDB"
                  required
                />
                <p className="mt-2 text-xs text-amber-100/60 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Separate technologies with commas (e.g., React, Node.js, MongoDB)</span>
                </p>
              </div>

              {/* Address Field - Full Width */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-amber-100/90 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400/60 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all duration-200 hover:bg-white/10 focus:bg-white/10"
                  placeholder="Your address"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button - Full Width */}
          <div className="pt-6 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-500/90 hover:to-amber-600/90 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
            {submitStatus.message && (
              <div className={`mt-4 text-center text-sm p-3 rounded-lg ${
                submitStatus.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {submitStatus.message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default User;