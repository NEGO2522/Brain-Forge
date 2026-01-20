import React from 'react';
import { motion } from 'framer-motion';
import { FaDiscord, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone, FaChevronRight, FaTerminal, FaUsers, FaLayerGroup } from 'react-icons/fa';
import { RotatingFanIcon } from '../components/RotatingFanIcon';
import Navbar from '../components/Navbar';

const ContactItem = ({ icon: Icon, title, content, link }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-center space-x-3 group p-2 rounded-xl hover:bg-white/5 transition-all duration-300"
  >
    <div className="flex-shrink-0 bg-amber-500/10 p-2.5 rounded-lg group-hover:bg-amber-500/20 transition-colors">
      <Icon className="h-4 w-4 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
    </div>
    <div className="min-w-0">
      <h3 className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold leading-tight">{title}</h3>
      {link ? (
        <a href={link} className="text-white hover:text-amber-400 transition-colors font-serif text-sm truncate block">
          {content}
        </a>
      ) : (
        <p className="text-white font-serif text-sm tracking-wide leading-tight truncate">{content}</p>
      )}
    </div>
  </motion.div>
);

const Connect = () => {
  const DISCORD_LINK = "https://discord.com/invite/7CSFqfaxMp";
  const LINKEDIN_LINK = "https://www.linkedin.com/company/brainforge16"; 

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-x-hidden flex flex-col pt-20 pb-6 px-4 md:px-6">
      <Navbar />
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col relative z-10">
        
        <div className="mb-6 md:mb-10 flex-shrink-0 text-center lg:text-left pt-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight"
          >
            Connect With <span className="text-amber-500 italic">Us</span>
          </motion.h1>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 mb-8">
          
          {/* LEFT SECTION - HEIGHT REDUCED & COMPACTED */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-5 md:p-6 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Compact Text Content */}
                <div className="flex flex-col space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-lg font-serif text-white mb-2 tracking-tight flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                      Network Nodes
                    </h2>
                    <ContactItem icon={FaMapMarkerAlt} title="Location" content="Jaipur, Rajasthan" />
                    <ContactItem icon={FaEnvelope} title="Email" content="nextgenova28@gmail.com" link="mailto:nextgenova28@gmail.com" />
                    <ContactItem icon={FaPhone} title="Phone" content="+91 94139 73399" link="tel:+919413973399" />
                  </div>
                  
                  <div>
                    <h3 className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">Social Uplink</h3>
                    <div className="flex space-x-2">
                      {[
                        { icon: FaDiscord, link: DISCORD_LINK, color: "hover:border-[#5865F2] hover:text-[#5865F2]" },
                        { icon: FaLinkedin, link: LINKEDIN_LINK, color: "hover:border-[#0077b5] hover:text-[#0077b5]" }
                      ].map((social, i) => (
                        <a 
                          key={i} 
                          href={social.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 bg-white/5 ${social.color}`}
                        >
                          <social.icon className="text-lg" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map - Now matches the text height more closely */}
                <div className="relative rounded-[1.5rem] overflow-hidden border border-white/10 h-[220px] md:h-full bg-black/40">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624311!2d75.65047033534571!3d26.88544791845112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adb4ad85659%3A0x139059bc57d0ad61!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                    width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.8)' }} 
                    allowFullScreen="" loading="lazy" title="Jaipur Map"
                  />
                  <div className="absolute inset-0 pointer-events-none border-[4px] border-black/20 rounded-[1.5rem]"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SECTION - LINKAURA HUB */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-xl rounded-[2.5rem] border border-amber-500/20 p-6 md:p-8 flex flex-col h-full">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                   <RotatingFanIcon>
                    <div className="w-12 h-12 rounded-full bg-amber-500/5 flex items-center justify-center border border-amber-500/20">
                      <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </RotatingFanIcon>
                  <div>
                    <h2 className="text-2xl font-serif text-white leading-none italic uppercase tracking-tighter">Linkaura</h2>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500 font-black">Community Hub</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-500 uppercase">Live</span>
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex items-center space-x-2 text-gray-400">
                  <FaTerminal className="text-xs" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Mission Brief</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed font-light italic border-l-2 border-amber-500/30 pl-4">
                  "Linking ambitious minds to the future of technology through collaborative ecosystems."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <FaUsers className="text-amber-500 text-sm" />
                    <span className="text-[9px] text-gray-500 uppercase">Members</span>
                  </div>
                  <p className="text-2xl font-serif text-white tracking-tighter">200+</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-2 h-2 rounded-full border-2 border-amber-500" />
                    <span className="text-[9px] text-gray-500 uppercase">Uptime</span>
                  </div>
                  <p className="text-2xl font-serif text-white tracking-tighter">99.9%</p>
                </div>
              </div>

              <div className="w-full space-y-2 mb-6">
                {["Elite Network Access", "Tech Stack Ecosystem", "Direct Mentorship"].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-left bg-white/5 p-3 rounded-xl border border-white/5 hover:border-amber-500/20 transition-colors">
                    <div className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="w-full p-4 bg-white/5 rounded-[2rem] border border-white/5 mb-6 space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                    <FaLayerGroup className="text-amber-500 text-xs" />
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">Roadmap</span>
                   </div>
                   <span className="text-[9px] text-amber-500 font-mono">PHASE 02</span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "65%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-amber-500"
                  />
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <a href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer" className="w-full block">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-amber-500 text-black font-black text-xs rounded-2xl flex items-center justify-center space-x-3 shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:bg-amber-400 transition-all group"
                  >
                    <span className="uppercase tracking-[0.2em]">JOIN LINKAURA</span>
                    <FaChevronRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </a>
              </div>
            </div>
          </motion.div>

        </div>

        <div className="flex-shrink-0 text-center pb-4 mt-auto">
          <p className="text-[8px] md:text-[10px] tracking-[0.6em] text-white/20 uppercase font-bold">
            Organized By Kshitij Jain & Manish Kumar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Connect;