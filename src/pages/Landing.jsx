import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 16,
    hours: 24,
    minutes: 60,
    seconds: 60
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { days, hours, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { days, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        
        clearInterval(timer);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const unitMap = {
    days: 'D',
    hours: 'H',
    minutes: 'M',
    seconds: 'S'
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm uppercase tracking-[0.3em] text-white/90 font-light mb-3 font-sans">
        TIME TO DEPLOYMENT
      </span>
      <div className="flex items-baseline gap-6">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex items-baseline">
            <span className="text-5xl font-serif font-normal text-white">
              {value.toString().padStart(2, '0')}
            </span>
            <span className="text-2xl font-sans font-light text-white/80 ml-1">
              {unitMap[unit]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// CSS for the rotating fan animation
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RotatingFanIcon = styled.div`
  animation: ${rotate} 4s linear infinite;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Landing = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Log video loading status
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        console.log('Video loaded successfully');
        video.play().catch(error => {
          console.error('Error playing video:', error);
        });
      };
      
      const handleError = (e) => {
        console.error('Video error:', e);
        console.log('Video source:', video.currentSrc);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Rotating Fan Icon */}
      <div className="absolute top-8 left-8 z-30">
        <RotatingFanIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-300">
            <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
            <path d="M12 12v.01"/>
          </svg>
        </RotatingFanIcon>
      </div>
      {/* Navigation Bar */}
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

      {/* Countdown Timer - Bottom Right Corner */}
      <div className="absolute right-10 bottom-10 z-10">
        <CountdownTimer />
      </div>
      {/* Video Background with fallback */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
          style={{ backgroundColor: '#1a202c' }}
        >
          <source
            src="/videos/background-video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-['redHatDisplay'] mb-6 text-amber-200/80">
          Begin Your 
          <br />
          Open Source Journey
        </h1>
        <p className="text-base md:text-lg mb-6 max-w-xl text-gray-100 leading-normal font-['Inter',sans-serif] font-light tracking-normal">
          This season, join an ambitious journey across new frontiers—where your code fuels discovery, 
          shapes communities, and leaves a mark on the digital cosmos.
        </p>
        
        {/* Organized By Text - Bottom Left Corner */}
        <div className="absolute left-10 bottom-10 group">
          <div className="flex items-start gap-4">
            {/* Large K initial */}
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold text-amber-400/90 font-serif -mb-3">K</span>
              <div className="h-1 w-10 bg-gradient-to-r from-amber-400/70 to-transparent"></div>
            </div>
            
            {/* Name */}
            <div className="flex flex-col font-serif pt-1">
              <span className="text-[11px] uppercase tracking-[0.3em] text-amber-200/80 font-light">
                Organized By
              </span>
              <span className="text-2xl font-medium text-white tracking-wide mt-1">
               Kshitij Jain
              </span>
              <div className="h-0.5 w-16 bg-gradient-to-r from-amber-400/70 to-transparent mt-2 transition-all duration-300 group-hover:w-24"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button className="relative group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/20">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Register Now
            </span>
            <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
          <button className="relative group bg-transparent border-2 border-amber-400/50 hover:border-amber-400/80 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:bg-amber-500/10">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-2.767.076.076 0 01.041-.106c.8-.3 1.6-.6 2.4-1.1.01-.008.02-.01.03-.004a7.17 7.17 0 01.07.028 6.16 6.16 0 01.2.1c.01.005.018.013.02.022a.078.078 0 01.002.045 12.12 12.12 0 01-.36 1.1c-.2.6-.5 1.2-.9 1.7a.07.07 0 00-.01.028c-.01.02-.01.042 0 .062a19.83 19.83 0 003.4 2.5c.02.01.042.01.062 0a.07.07 0 00.028-.01 19.9 19.9 0 005.993-3.03.078.078 0 00.031-.057c.5-5.2-.8-9.7-3.4-13.6a.078.078 0 00-.05-.037zM8.02 15.33c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4c.1 1.4-1 2.4-2.2 2.4zm7.98 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4c0 1.3-1 2.4-2.2 2.4z"></path>
            </svg>
            Join Discord
            <span className="absolute inset-0 bg-amber-400/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;