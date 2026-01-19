import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiTrash2, FiSend, FiDatabase, 
  FiLayers, FiImage, FiAlertCircle, FiExternalLink 
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

// Firebase
import { db } from '../firebase/firebase';
import { ref, push, set, onValue, remove } from "firebase/database";

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    tag: 'Web3 & Crypto', 
    imageUrl: '' 
  });

  const categories = [
    "Web3 & Crypto", "AI & ML", "UI/UX Design", 
    "Cybersecurity", "Backend Architecture", 
    "Mobile Dev", "Cloud Computing"
  ];

  useEffect(() => {
    const roadmapRef = ref(db, 'forge_broadcasts');
    onValue(roadmapRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMilestones(list.reverse());
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return alert("Title and Content are required");
    setLoading(true);
    try {
      const roadmapRef = ref(db, 'forge_broadcasts');
      await push(roadmapRef, { ...formData, timestamp: Date.now() });
      setFormData({ ...formData, title: '', content: '', imageUrl: '' });
      alert("Roadmap Updated Successfully!");
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <FiDatabase size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-serif italic">Linkora <span className="text-amber-500">Editor</span></h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em]">Content Management System</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-amber-500 text-xs font-mono">{milestones.length} Active Nodes</p>
          </div>
        </div>

        {/* Increased width for the form using a 12-column grid */}
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* LEFT: THE WIDE FORM (Col span 7) */}
          <section className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <FiPlus className="text-amber-500" /> New Roadmap Node
                </h2>
                <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest font-bold">Draft Mode</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Domain Category</label>
                  <select 
                    value={formData.tag} 
                    onChange={(e) => setFormData({...formData, tag: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Node Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Advanced Neural Architectures" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-amber-500 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Roadmap Visual (Image URL)</label>
                <div className="relative">
                  <FiImage className="absolute left-5 top-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Paste URL: https://images.unsplash.com/..." 
                    value={formData.imageUrl} 
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                    className="w-full bg-black border border-white/10 rounded-2xl pl-14 pr-5 py-4 text-sm outline-none focus:border-amber-500 transition-all font-mono text-amber-500/70" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest ml-1">Technical Documentation / Description</label>
                <textarea 
                  rows="8" 
                  placeholder="Explain the learning path or technical milestone in detail..." 
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-amber-500 transition-all resize-none leading-relaxed" 
                />
              </div>

              <button 
                disabled={loading} 
                className="w-full bg-white text-black font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl hover:bg-amber-500 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {loading ? "Syncing with Linkora..." : <><FiSend /> Deploy Milestone</>}
              </button>
            </form>
          </section>

          {/* RIGHT: LIST VIEW (Col span 5) */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-lg font-bold flex items-center gap-2">
                 <FiLayers className="text-amber-500" /> Live Nodes
               </h2>
               <button onClick={() => window.location.reload()} className="text-[10px] text-gray-500 hover:text-white transition-colors uppercase font-bold tracking-tighter">Refresh Sync</button>
            </div>
            
            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence>
                {milestones.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id} 
                    className="group bg-white/[0.02] border border-white/5 p-4 rounded-3xl flex items-center justify-between hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700"><FiImage /></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-amber-500 font-black uppercase">{item.tag}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                       <button 
                        onClick={() => remove(ref(db, `forge_broadcasts/${item.id}`))} 
                        className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Delete Node"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {milestones.length === 0 && (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-[2.5rem]">
                  <FiAlertCircle className="mx-auto text-gray-700 text-3xl mb-3" />
                  <p className="text-gray-500 text-sm italic">No roadmap nodes found.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;