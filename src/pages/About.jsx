import React from 'react';

const About = () => {
  return (
    <div 
      className="h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/About.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        overflow: 'hidden'
      }}
    >
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="max-w-4xl mx-auto relative z-10 px-6 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 font-['redHatDisplay']">
            Brain Forge
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4"></div>
        </div>
        <div className="space-y-8 text-left">
          {/* Who We Are */}
          <div className="bg-gray-900/70 backdrop-blur-sm p-8 rounded-xl border border-amber-500/20">
            <h2 className="text-2xl font-semibold text-amber-400 mb-4">Who We Are</h2>
            <p className="text-gray-300 leading-relaxed">
              Brain Forge is a community-driven platform built to bring together people who are curious, motivated, and eager to learn. It provides a space where ideas can be shared, discussions can happen, and meaningful connections can be formed.
            </p>
          </div>

          {/* Why Brain Forge Exists */}
          <div className="bg-gray-900/70 backdrop-blur-sm p-8 rounded-xl border border-amber-500/20">
            <h2 className="text-2xl font-semibold text-amber-400 mb-4">Why Brain Forge Exists</h2>
            <p className="text-gray-300 leading-relaxed">
              Many people struggle to find focused, high-quality communities where learning and collaboration are valued. Brain Forge was created to solve this by organizing interest-based communities in one place and encouraging thoughtful, value-driven interaction.
            </p>
          </div>

          {/* Who It's For */}
          <div className="bg-gray-900/70 backdrop-blur-sm p-8 rounded-xl border border-amber-500/20">
            <h2 className="text-2xl font-semibold text-amber-400 mb-4">Who It's For</h2>
            <p className="text-gray-300 leading-relaxed">
              Brain Forge is for students, developers, creators, and lifelong learners who want to grow, share knowledge, and connect with like-minded people.
            </p>
          </div>

          {/* Founder */}
          <div className="text-center mt-12">
            <p className="text-gray-400 italic">
              Founded by <span className="text-amber-400">Kshitij Jain</span> with the goal of building a meaningful, community-first platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;