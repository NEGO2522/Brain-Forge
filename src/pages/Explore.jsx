import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, FiZap, FiGlobe, FiCode, FiCpu, 
  FiLayout, FiDatabase, FiShield, FiSmartphone,
  FiBookmark, FiInbox, FiGrid
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Explore = () => {
  const [selectedSector, setSelectedSector] = useState("All");

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

  const broadcasts = [
    { id: 1, tag: "Web3 & Crypto", title: "The Shift to Layer 2 Ecosystems", content: "As mainnet congestion increases, we are observing a massive migration of community nodes to ZK-Rollup frameworks.", admin: "Forge Admin" },
    { id: 2, tag: "AI & ML", title: "Integrating LLMs into Community Workflows", content: "Neural nodes are now utilizing local-first LLMs to moderate discussions and automate resource indexing.", admin: "Forge Admin" },
    { id: 3, tag: "Backend Architecture", title: "Distributed Systems and Node Resiliency", content: "Resilient backends are shifting toward edge-computing architectures to ensure accessibility.", admin: "Forge Admin" },
    { id: 4, tag: "UI/UX Design", title: "Spatial Interfaces in Modern Apps", content: "Designers are moving beyond flat surfaces. Implementing Z-axis depth and glassmorphism.", admin: "Forge Admin" },
    { id: 5, tag: "Cybersecurity", title: "Zero Trust Node Verification", content: "Security is no longer a perimeter. Every node interaction must be verified independently.", admin: "Forge Admin" }
  ];

  const filteredBroadcasts = selectedSector === "All" 
    ? broadcasts 
    : broadcasts.filter(post => post.tag === selectedSector);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-20">
        {/* Responsive Grid: Column on mobile, Sidebar on LG */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Left Sidebar / Top Scroller */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 lg:mb-6">
                Directory Sectors
              </h3>
              
              {/* Sidebar container: Vertical on Desktop, Horizontal Scroll on Mobile */}
              <div className="flex lg:flex-col gap-2 lg:space-y-1 mb-6 lg:mb-10 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 scrollbar-hide">
                
                {/* ALL SECTORS BUTTON */}
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSector("All")}
                  className={`flex-shrink-0 flex items-center justify-between p-3 rounded-xl transition-all text-sm group border lg:w-full ${
                    selectedSector === "All" 
                      ? 'bg-amber-500/10 border-amber-500/50 text-white' 
                      : 'hover:bg-white/5 border-transparent text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={selectedSector === "All" ? 'text-amber-500' : 'text-gray-500 group-hover:text-amber-500'}>
                      <FiGrid />
                    </span>
                    <span className="font-bold uppercase tracking-widest text-[11px] whitespace-nowrap">All Sectors</span>
                  </div>
                </motion.button>

                {/* List of Sectors */}
                {categories.map((cat) => (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    key={cat.name}
                    onClick={() => setSelectedSector(cat.name)}
                    className={`flex-shrink-0 flex items-center justify-between p-3 rounded-xl transition-all text-sm group border lg:w-full ${
                      selectedSector === cat.name 
                        ? 'bg-amber-500/10 border-amber-500/50 text-white' 
                        : 'hover:bg-white/5 border-transparent text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={selectedSector === cat.name ? 'text-amber-500' : 'text-gray-500 group-hover:text-amber-500'}>
                        {cat.icon}
                      </span>
                      <span className="group-hover:text-white whitespace-nowrap">{cat.name}</span>
                    </div>
                    {/* Count hidden on mobile to save space */}
                    <span className="hidden lg:block text-[10px] font-mono opacity-50 ml-4">{cat.count}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Content */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 lg:mb-10">
              <h2 className="text-xl md:text-2xl font-serif italic whitespace-nowrap">
                {selectedSector === "All" ? "Ecosystem" : selectedSector} <span className="text-amber-500">Insights</span>
              </h2>
              <div className="h-[1px] flex-grow bg-white/5 mx-4 md:mx-6" />
            </div>

            <div className="space-y-6">
              <AnimatePresence mode='popLayout'>
                {filteredBroadcasts.length > 0 ? (
                  filteredBroadcasts.map((post) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={post.id}
                      className="group bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 hover:border-amber-500/30 transition-all duration-500"
                    >
                      <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-500 border border-white/5">
                            {post.tag}
                          </span>
                          <button className="text-gray-600 hover:text-amber-500 transition-colors">
                            <FiBookmark size={16}/>
                          </button>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold group-hover:text-amber-500 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-sm max-w-2xl">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-bold text-[10px]">
                            BF
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{post.admin}</p>
                            <p className="text-[10px] text-gray-600 uppercase tracking-tighter">Verified Authority</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 md:py-20 border border-dashed border-white/10 rounded-[2rem]"
                  >
                    <FiInbox className="text-amber-500 text-3xl md:text-4xl mb-4 opacity-50" />
                    <p className="text-gray-500 font-serif italic text-base md:text-lg">No insights archived for {selectedSector}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Explore;