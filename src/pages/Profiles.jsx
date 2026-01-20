import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiCpu, FiMapPin, FiUser, FiExternalLink, FiSearch, FiCalendar } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, 'userProfiles'));
        const profileData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProfiles(profileData);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.techStack?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-x-hidden pt-32 pb-20 px-4 md:px-10">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img src="/Profile.jpg" className="w-full h-full object-cover" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section - Shifted to Left */}
        <div className="mb-12 text-left">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-serif italic mb-4"
          >
            Neural <span className="text-amber-500">Directory</span>
          </motion.h1>
          <div className="w-24 h-1 bg-amber-500 mb-8 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          
          {/* Search Bar - Shifted to Left */}
          <div className="max-w-md relative mb-8">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50" />
            <input 
              type="text"
              placeholder="Search by name or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-12 outline-none focus:border-amber-500/50 transition-all text-sm uppercase tracking-widest font-bold placeholder:text-gray-600"
            />
          </div>

          <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em] font-black ml-1">
            Total Operators Detected: {filteredProfiles.length}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-start h-64 gap-4 ml-1">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
            <p className="text-[10px] uppercase tracking-widest text-amber-500/50">Initializing Uplink...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProfiles.map((profile, index) => (
                <ProfileCard key={profile.id} profile={profile} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProfiles.length === 0 && (
          <div className="py-20 opacity-30 italic font-serif text-left">
            No operators found in this sector.
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileCard = ({ profile, index }) => {
  const techStackArray = profile.techStack ? profile.techStack.split(',').map(t => t.trim()) : [];

  const linkedinUrl = profile.linkedin?.startsWith('http') 
    ? profile.linkedin 
    : `https://linkedin.com/in/${profile.linkedin}`;

  const githubUrl = profile.github?.startsWith('http') 
    ? profile.github 
    : `https://github.com/${profile.github}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:border-amber-500/40 transition-all duration-500 relative overflow-hidden flex flex-col h-full"
    >
      {/* Hover Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-[2.5rem] blur opacity-0 group-hover:opacity-10 transition duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl text-amber-500 shadow-inner">
            <FiUser />
          </div>
          
          {/* YEAR BADGE */}
          {profile.year && (
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
              <FiCalendar className="text-amber-500 text-[10px]" />
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Year 0{profile.year}</span>
            </div>
          )}

          <div className="flex gap-2">
            {profile.github && (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-lg">
                <FiGithub size={16} />
              </a>
            )}
            {profile.linkedin && (
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-lg">
                <FiLinkedin size={16} />
              </a>
            )}
          </div>
        </div>

        {/* User Info */}
        <h3 className="text-2xl font-serif italic text-white mb-1 truncate">{profile.name || "Anonymous User"}</h3>
        
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-amber-500/60 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
            <FiMapPin className="text-[12px]" /> {profile.address || "Unknown Coordinates"}
          </p>
        </div>

        <hr className="border-white/5 mb-6" />

        {/* Tech Stack Chips */}
        <div className="space-y-3 flex-grow">
          <label className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black">
            <FiCpu className="text-amber-500" /> Core Matrix
          </label>
          <div className="flex flex-wrap gap-2">
            {techStackArray.length > 0 ? techStackArray.map((tech, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-tighter text-gray-300 group-hover:border-amber-500/20 transition-colors"
              >
                {tech}
              </span>
            )) : (
              <span className="text-gray-600 text-[10px] italic">No modules loaded</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        {profile.linkedin ? (
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noreferrer"
            className="w-full mt-8 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            View Detailed Uplink <FiExternalLink />
          </a>
        ) : (
          <button 
            disabled
            className="w-full mt-8 py-4 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] opacity-30 cursor-not-allowed flex items-center justify-center gap-2"
          >
            Uplink Unavailable <FiExternalLink />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Profiles;