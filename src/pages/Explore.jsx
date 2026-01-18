import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiUsers, FiZap, FiGlobe, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Web3 & Crypto", count: "1.2k", icon: <FiGlobe /> },
    { name: "AI & ML", count: "850", icon: <FiZap /> },
    { name: "Designers", count: "2.4k", icon: <FiUsers /> },
    { name: "Open Source", count: "3.1k", icon: <FiTrendingUp /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />

      {/* Hero Search Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic mb-6"
          >
            Discovery <span className="text-amber-500">Matrix</span>
          </motion.h1>
          <p className="text-gray-500 uppercase tracking-[0.4em] text-[10px] font-black mb-10">
            Scanning 5,400+ Nodes Across the Ecosystem
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-xl">
              <FiSearch className="text-amber-500 text-xl mr-4" />
              <input 
                type="text" 
                placeholder="Search by skill, name, or community..."
                className="bg-transparent border-none outline-none w-full text-lg placeholder:text-gray-600"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <kbd className="hidden md:block px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500 font-mono tracking-tighter">
                CMD + K
              </kbd>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Left Sidebar: Categories */}
          <aside className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Sectors</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <motion.button 
                    whileHover={{ x: 5 }}
                    key={cat.name}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 group-hover:text-amber-500">{cat.icon}</span>
                      <span className="text-gray-400 group-hover:text-white transition-colors">{cat.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-600">{cat.count}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Trending Tags Widget */}
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
              <h3 className="text-white text-xs font-bold mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-amber-500" /> Hot Uplinks
              </h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Solidity', 'Figma', 'Python', 'Rust', 'Three.js'].map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-1 bg-black rounded border border-white/5 text-gray-500 hover:text-amber-500 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Content: Discovery Feed */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif italic">Recommended <span className="text-amber-500">Nodes</span></h2>
              <div className="h-[1px] flex-grow bg-white/5 mx-6" />
              <button className="text-[10px] uppercase font-bold tracking-widest text-amber-500 hover:text-white transition-colors">
                View All
              </button>
            </div>

            {/* Placeholder Cards for Communities/Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="group bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:text-amber-500 transition-all">
                    <FiArrowRight size={24} />
                  </div>
                  
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 flex items-center justify-center text-amber-500 text-xl">
                      {i % 2 === 0 ? <FiUsers /> : <FiGlobe />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold group-hover:text-amber-500 transition-colors">
                        {i % 2 === 0 ? "Design Synergy Lab" : "Blockchain Pioneers"}
                      </h4>
                      <p className="text-xs text-gray-500">Founded by Kshitij Jain</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                    A collective of digital architects pushing the boundaries of modern interface design and user psychology.
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(u => (
                        <div key={u} className="w-6 h-6 rounded-full bg-gray-800 border border-black shadow-sm" />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">+420 Active Members</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State / Call to Action */}
            <div className="mt-12 p-10 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FiZap className="text-amber-500" />
              </div>
              <h3 className="text-xl font-serif italic mb-2">Can't find your community?</h3>
              <p className="text-sm text-gray-500 max-w-xs mb-6">Initialize your own node and start recruiting members to your ecosystem.</p>
              <button className="px-8 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-amber-500 transition-colors">
                Create Community
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Explore;