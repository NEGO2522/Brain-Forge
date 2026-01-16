import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RotatingFanIcon } from './RotatingFanIcon';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-4 px-4 sm:px-6 bg-transparent">
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center relative">
        {/* Mobile menu button and title */}
        <div className="flex justify-between items-center w-full sm:w-auto sm:absolute sm:left-0">
          {/* Desktop Title with Fan Icon - Only visible on desktop */}
          <div className="hidden sm:flex items-center gap-2 ml-4">
            <RotatingFanIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-300">
                <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
                <path d="M12 12v.01"/>
              </svg>
            </RotatingFanIcon>
            <span className="text-xl font-bold text-amber-300">Brain Forge</span>
          </div>
          
          {/* Mobile Title - Centered, only visible on mobile */}
          <h1 className="text-xl font-bold text-amber-300 sm:hidden absolute left-1/2 transform -translate-x-1/2">Brain Forge</h1>
          
          {/* Mobile menu button */}
          <button 
            className="sm:hidden p-2 rounded-md text-amber-300 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
          </button>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden sm:flex gap-3">
          <Link to="/" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">Home</span>
          </Link>
          <Link to="/community" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">Community</span>
          </Link>
          <Link to="/profiles" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">Profiles</span>
          </Link>
          <Link to="/about" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">About</span>
          </Link>
          <Link to="/connect" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">Connect</span>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className={`sm:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col p-4 space-y-2">
            <NavLink to="/" icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" text="Home" />
            <NavLink to="/community" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" text="Community" />
            <NavLink to="/profiles" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" text="Profiles" />
            <NavLink to="/about" icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" text="About" />
            <NavLink to="/connect" icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" text="Connect" />
            <Link 
              to="/login" 
              className="flex items-center justify-center w-full mt-2 px-4 py-3 text-base font-medium text-amber-100 hover:bg-amber-500/10 rounded-lg transition-colors duration-300 border border-amber-500/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Sign In Button - Desktop */}
        <div className="hidden sm:block absolute right-0">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-amber-100 bg-amber-600/50 hover:bg-amber-500/70 rounded-lg transition-colors duration-300 border border-amber-500/30">
            Sign In
          </Link>
        </div>
        
        {/* Spacer to balance the layout on mobile */}
        <div className="sm:hidden w-10"></div>
      </div>
    </nav>
  );
};

// Reusable NavLink component for better code organization
const NavLink = ({ to, icon, text }) => (
  <Link 
    to={to} 
    className="flex items-center p-3 space-x-3 rounded-lg hover:bg-amber-500/10 hover:border-amber-400/30 transition-all duration-300 border border-transparent"
    onClick={() => document.activeElement.blur()}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 text-amber-300 flex-shrink-0" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
    </svg>
    <span className="text-amber-200/90">{text}</span>
  </Link>
);

export default Navbar;