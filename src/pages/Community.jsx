import React from 'react';

const About = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/Bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="max-w-2xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-6 font-['redHatDisplay']">
          Deploying Soon
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light leading-relaxed">
          Something amazing is on the horizon
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mb-12"></div>
        <p className="text-gray-400 max-w-lg mx-auto">
          We're working hard to bring you an incredible experience. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default About;