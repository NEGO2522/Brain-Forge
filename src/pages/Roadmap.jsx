import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. IMPORT REACT MARKDOWN
import ReactMarkdown from 'react-markdown';
import { 
  FiZap, FiGlobe, FiCode, FiCpu, 
  FiLayout, FiDatabase, FiShield, FiSmartphone,
  FiInbox, FiLayers, FiMap, FiImage
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

// Firebase Database
import { db } from '../firebase/firebase'; 
import { ref, onValue } from "firebase/database";

const Roadmap = () => {
  const [selectedPhase, setSelectedPhase] = useState("Web3 & Crypto");
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Web3 & Crypto", icon: <FiGlobe /> },
    { name: "AI & ML", icon: <FiZap /> },
    { name: "UI/UX Design", icon: <FiLayout /> },
    { name: "Cybersecurity", icon: <FiShield /> },
    { name: "Backend Architecture", icon: <FiDatabase /> },
    { name: "Mobile Dev", icon: <FiSmartphone /> },
    { name: "Cloud Computing", icon: <FiCode /> },
  ];

  useEffect(() => {
    const roadmapRef = ref(db, 'forge_broadcasts');
    const unsubscribe = onValue(roadmapRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse();
        setMilestones(list);
      } else {
        setMilestones([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredMilestones = milestones.filter(item => item.tag === selectedPhase);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-20">
        
        {/* HERO SECTION */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <FiMap className="text-amber-500 w-5 h-5" />
            </div>
            <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">Skill Pathways</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-6">
            <span className="text-amber-500">Linkaura</span> Roadmap
          </h1>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 lg:gap-12">
          
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Select Domain</h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                {categories.map((cat) => (
                  <button 
                    key={cat.name}
                    onClick={() => setSelectedPhase(cat.name)}
                    className={`flex-shrink-0 flex items-center p-3 rounded-xl transition-all text-sm group border lg:w-full ${
                      selectedPhase === cat.name 
                        ? 'bg-amber-500/10 border-amber-500/50 text-white' 
                        : 'hover:bg-white/5 border-transparent text-gray-500'
                    }`}
                  >
                    <span className={`mr-3 ${selectedPhase === cat.name ? 'text-amber-500' : 'text-gray-600'}`}>
                      {cat.icon}
                    </span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="space-y-8 relative">
              <div className="absolute left-6 md:left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-amber-500/30 via-white/10 to-transparent hidden md:block" />

              <AnimatePresence mode='popLayout'>
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-white/5 border-t-amber-500 rounded-full animate-spin" />
                  </div>
                ) : filteredMilestones.length > 0 ? (
                  filteredMilestones.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative pl-0 md:pl-24"
                    >
                      <div className="absolute left-8 md:left-[34px] top-9 hidden md:flex items-center justify-center w-3 h-3 rounded-full bg-black border-2 border-amber-500 z-10" />

                      <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.04] transition-all duration-500 group">
                        
                        {item.imageUrl && (
                          <div className="w-full h-48 md:h-80 overflow-hidden border-b border-white/5">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="p-7 md:p-10">
                          <h3 className="text-3xl font-bold mb-6 text-amber-500">
                            {item.title}
                          </h3>
                          
                          {/* 2. RENDER MARKDOWN CONTENT HERE */}
                          <div className="markdown-container text-gray-300 leading-relaxed text-sm md:text-base mb-8">
                            <ReactMarkdown 
                              components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-amber-400 mt-4 mb-2" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 ml-2" {...props} />,
                                li: ({node, ...props}) => <li className="text-gray-400" {...props} />,
                                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                              }}
                            >
                              {item.content}
                            </ReactMarkdown>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-white/5">
                            <div className="flex gap-8">
                              <div>
                                <p className="text-[9px] text-gray-600 uppercase mb-1 font-bold">Pathway</p>
                                <p className="text-xs text-white">{selectedPhase}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-gray-600 uppercase mb-1 font-bold">Standard</p>
                                <p className="text-xs text-white">v2.0 Path</p>
                              </div>
                            </div>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500">
                               Ref: {item.id.slice(-6)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-24 text-center border border-dashed border-white/10 rounded-[3rem] md:ml-24">
                    <FiInbox className="mx-auto text-4xl text-amber-500 mb-4 opacity-20" />
                    <p className="text-gray-500 italic font-serif">No milestones found.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;