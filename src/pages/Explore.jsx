import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, FiUsers, FiZap, FiGlobe, 
  FiCode, FiCpu, FiLayout, FiDatabase, FiShield, FiSmartphone 
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Explore = () => {
  // Expanded Sectors List
  const categories = [
    { name: "Web3 & Crypto", count: "1.2k", icon: <FiGlobe /> },
    { name: "AI & ML", count: "850", icon: <FiZap /> },
    { name: "UI/UX Design", count: "2.4k", icon: <FiLayout /> },
    { name: "Open Source", count: "3.1k", icon: <FiTrendingUp /> },
    { name: "Cybersecurity", count: "420", icon: <FiShield /> },
    { name: "Backend Architecture", count: "930", icon: <FiDatabase /> },
    { name: "Mobile Dev", count: "1.1k", icon: <FiSmartphone /> },
    { name: "Robotics & Hardware", count: "215", icon: <FiCpu /> },
    { name: "Cloud Computing", count: "670", icon: <FiCode /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />

      {/* Main Content Grid - Padding top increased to account for Navbar since Title is gone */}
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Left Sidebar: Expanded Categories */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="sticky top-32">
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Directory Sectors</h3>
              <div className="space-y-1 mb-10 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
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
            </div>
          </aside>

          {/* Right Content: Clean Canvas */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif italic">Active <span className="text-amber-500">Nodes</span></h2>
              <div className="h-[1px] flex-grow bg-white/5 mx-6" />
            </div>

            {/* Empty state placeholder */}
            <div className="flex flex-col items-center justify-center min-h-[500px] border border-dashed border-white/5 rounded-[3rem] text-center px-6 relative overflow-hidden">
              {/* Subtle background glow for the empty state */}
              <div className="absolute inset-0 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiZap className="text-amber-500 text-2xl" />
                </div>
                <h3 className="text-xl font-serif text-white/80 mb-2">Matrix Initialized</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Select a sector from the directory to discover and connect with community nodes.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Explore;