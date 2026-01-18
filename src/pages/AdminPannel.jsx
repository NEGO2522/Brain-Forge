import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSend, FiTrash2, FiPlusCircle, FiBarChart2, 
  FiCheckCircle, FiAlertCircle, FiLayers 
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

// Corrected Import Path
import { db } from '../firebase/firebase'; 
import { ref, push, onValue, remove, serverTimestamp } from "firebase/database";

const AdminPanel = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', tag: 'Web3 & Crypto', content: '' });
  const [status, setStatus] = useState(null);

  const categories = [
    "Web3 & Crypto", "AI & ML", "UI/UX Design", "Open Source",
    "Cybersecurity", "Backend Architecture", "Mobile Dev",
    "Robotics & Hardware", "Cloud Computing",
  ];

  // Sync with Firebase Realtime Database
  useEffect(() => {
    const broadcastsRef = ref(db, 'forge_broadcasts');
    const unsubscribe = onValue(broadcastsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse(); 
        setBroadcasts(list);
      } else {
        setBroadcasts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      showStatus('error');
      return;
    }

    try {
      const broadcastsRef = ref(db, 'forge_broadcasts');
      await push(broadcastsRef, {
        ...newPost,
        admin: "Forge Admin",
        createdAt: serverTimestamp()
      });

      setNewPost({ title: '', tag: 'Web3 & Crypto', content: '' });
      showStatus('success');
    } catch (error) {
      console.error("Firebase Deploy Error:", error);
      showStatus('error');
    }
  };

  const deletePost = async (id) => {
    try {
      const postRef = ref(db, `forge_broadcasts/${id}`);
      await remove(postRef);
    } catch (error) {
      console.error("Firebase Delete Error:", error);
    }
  };

  const showStatus = (type) => {
    setStatus(type);
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="h-screen w-full bg-black text-white selection:bg-amber-500/30 overflow-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 pt-28 pb-6 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-row items-end justify-between mb-8 flex-shrink-0">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-serif italic mb-1"
            >
              Control <span className="text-amber-500">Center</span>
            </motion.h1>
            <p className="text-gray-500 text-[8px] tracking-[0.5em] uppercase font-bold">
              Broadcast Intelligence to the Ecosystem
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <p className="text-[7px] uppercase tracking-widest text-gray-500 mb-0.5">Cloud Sync Active</p>
            <p className="text-lg font-serif text-amber-500 leading-none">{broadcasts.length}</p>
          </div>
        </div>

        {/* Main Grid Area */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden mb-6">
          
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 flex flex-col min-h-0"
          >
            <div className="flex-grow bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 relative overflow-hidden flex flex-col">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
              <h2 className="text-lg font-serif mb-6 flex items-center gap-3 flex-shrink-0">
                <FiPlusCircle className="text-amber-500" /> New Broadcast
              </h2>

              <form onSubmit={handleAddPost} className="flex-grow flex flex-col space-y-4 min-h-0">
                <div className="space-y-1.5 flex-shrink-0">
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold ml-1">Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter headline..."
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-amber-500/50 outline-none text-sm transition-all"
                  />
                </div>
                
                <div className="space-y-1.5 flex-shrink-0">
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold ml-1">Sector</label>
                  <div className="relative">
                    <select 
                      value={newPost.tag}
                      onChange={(e) => setNewPost({...newPost, tag: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl p-3 focus:border-amber-500/50 outline-none cursor-pointer appearance-none text-sm text-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                      ))}
                    </select>
                    <FiLayers className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div className="flex-grow flex flex-col space-y-1.5 min-h-0">
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 font-bold ml-1">Content</label>
                  <textarea 
                    placeholder="Provide insights..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="flex-grow w-full bg-black border border-white/10 rounded-xl p-4 focus:border-amber-500/50 outline-none transition-all resize-none text-sm leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center gap-4 flex-shrink-0">
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="flex-grow bg-amber-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase shadow-lg"
                  >
                    <FiSend /> Deploy to Cloud
                  </motion.button>

                  <AnimatePresence>
                    {status && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex items-center gap-1 ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {status === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                        <span className="text-[9px] font-bold uppercase">{status === 'success' ? 'Live' : 'Error'}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col min-h-0"
          >
            <div className="flex-grow bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col overflow-hidden">
              <h2 className="text-lg font-serif mb-4 flex items-center gap-3 flex-shrink-0">
                <FiBarChart2 className="text-amber-500" /> Active Feed
              </h2>
              
              <div className="flex-grow overflow-y-auto pr-2 scrollbar-hide space-y-3">
                {broadcasts.length > 0 ? (
                  broadcasts.map((post) => (
                    <motion.div 
                      layout
                      key={post.id} 
                      className="group bg-black/40 border border-white/5 p-4 rounded-xl hover:border-amber-500/30 transition-all relative"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[7px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                          {post.tag}
                        </span>
                        <button onClick={() => deletePost(post.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      <h4 className="font-bold text-xs group-hover:text-amber-500 transition-colors truncate">{post.title}</h4>
                      <p className="text-gray-500 text-[10px] line-clamp-1 italic mt-1">"{post.content}"</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10">
                    <FiLayers size={32} />
                    <p className="text-[10px] mt-2 uppercase tracking-widest">Syncing...</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-end items-center flex-shrink-0 pt-2 border-t border-white/5">
          <p className="text-[8px] tracking-[0.6em] text-white/30 uppercase font-bold">
            Organized By Kshitij Jain
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;