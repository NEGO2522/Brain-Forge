import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Navbar from '../components/Navbar';

const CountdownTimer = () => {
  // Set target date to 16 days from now
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 16);
    date.setHours(0, 0, 0, 0); // Set to midnight
    return date;
  });

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
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
      <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/90 font-light mb-2 sm:mb-3 font-sans">
        TIME TO DEPLOYMENT
      </span>
      <div className="flex items-baseline gap-3 sm:gap-6">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex items-baseline">
            <span className="text-3xl sm:text-5xl font-serif font-normal text-white">
              {value.toString().padStart(2, '0')}
            </span>
            <span className="text-xl sm:text-2xl font-sans font-light text-white/80 ml-1">
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
  const isMobile = typeof window !== 'undefined' ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : false;
  const videoRef = useRef(null);

  useEffect(() => {
    // Only autoplay video on non-mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (videoRef.current && !isMobile) {
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
    <div className="relative w-full bg-gray-900 flex flex-col h-screen overflow-y-auto snap-y snap-mandatory scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-900">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen w-full flex-shrink-0 snap-start">
        {/* Fixed Background Elements */}
        <div className="fixed top-4 left-4 sm:top-8 sm:left-8 z-30">
          <RotatingFanIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-300">
              <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/>
              <path d="M12 12v.01"/>
            </svg>
          </RotatingFanIcon>
        </div>
        
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 z-20">
          <Navbar />
        </div>

        {/* Fixed Countdown Timer */}
        <div className="fixed right-4 bottom-20 sm:right-10 sm:bottom-10 z-10 bg-black/40 backdrop-blur-sm rounded-lg p-2 sm:bg-transparent sm:backdrop-blur-0 sm:p-0">
          <CountdownTimer />
        </div>

        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover z-0"
            autoPlay={!isMobile}
            loop={!isMobile}
            muted
            playsInline
            poster="/Image.jpg"
          >
            <source src="/videos/background-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl flex flex-col items-center px-2 sm:px-0">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-['redHatDisplay'] mb-4 sm:mb-6 text-amber-200/80 text-center">
              Begin Your Community
              <br className="hidden sm:block" />
              Journey of Tech 
            </h1>
            <p className="text-sm xs:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl text-gray-100 leading-relaxed font-['Inter',sans-serif] font-light tracking-normal text-center px-2 sm:px-4">
              Be part of a growing initiative that connects people through shared interests, enabling collaboration, learning, and long-term impact.
            </p>
            
            {/* Buttons - Centered */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md px-2 sm:px-0">
              <button className="relative group bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/20 w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Register Now
                </span>
                <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <a href="https://www.linkedin.com/in/kshitij-kj-jain-422025342/" target="_blank" rel="noopener noreferrer" className="relative group bg-transparent border-2 border-amber-400/50 hover:border-amber-400/80 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:bg-amber-500/10 w-full sm:w-auto">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Join LinkedIn
                <span className="absolute inset-0 bg-amber-400/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
            </div>
            
            {/* Organized By Text - Bottom Left Corner */}
            <div className="absolute left-2 bottom-4 sm:left-10 sm:bottom-10 group">
              <div className="flex items-start gap-2 sm:gap-4">
                {/* Large K initial */}
                <div className="flex flex-col items-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-400/90 font-serif -mb-2 sm:-mb-3">K</span>
                  <div className="h-0.5 w-8 sm:w-10 bg-gradient-to-r from-amber-400/70 to-transparent"></div>
                </div>
                
                {/* Name */}
                <div className="flex flex-col font-serif pt-0 sm:pt-1">
                  <span className="text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-200/80 font-light">
                    Organized By
                  </span>
                  <span className="text-lg xs:text-xl sm:text-2xl font-medium text-white tracking-wide mt-0.5 sm:mt-1">
                   Kshitij Jain
                  </span>
                  <div className="h-0.5 w-12 sm:w-16 bg-gradient-to-r from-amber-400/70 to-transparent mt-1.5 sm:mt-2 transition-all duration-300 group-hover:w-16 sm:group-hover:w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative w-full min-h-screen h-auto flex-shrink-0 snap-start bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/Image.jpg)' }}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
          <div className="w-full pt-16 sm:pt-20">
            {/* Navigation Links */}
            <div className="flex justify-center mb-10 sm:mb-20 px-2">
              <div className="space-y-4 sm:space-y-6 w-full max-w-xs">
                <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2">
                  <div className="space-y-1 sm:space-y-2">
                    <a href="#" className="hover:text-white text-white/70 text-xs xs:text-sm tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.18em] uppercase whitespace-nowrap transition-colors block">Rules & Guidelines</a>
                    <a href="#" className="hover:text-white text-white/70 text-xs xs:text-sm tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.18em] uppercase whitespace-nowrap transition-colors block">Privacy Policy</a>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <a href="#" className="hover:text-white text-white/70 text-xs xs:text-sm tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.18em] uppercase whitespace-nowrap transition-colors block">Code of Conduct</a>
                    <a href="#" className="hover:text-white text-white/70 text-xs xs:text-sm tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.18em] uppercase whitespace-nowrap transition-colors block">Terms of Use</a>
                  </div>
                </div>
                <a href="#" className="hover:text-white text-white/90 text-sm sm:text-base tracking-[0.12em] sm:tracking-[0.15em] md:tracking-[0.18em] uppercase whitespace-nowrap transition-colors block text-center font-medium">
                  Contact Us
                </a>
              </div>
            </div>

            {/* Organized By Section - Left Aligned */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between px-4 sm:pl-8 sm:pr-8 pt-8 sm:pt-2">
              {/* Social Links */}
              <div className="flex flex-col items-center sm:items-start space-y-3 sm:space-y-4 pt-2 order-2 sm:order-1 mt-6 sm:mt-0">
                <span className="text-xs uppercase tracking-widest text-amber-200/60 font-light">Connect</span>
                <div className="flex space-x-4">
                  <a href="https://github.com/NEGO2522" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.332-1.755-1.332-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/kshitij-kj-jain-422025342/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="mailto:nextgenova28@gmail.com" className="text-white/70 hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Organized By Content */}
              <div className="flex items-start gap-3 sm:gap-4 order-1 sm:order-2">
                <div className="flex flex-col items-center">
                  <span className="text-6xl sm:text-7xl md:text-8xl font-bold text-amber-400/90 font-serif -mb-2 sm:-mb-3">K</span>
                  <div className="h-0.5 w-10 sm:w-14 bg-gradient-to-r from-amber-400/70 to-transparent"></div>
                </div>
                <div className="flex flex-col font-serif pt-1 sm:pt-2">
                  <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-amber-200/80 font-light">
                    Organized By
                  </span>
                  <span className="text-2xl sm:text-3xl font-medium text-white tracking-wide mt-1 sm:mt-2">
                    Kshitij Jain
                  </span>
                  <div className="h-0.5 w-16 sm:w-20 bg-gradient-to-r from-amber-400/70 to-transparent mt-2 sm:mt-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;