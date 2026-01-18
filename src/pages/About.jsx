import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaRocket, FaUserFriends, FaQuoteLeft } from 'react-icons/fa';

const InfoCard = ({ icon: Icon, title, text, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:border-amber-500/30 transition-all group w-full"
  >
    <div className="flex items-start space-x-4">
      <div className="bg-amber-500/10 p-3 rounded-xl group-hover:bg-amber-500/20 transition-colors shrink-0">
        <Icon className="text-amber-500 text-xl" />
      </div>
      <div>
        <h3 className="text-amber-500 font-serif text-xl mb-2 italic">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  </motion.div>
);

const About = () => {
  return (
    // min-h-screen ensures it takes full height on desktop but can expand on mobile
    <div className="min-h-screen lg:h-screen w-full bg-black text-white relative overflow-x-hidden flex flex-col pt-32 lg:pt-24 pb-12 lg:pb-8 px-6">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-5%] w-[50%] lg:w-[35%] h-[35%] bg-amber-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] lg:w-[35%] h-[35%] bg-blue-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full h-full flex flex-col lg:flex-row gap-16 lg:gap-12 relative z-10">
        
        {/* LEFT SIDE: Branding & Mission */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="text-amber-500 font-bold tracking-[0.5em] text-[10px] uppercase block">
              Manifesto / 01
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight">
              The <span className="text-amber-500 italic">Forge</span> <br /> 
              of Ideas.
            </h1>
            <div className="h-1 w-24 bg-amber-500 shadow-[0_0_15px_#fbbf24] mb-8" />
            
            <div className="relative p-6 lg:p-8 bg-white/5 border-l-2 border-amber-500 rounded-r-2xl max-w-md">
              <FaQuoteLeft className="text-amber-500/20 text-3xl lg:text-4xl absolute top-4 left-4" />
              <p className="text-gray-300 italic text-base lg:text-lg relative z-10 pl-6">
                "Building a space where passion meets professional excellence, one connection at a time."
              </p>
              <p className="mt-4 text-amber-500 font-bold text-[10px] lg:text-xs tracking-widest uppercase pl-6">
                — Kshitij Jain, Founder
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Content Cards */}
        {/* Added lg:overflow-y-auto to preserve your desktop scroll behavior */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4 lg:overflow-y-auto pr-2 custom-scrollbar">
          <InfoCard 
            icon={FaUserFriends}
            title="Who We Are"
            text="Brain Forge is a community-driven platform built for the curious and the motivated. We provide a digital sanctuary where ideas are shared, and meaningful connections are forged in the fire of collaboration."
            delay={0.1}
          />
          
          <InfoCard 
            icon={FaRocket}
            title="The Mission"
            text="We exist to eliminate the noise. By organizing interest-based communities in one high-vibrancy hub, we encourage thoughtful, value-driven interaction for the next generation of leaders."
            delay={0.2}
          />

          <InfoCard 
            icon={FaLightbulb}
            title="The Vision"
            text="For students, developers, and creators who refuse to be average. Brain Forge is the ecosystem where you don't just learn—you evolve alongside a network of like-minded peers."
            delay={0.3}
          />

          {/* Bottom Branding */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="pt-6 text-center lg:text-left"
          >
            <p className="text-[9px] tracking-[0.6em] text-white/20 uppercase font-bold">
              EST. 2026 • Brain Forge Ecosystem
            </p>
          </motion.div>
        </div>
      </div>

      {/* Global Signature */}
      <div className="mt-12 lg:mt-0 lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2 opacity-10 pointer-events-none text-center">
        <p className="text-[8px] tracking-[1em] uppercase font-black">Organized By Kshitij Jain</p>
      </div>
    </div>
  );
};

export default About;