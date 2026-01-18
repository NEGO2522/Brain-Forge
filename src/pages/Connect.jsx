import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaDiscord, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone, FaChevronRight } from 'react-icons/fa';
import { RotatingFanIcon } from '../components/RotatingFanIcon';

const ContactItem = ({ icon: Icon, title, content, link }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    className="flex items-center space-x-3 group p-2 rounded-xl hover:bg-white/5 transition-all duration-300"
  >
    <div className="flex-shrink-0 bg-amber-500/10 p-3 rounded-lg group-hover:bg-amber-500/20 transition-colors">
      <Icon className="h-5 w-5 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
    </div>
    <div>
      <h3 className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-bold">{title}</h3>
      {link ? (
        <a href={link} className="text-white hover:text-amber-400 transition-colors font-serif text-sm md:text-base tracking-wide block">
          {content}
        </a>
      ) : (
        <p className="text-white font-serif text-sm md:text-base tracking-wide leading-none">{content}</p>
      )}
    </div>
  </motion.div>
);

const Connect = () => {
  return (
    // Changed h-screen to min-h-screen for mobile and allowed lg:h-screen for desktop
    <div className="min-h-screen lg:h-screen w-full bg-black text-white relative overflow-x-hidden flex flex-col pt-24 md:pt-20 pb-10 md:pb-6 px-6">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] lg:w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] lg:w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full h-full flex flex-col relative z-10">
        
        {/* Header Area */}
        <div className="mb-8 flex-shrink-0 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif leading-none"
          >
            Connect With <span className="text-amber-500 italic">Us</span>
          </motion.h1>
        </div>

        {/* Main Layout - Stacked on mobile, 12-col grid on desktop */}
        <div className="flex-grow flex flex-col lg:grid lg:grid-cols-12 gap-6 min-h-0 mb-4">
          
          {/* LEFT: Main Contact & Map (8 Cols on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="order-1 lg:order-none lg:col-span-8 flex flex-col min-h-0"
          >
            <div className="flex-grow bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 md:p-8 flex flex-col overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                
                {/* Contact List */}
                <div className="flex flex-col justify-between py-2 space-y-8 md:space-y-0">
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif text-white mb-6">Network Nodes</h2>
                    <ContactItem icon={FaMapMarkerAlt} title="Location" content="Jaipur, Rajasthan" />
                    <ContactItem icon={FaEnvelope} title="Email" content="nextgenova28@gmail.com" link="mailto:nextgenova28@gmail.com" />
                    <ContactItem icon={FaPhone} title="Phone" content="+91 94139 73399" link="tel:+919413973399" />
                  </div>
                  
                  <div className="pt-6">
                    <h3 className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-4">Social Uplink</h3>
                    <div className="flex space-x-3">
                      {[
                        { icon: FaGithub, link: "https://github.com/NEGO2522/Brain-Forge", color: "hover:border-white hover:text-white" },
                        { icon: FaDiscord, link: "#", color: "hover:border-[#5865F2] hover:text-[#5865F2]" },
                        { icon: FaLinkedin, link: "https://www.linkedin.com/company/brainforge16", color: "hover:border-[#0077b5] hover:text-[#0077b5]" }
                      ].map((social, i) => (
                        <a 
                          key={i} 
                          href={social.link} 
                          className={`w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 bg-white/5 ${social.color}`}
                        >
                          <social.icon className="text-lg" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Section - Adjusted min-height for mobile */}
                <div className="relative rounded-[1.5rem] overflow-hidden border border-white/10 h-[250px] md:h-full min-h-[200px] bg-black/40">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.382562431!2d75.71397335!3d26.8851417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adb4a9da627%3A0x518161f7afcd6391!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                    width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.8)' }} 
                    allowFullScreen="" loading="lazy" title="Jaipur Map"
                  />
                  <div className="absolute inset-0 pointer-events-none border-[8px] border-black/20 rounded-[1.5rem]"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Join Card (4 Cols on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 lg:order-none lg:col-span-4 flex flex-col min-h-0"
          >
            <div className="flex-grow bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-xl rounded-[2rem] border border-amber-500/20 p-8 flex flex-col justify-between items-center text-center">
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <RotatingFanIcon>
                    <div className="w-16 h-16 rounded-full bg-amber-500/5 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                      <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </RotatingFanIcon>
                </div>
                
                <h2 className="text-2xl font-serif text-white mb-2 italic">Brain Forge</h2>
                <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
                  Join our elite circle of innovators and master the digital frontier.
                </p>
              </div>

              <div className="w-full space-y-3 my-8 md:my-6 flex-grow flex flex-col justify-center">
                {["Elite Network", "Tech Ecosystem", "Expert Mentorship"].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-left bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-amber-500 text-black font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-[0_10px_30px_rgba(251,191,36,0.2)]"
              >
                <span>JOIN THE FORGE</span>
                <FaChevronRight className="text-[10px]" />
              </motion.button>
            </div>
          </motion.div>

        </div>

        {/* Footer Branding */}
        <div className="flex-shrink-0 text-center mt-6 lg:mt-2">
          <p className="text-[8px] tracking-[0.8em] text-white/20 uppercase font-bold">Organized By Kshitij Jain</p>
        </div>
      </div>
    </div>
  );
};

export default Connect;