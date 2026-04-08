import React from 'react';
import useSEO from '../hooks/useSEO';
import { motion } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiSearch, FiBookOpen } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';

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
  useSEO({
    title: 'About',
    description: 'Learn about Linkaura — a community platform where students and developers connect, chat, and grow together.',
    keywords: 'about linkaura, community platform, developer networking, student community',
  });

  return (
    <div className="min-h-screen lg:h-screen w-full bg-black text-white relative overflow-x-hidden flex flex-col pt-32 lg:pt-24 pb-12 lg:pb-8 px-6">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-5%] w-[50%] lg:w-[35%] h-[35%] bg-amber-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[50%] lg:w-[35%] h-[35%] bg-amber-500/5 rounded-full blur-[80px] lg:blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full h-full flex flex-col lg:flex-row gap-16 lg:gap-12 relative z-10">

        {/* LEFT: Branding & Quote */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <span className="text-amber-500 font-bold tracking-[0.5em] text-[10px] uppercase block">
              About / 01
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight">
              Link<span className="text-amber-500 italic">aura</span>. <br />
              Where Builders Meet.
            </h1>
            <div className="h-1 w-24 bg-amber-500 shadow-[0_0_15px_#fbbf24] mb-8" />

            <div className="relative p-6 lg:p-8 bg-white/5 border-l-2 border-amber-500 rounded-r-2xl max-w-md">
              <FaQuoteLeft className="text-amber-500/20 text-3xl lg:text-4xl absolute top-4 left-4" />
              <p className="text-gray-300 italic text-base lg:text-lg relative z-10 pl-6">
                "We built Linkaura because finding the right people to learn and build with shouldn't be hard."
              </p>

            </div>
          </motion.div>
        </div>

        {/* RIGHT: Info Cards */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4 lg:overflow-y-auto pr-2">
          <InfoCard
            icon={FiUsers}
            title="Who We Are"
            text="Linkaura is a community platform built for students, developers, and creators. We bring people together so you can find others who share your interests, tech stack, and goals — without the noise."
            delay={0.1}
          />
          <InfoCard
            icon={FiSearch}
            title="Discover Profiles"
            text="Browse real profiles of people in our community. Filter by tech stack, location, and year. Every profile is someone you can actually reach out to and collaborate with."
            delay={0.2}
          />
          <InfoCard
            icon={FiMessageSquare}
            title="Chat Directly"
            text="Found someone interesting? Message them directly on the platform — no middlemen, no email required. Just a simple real-time conversation to start building something together."
            delay={0.3}
          />
          <InfoCard
            icon={FiBookOpen}
            title="Learn Together"
            text="We curate top educators in development and design so you always know where to learn next. From DSA to full stack to AI — the community recommends the best resources."
            delay={0.4}
          />

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="pt-4 text-center lg:text-left">
            <p className="text-[9px] tracking-[0.6em] text-white/20 uppercase font-bold">
              EST. 2026 • Linkaura Community Platform
            </p>
          </motion.div>
        </div>
      </div>


    </div>
  );
};

export default About;
