import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  FiZap, FiGlobe, FiCode, FiCpu, 
  FiLayout, FiDatabase, FiShield, FiSmartphone,
  FiInbox, FiMap, FiArrowRight
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
            <div className="space-y-12 relative">
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

                      <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden group">
                        
                        {/* Improved Full-Image Visibility Layout */}
                        {item.imageUrl && (
                          <div className="w-full bg-white/[0.02] border-b border-white/5 flex items-center justify-center p-4">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-auto max-h-[600px] object-contain rounded-xl shadow-2xl" 
                            />
                          </div>
                        )}

                        <div className="p-7 md:p-12">
                          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white group-hover:text-amber-500 transition-colors">
                            {item.title}
                          </h3>
                          
                          <div className="markdown-container text-gray-300 leading-relaxed text-sm md:text-base mb-10">
                            <ReactMarkdown 
                              components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-amber-500 mt-8 mb-4 flex items-center gap-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-white mt-6 mb-2 underline decoration-amber-500/30 underline-offset-4" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-none space-y-3 mb-6 ml-1" {...props} />,
                                li: ({node, ...props}) => (
                                  <li className="text-gray-400 flex items-start gap-3">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                    {props.children}
                                  </li>
                                ),
                                p: ({node, ...props}) => <p className="mb-4 text-gray-400 leading-loose" {...props} />,
                              }}
                            >
                              {item.content}
                            </ReactMarkdown>
                          </div>

                          <div className="flex items-center justify-between pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                 Powered by <span className="text-white">Linkaura</span>
                               </span>
                            </div>
                            <FiArrowRight className="text-gray-700 group-hover:text-amber-500 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-24 text-center border border-dashed border-white/10 rounded-[3rem] md:ml-24">
                    <FiInbox className="mx-auto text-4xl text-amber-500 mb-4 opacity-20" />
                    <p className="text-gray-500 italic font-serif">Pathways for {selectedPhase} are being forged.</p>
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