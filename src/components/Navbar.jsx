import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 py-4 px-6">
      <div className="flex justify-center items-center relative">
        <div className="flex gap-3">
          <Link to="/" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg bg-black/20 hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">Home</span>
          </Link>
          <Link to="/about" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg bg-black/20 hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">About</span>
          </Link>
          <Link to="/community" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg bg-black/20 hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">Community</span>
          </Link>
          <Link to="/connect" className="flex flex-col items-center justify-center p-2 border border-white/20 rounded-lg bg-black/20 hover:bg-amber-500/10 hover:border-amber-400/50 transition-all duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] mt-0.5 text-amber-200/80 opacity-100 transition-opacity">Connect</span>
          </Link>
        </div>
        <Link to="/login" className="absolute right-0 px-4 py-2 text-sm font-medium text-amber-100 bg-amber-600/80 hover:bg-amber-500/90 rounded-lg transition-colors duration-300 border border-amber-500/50">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;