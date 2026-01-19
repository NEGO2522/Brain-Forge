import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZap, FiGlobe, FiCode, FiCpu, 
  FiLayout, FiDatabase, FiShield, FiSmartphone,
  FiInbox, FiCheckCircle, FiClock, FiLayers, FiMap
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
          ...data[key],
          status: data[key].status || (Math.random() > 0.5 ? "Completed" : "In Progress")
        })).reverse();
        setMilestones(list);
      } else {
        setMilestones([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filtered only by the selected skill domain
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
            <span className="text-amber-500">Linkora</span> Roadmap
          </h1>
          <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
            Select a domain to view the structured learning path and technical milestones. 
            Track the evolution of modern skill sets within the Linkora ecosystem.
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* SIDEBAR - Domain Selector Only */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-32">
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                Select Domain
              </h3>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
                {categories.map((cat) => (
                  <button 
                    key={cat.name}
                    onClick={() => setSelectedPhase(cat.name)}
                    className={`flex-shrink-0 flex items-center p-3 rounded-xl transition-all text-sm group border lg:w-full ${
                      selectedPhase === cat.name 
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/5' 
                        : 'hover:bg-white/5 border-transparent text-gray-500'
                    }`}
                  >
                    <span className={`mr-3 transition-colors ${selectedPhase === cat.name ? 'text-amber-500' : 'text-gray-600 group-hover:text-amber-500'}`}>
                      {cat.icon}
                    </span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MILESTONE CONTENT */}
          <section className="lg:col-span-3">
            <div className="space-y-8 relative">
              {/* Vertical Timeline Thread */}
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
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="relative pl-0 md:pl-24"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-8 md:left-[34px] top-9 hidden md:flex items-center justify-center w-3 h-3 rounded-full bg-black border-2 border-amber-500 z-10" />

                      <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-7 md:p-10 hover:bg-white/[0.06] transition-all duration-500 group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              item.status === "Completed" 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                            }`}>
                              {item.status === "Completed" ? <FiCheckCircle /> : <FiClock />} {item.status}
                            </span>
                            <span className="text-[10px] text-gray-600 font-mono tracking-tighter uppercase">Ref: {item.id.slice(-6)}</span>
                          </div>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-amber-500 transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-8 max-w-3xl">
                          {item.content}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-white/5">
                           <div className="flex gap-8">
                             <div>
                                <p className="text-[9px] text-gray-600 uppercase mb-1 font-bold">Pathway</p>
                                <p className="text-xs text-white">{selectedPhase}</p>
                             </div>
                             <div>
                                <p className="text-[9px] text-gray-600 uppercase mb-1 font-bold">Level</p>
                                <p className="text-xs text-white">Core Tech</p>
                             </div>
                           </div>
                           
                           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-white transition-colors">
                              <FiLayers className="text-sm" /> View Details
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-24 text-center border border-dashed border-white/10 rounded-[3rem] md:ml-24 bg-white/[0.01]">
                    <FiInbox className="mx-auto text-4xl text-amber-500 mb-4 opacity-20" />
                    <p className="text-gray-500 italic font-serif">No milestones found for {selectedPhase}.</p>
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