import React from 'react';
import { motion } from 'framer-motion';
import { FaDiscord, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone, FaChevronRight } from 'react-icons/fa';
import { RotatingFanIcon } from '../components/RotatingFanIcon';

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
  return (
    <div className="h-screen w-full bg-black text-white relative overflow-hidden flex flex-col pt-20 pb-4 px-6">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full h-full flex flex-col relative z-10 overflow-hidden">
        
        {/* Header Area */}
        <div className="mb-6 flex-shrink-0 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-serif leading-none"
          >
            Connect With <span className="text-amber-500 italic">Us</span>
          </motion.h1>
        </div>

        {/* Main Layout */}
        <div className="flex-grow flex flex-col lg:grid lg:grid-cols-12 gap-4 min-h-0 mb-2">
          
          {/* LEFT: Main Contact & Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 flex flex-col min-h-0"
          >
            <div className="flex-grow bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 md:p-6 flex flex-col overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-0">
                
                {/* Contact List */}
                <div className="flex flex-col justify-between py-1 overflow-hidden">
                  <div className="space-y-3">
                    <h2 className="text-lg font-serif text-white mb-4">Network Nodes</h2>
                    <ContactItem icon={FaMapMarkerAlt} title="Location" content="Jaipur, Rajasthan" />
                    <ContactItem icon={FaEnvelope} title="Email" content="nextgenova28@gmail.com" link="mailto:nextgenova28@gmail.com" />
                    <ContactItem icon={FaPhone} title="Phone" content="+91 94139 73399" link="tel:+919413973399" />
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">Social Uplink</h3>
                    <div className="flex space-x-2">
                      {[
                        { icon: FaDiscord, link: "#", color: "hover:border-[#5865F2] hover:text-[#5865F2]" },
                        { icon: FaLinkedin, link: "https://www.linkedin.com/company/brainforge16", color: "hover:border-[#0077b5] hover:text-[#0077b5]" }
                      ].map((social, i) => (
                        <a 
                          key={i} 
                          href={social.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 bg-white/5 ${social.color}`}
                        >
                          <social.icon className="text-base" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Section */}
                <div className="relative rounded-[1.5rem] overflow-hidden border border-white/10 flex-grow h-full bg-black/40">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.38256243203!2d75.65046927376363!3d26.88544791816565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adb4feed511%3A0x81718a2e4862a028!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin" 
                    width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.8)' }} 
                    allowFullScreen="" loading="lazy" title="Jaipur Map"
                  />
                  <div className="absolute inset-0 pointer-events-none border-[4px] border-black/20 rounded-[1.5rem]"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Join Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 flex flex-col min-h-0"
          >
            <div className="flex-grow bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-xl rounded-[2rem] border border-amber-500/20 p-6 flex flex-col justify-between items-center text-center overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <RotatingFanIcon>
                    <div className="w-12 h-12 rounded-full bg-amber-500/5 flex items-center justify-center border border-amber-500/20">
                      <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </RotatingFanIcon>
                </div>
                
                <h2 className="text-xl font-serif text-white mb-1 italic">Brain Forge</h2>
                <p className="text-gray-400 text-[10px] leading-relaxed max-w-[180px]">
                  Join our elite circle of innovators and master the digital frontier.
                </p>
              </div>

              <div className="w-full space-y-2 my-4 flex-grow flex flex-col justify-center">
                {["Elite Network", "Tech Ecosystem", "Expert Mentorship"].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-left bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                    <span className="text-[9px] uppercase tracking-widest text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <a 
                href="https://www.linkedin.com/company/brainforge16" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-amber-500 text-black font-bold text-[10px] rounded-xl flex items-center justify-center space-x-2 shadow-[0_10px_30px_rgba(251,191,36,0.2)]"
                >
                  <span>JOIN THE FORGE</span>
                  <FaChevronRight className="text-[8px]" />
                </motion.button>
              </a>
            </div>
          </motion.div>

        </div>

        {/* Footer Branding */}
        <div className="flex-shrink-0 text-center pb-2">
          <p className="text-[7px] tracking-[0.8em] text-white/20 uppercase font-bold">Organized By Kshitij Jain</p>
        </div>
      </div>
    </div>
  );
};

export default Connect;