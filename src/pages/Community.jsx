import React from 'react';
import { FaDiscord, FaUsers, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CommunityCard = ({ name, description, category, memberCount, discordLink, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10 hover:border-amber-500/50 transition-all duration-500 h-full flex flex-col overflow-hidden"
    >
      {/* Decorative Gradient Glow on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

      <div className="relative bg-black/40 rounded-[calc(1rem-1px)] p-6 h-full flex flex-col z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold italic">
              {category}
            </span>
            <h3 className="text-2xl font-serif text-white group-hover:text-amber-400 transition-colors">
              {name}
            </h3>
          </div>
          <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amber-500/20 transition-colors">
             <FaDiscord className="text-xl text-white/50 group-hover:text-amber-500" />
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
          {description}
        </p>

        <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="w-6 h-6 rounded-full border border-black bg-gray-800 flex items-center justify-center text-[8px] text-white">
                    {i === 3 ? '+' : ''}
                 </div>
               ))}
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">{memberCount} members</span>
          </div>

          <a 
            href={discordLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest hover:gap-4 transition-all"
          >
            Join <FaArrowRight />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Community = () => {
  const communities = [
    { id: 1, name: 'LinkedIn', description: 'Enhance your professional profile and network with industry leaders.', category: 'Networking', memberCount: '2.1k+', discordLink: '#' },
    { id: 2, name: 'Job Opportunities', description: 'Find and share job openings and career advancement opportunities.', category: 'Career', memberCount: '1.8k+', discordLink: '#' },
    { id: 3, name: 'Startup', description: 'Connect with founders, investors, and startup enthusiasts in the ecosystem.', category: 'Entrepreneurship', memberCount: '1.5k+', discordLink: '#' },
    { id: 4, name: 'App Development', description: 'Master mobile and desktop application development across platforms.', category: 'Tech', memberCount: '980+', discordLink: '#' },
    { id: 5, name: 'Gen AI', description: 'Explore the world of Generative AI models and their applications.', category: 'AI', memberCount: '1.1k+', discordLink: '#' },
    { id: 6, name: 'Agentic AI', description: 'Build and understand autonomous AI agents and their ecosystems.', category: 'AI', memberCount: '750+', discordLink: '#' },
    { id: 7, name: 'Deep Learning', description: 'Dive into neural networks and advanced machine learning techniques.', category: 'AI', memberCount: '1.3k+', discordLink: '#' },
    { id: 8, name: 'Web Development', description: 'Build modern web applications and learn from industry experts.', category: 'Tech', memberCount: '1.2k+', discordLink: '#' },
    { id: 9, name: 'Data Science', description: 'Explore data analysis and machine learning with data enthusiasts.', category: 'Learning', memberCount: '850+', discordLink: '#' },
    { id: 10, name: 'Cybersecurity', description: 'Learn security best practices and ethical hacking techniques.', category: 'Tech', memberCount: '720+', discordLink: '#' },
    { id: 11, name: 'Blockchain', description: 'Dive into blockchain technology, Web3, and decentralized applications.', category: 'Tech', memberCount: '950+', discordLink: '#' },
    { id: 12, name: 'Hackathons', description: 'Find hackathons, form teams, and build amazing projects together.', category: 'Events', memberCount: '1.5k+', discordLink: '#' },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        
        {/* Header Section */}
        <div className="mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-500 font-bold tracking-[0.5em] text-xs uppercase block mb-4"
          >
            Digital Ecosystem
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-serif mb-6 leading-tight"
          >
            Brain Forge <br/> 
            <span className="text-amber-500 italic">Communities</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            className="h-1 bg-amber-500 shadow-[0_0_15px_#fbbf24]"
          />
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {communities.map((community, index) => (
            <CommunityCard
              key={community.id}
              index={index}
              {...community}
            />
          ))}
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="py-20 text-center border-t border-white/5">
         <p className="text-[10px] tracking-[0.4em] text-white/20 uppercase">Curated by Kshitij Jain</p>
      </div>
    </div>
  );
};

export default Community;