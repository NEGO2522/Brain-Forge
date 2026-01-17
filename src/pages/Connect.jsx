import React from 'react';
import { FaGithub, FaDiscord, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { RotatingFanIcon } from '../components/RotatingFanIcon';

const Connect = () => {
  return (
    <div 
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/Connect.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left side - Map and Contact Info */}
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-transparent backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-amber-500/20 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Map Section */}
                <div className="h-64 lg:h-full rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.362456021404!2d75.69663057525096!3d26.92502186028332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5a6c8f5d8c1%3A0x1e2e7b3d3b3b3b3b!2sPoornima%20University!5e0!3m2!1sen!2sin!4v1679999999999!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Poornima University Location"
                    className="rounded-lg"
                  />
                </div>
                
                {/* Contact Info Section */}
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-8">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-500/20 p-3 rounded-lg">
                        <FaMapMarkerAlt className="h-6 w-6 text-amber-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">Location</h3>
                        <p className="mt-1 text-gray-400">Jaipur, India</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-500/20 p-3 rounded-lg">
                        <FaEnvelope className="h-6 w-6 text-amber-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">Email Us</h3>
                        <a href="mailto:nextgenova28@gmail.com" className="mt-1 text-amber-400 hover:text-amber-300 transition-colors">
                          nextgenova28@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-500/20 p-3 rounded-lg">
                        <FaPhone className="h-6 w-6 text-amber-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">Call Us</h3>
                        <a href="tel:+919413973399" className="mt-1 text-amber-400 hover:text-amber-300 transition-colors">
                          +91 94139 73399
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12">
                    <h3 className="text-lg font-medium text-white mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a 
                        href="https://github.com/NEGO2522/Brain-Forge" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-300 hover:text-white transition-colors"
                        aria-label="GitHub"
                      >
                        <FaGithub className="h-6 w-6" />
                      </a>
                      <a 
                        href="https://discord.com/users/yourusername" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-300 hover:text-indigo-400 transition-colors"
                        aria-label="Discord"
                      >
                        <FaDiscord className="h-6 w-6" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/company/brainforge16" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-gray-300 hover:text-blue-500 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Join Our Community */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-xl p-6 h-full flex flex-col justify-between">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <RotatingFanIcon>
                    <svg className="h-16 w-16 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </RotatingFanIcon>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 font-['redHatDisplay']">Brain Forge</h2>
                <p className="text-gray-300 text-sm mb-4">Where Ideas Take Flight</p>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mb-6"></div>
                
                <div className="space-y-4 mb-6 text-left">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-300">Innovative tech community</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-300">Collaborative learning</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-300">Cutting-edge projects</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto">
                <h3 className="text-xl font-medium text-amber-400 mb-3 text-center">Join Our Community</h3>
                <p className="text-gray-300 mb-6 text-center">Be part of our growing community and stay updated with the latest news and events.</p>
                <button className="w-full mt-auto inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-full text-amber-900 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors">
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;