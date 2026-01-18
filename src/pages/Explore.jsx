import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, FiZap, FiGlobe, FiCode, FiCpu, 
  FiLayout, FiDatabase, FiShield, FiSmartphone,
  FiBookmark
} from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Explore = () => {
  // Directory Sectors List
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

  // --- UPDATED: SECTOR-SPECIFIC BROADCASTS ---
  const broadcasts = [
    {
      id: 1,
      tag: "Web3 & Crypto",
      title: "The Shift to Layer 2 Ecosystems",
      content: "As mainnet congestion increases, we are observing a massive migration of community nodes to ZK-Rollup frameworks. For developers, this means prioritizing EVM-compatible scaling solutions to maintain low-latency interactions within your community matrix.",
      admin: "Forge Admin",
      icon: <FiGlobe />
    },
    {
      id: 2,
      tag: "AI & ML",
      title: "Integrating LLMs into Community Workflows",
      content: "Neural nodes are now utilizing local-first LLMs to moderate discussions and automate resource indexing. We recommend exploring vectorized databases to allow your community's collective knowledge to be instantly searchable by AI agents.",
      admin: "Forge Admin",
      icon: <FiZap />
    },
    {
      id: 3,
      tag: "Backend Architecture",
      title: "Distributed Systems and Node Resiliency",
      content: "Resilient backends are shifting toward edge-computing architectures. By distributing your node's logic across multiple geographic regions, you ensure that your community ecosystem remains accessible even during localized network failures.",
      admin: "Forge Admin",
      icon: <FiDatabase />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Left Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32">
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Directory Sectors</h3>
              <div className="space-y-1 mb-10 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
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

              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
                <h3 className="text-white text-xs font-bold mb-4 flex items-center gap-2">
                  <FiTrendingUp className="text-amber-500" /> Hot Uplinks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Solidity', 'Figma', 'Python'].map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 bg-black rounded border border-white/5 text-gray-500 hover:text-amber-500 cursor-pointer transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content: Sector-Specific Feed */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-serif italic">Sector <span className="text-amber-500">Insights</span></h2>
              <div className="h-[1px] flex-grow bg-white/5 mx-6" />
            </div>

            <div className="space-y-6">
              {broadcasts.map((post, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={post.id}
                  className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-500 border border-white/5">
                        {post.tag}
                      </span>
                      <button className="text-gray-600 hover:text-amber-500 transition-colors">
                        <FiBookmark size={16}/>
                      </button>
                    </div>

                    <h3 className="text-2xl font-bold group-hover:text-amber-500 transition-colors">
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
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Explore;