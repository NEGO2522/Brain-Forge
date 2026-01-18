import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebase';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiCpu, FiMapPin, FiUser, FiExternalLink } from 'react-icons/fi';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-x-hidden pt-32 pb-20 px-4 md:px-10">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 opacity-20">
        <img src="/Profile.jpg" className="w-full h-full object-cover" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif italic mb-4"
          >
            Neural <span className="text-amber-500">Directory</span>
          </motion.h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.5em] font-black">
            Total Operators Detected: {profiles.length}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map((profile, index) => (
              <ProfileCard key={profile.id} profile={profile} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileCard = ({ profile, index }) => {
  const techStackArray = profile.techStack ? profile.techStack.split(',').map(t => t.trim()) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:border-amber-500/40 transition-all duration-500 relative overflow-hidden"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-[2.5rem] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>

      <div className="relative z-10">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl text-amber-500">
            <FiUser />
          </div>
          <div className="flex gap-3">
            {profile.github && (
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <FiGithub size={18} />
              </a>
            )}
            {profile.linkedin && (
              <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <FiLinkedin size={18} />
              </a>
            )}
          </div>
        </div>

        {/* User Info */}
        <h3 className="text-2xl font-serif italic text-white mb-1">{profile.name || "Anonymous User"}</h3>
        <p className="text-amber-500/60 text-[10px] uppercase tracking-widest font-black mb-4 flex items-center gap-2">
          <FiMapPin className="text-[12px]" /> {profile.address || "Unknown Coordinates"}
        </p>

        <hr className="border-white/5 mb-6" />

        {/* Tech Stack Chips */}
        <div className="space-y-3">
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
        <button className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
          View Detailed Uplink <FiExternalLink />
        </button>
      </div>
    </motion.div>
  );
};

export default Profiles;