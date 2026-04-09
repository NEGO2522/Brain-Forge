import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';
import { FiSearch, FiBookOpen } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const ALL_EDUCATORS = [
  { name: "Code With Harry", field: "Full Stack & DSA", github: "codewithharry", linkedin: "company/code-with-harry/", youtube: "CodeWithHarry", instagram: "codewithharry" },
  { name: "Kunal Kushwaha", field: "DevOps & Open Source", github: "kunal-kushwaha", linkedin: "in/kunal-kushwaha/", youtube: "KunalKushwaha", instagram: "kunalk09" },
  { name: "Hitesh Choudhary", field: "JavaScript & Backend", github: "hiteshchoudhary", linkedin: "company/chaicodehq/", youtube: "HiteshChoudharydotcom", instagram: "hiteshchoudharyofficial" },
  { name: "freeCodeCamp", field: "Web Dev & CS Fundamentals", github: "freeCodeCamp", linkedin: "school/free-code-camp/", youtube: "freecodecamp", instagram: "freecodecamp" },
  { name: "Krish Naik", field: "Machine Learning & AI", github: "krishnaik06", linkedin: "in/naikkrish/", youtube: "krishnaik06", instagram: "krishnaik06" },
  { name: "Apna College", field: "DSA & Placement Prep", github: "apna-college", linkedin: "company/apna-college/", youtube: "ApnaCollegeOfficial", instagram: "apna.college" },
  { name: "Traversy Media", field: "Full Stack & Frameworks", github: "bradtraversy", linkedin: "in/bradtraversy/", youtube: "TraversyMedia", instagram: "traversymedia" },
  { name: "Fireship", field: "Modern Web & Tools", github: "codediodeio", linkedin: "in/jeff-delaney/", youtube: "Fireship", instagram: "fireshipio" },
  { name: "The Coding Train", field: "Creative Coding & Algorithms", github: "CodingTrain", linkedin: "in/daniel-shiffman/", youtube: "TheCodingTrain", instagram: "thecodingtrain" },
  { name: "Clever Programmer", field: "React & JavaScript", github: "CleverProgrammer", linkedin: "in/qazi-imtiaz-ali/", youtube: "CleverProgrammer", instagram: "cleverprogrammer" },
  { name: "Tech With Tim", field: "Python & Machine Learning", github: "techwithtim", linkedin: "in/tim-ruscica/", youtube: "TechWithTim", instagram: "techwithtim" },
  { name: "Kevin Powell", field: "CSS & Frontend Design", github: "kevin-powell", linkedin: "in/kevinpowell6/", youtube: "KevinPowell", instagram: "kevinpowell6" },
  { name: "Academind", field: "React, Node & Cloud", github: "academind", linkedin: "company/academind/", youtube: "Academind", instagram: "academind_web" },
  { name: "Sonny Sangha", field: "Full Stack React", github: "sonnysangha", linkedin: "in/sonny-sangha/", youtube: "SonnySangha", instagram: "sonnysangha" },
  { name: "CS50 Harvard", field: "CS Fundamentals", github: "cs50", linkedin: "company/cs50/", youtube: "cs50", instagram: "cs50" },
  { name: "Piyush Garg", field: "Node.js & System Design", github: "piyushgarg-dev", linkedin: "in/piyushgarg97/", youtube: "PiyushGargDev", instagram: "piyushgarg.dev" },
  { name: "Sheriyans Coding School", field: "MERN Stack & Projects", github: "sheriyanscoding", linkedin: "company/sheriyanscode/", youtube: "SheriyanscodingSchool", instagram: "sheriyanscode" },
  { name: "Chai aur Code", field: "JavaScript & Backend", github: "hiteshchoudhary", linkedin: "company/chaicodehq/", youtube: "ChaiAurCode", instagram: "chaiaurcode" },
  { name: "Programming with Mosh", field: "Clean Code & Best Practices", github: "mosh-hamedani", linkedin: "in/moshhamedani/", youtube: "programmingwithmosh", instagram: "programmingwithmosh" },
  { name: "Codevolution", field: "React & TypeScript", github: "gopinav", linkedin: "in/gopinav/", youtube: "Codevolution", instagram: "codevolution_" },
  { name: "Web Dev Simplified", field: "JavaScript & Web APIs", github: "WebDevSimplified", linkedin: "in/kyle-cook-web-dev-simplified/", youtube: "WebDevSimplified", instagram: "webdevsimplified" },
  { name: "Neetcode", field: "DSA & LeetCode", github: "neetcode-gh", linkedin: "in/navdeep-singh-9b7751168/", youtube: "NeetCode", instagram: "neetcode_io" },
  { name: "NetworkChuck", field: "Networking & Cybersecurity", github: "theNetworkChuck", linkedin: "in/chuckkeith/", youtube: "NetworkChuck", instagram: "networkchuck" },
  { name: "TechWorld with Nana", field: "DevOps & Kubernetes", github: "nanuchi", linkedin: "in/nana-janashia/", youtube: "TechWorldwithNana", instagram: "techworld_with_nana" },
];

const FILTERS = ["All", "Full Stack", "Machine Learning & AI", "DSA", "CSS & Frontend", "Python", "DevOps", "React"];

const Educators = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = ALL_EDUCATORS.filter(e => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.field.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'All' || e.field.toLowerCase().includes(activeFilter.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Georgia', serif" }}>

      {/* Noise texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px',
      }} />

      <Navbar />

      {/* ── HERO HEADER ── */}
      <section className="relative border-b border-black/10 overflow-hidden pt-28">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="relative z-10 px-6 md:px-12 py-16 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-black/15 text-[10px] font-black uppercase tracking-[0.4em] text-black/50 mb-8" style={{ fontFamily: 'sans-serif' }}>
              <FiBookOpen size={10} /> Community Picks
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-[5.5rem] font-serif font-bold leading-[0.92] tracking-tight text-black mb-6">
            Top Educators.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-black/50 max-w-md leading-relaxed mb-10" style={{ fontFamily: 'sans-serif', fontWeight: 400 }}>
            A curated list of educators our community follows and recommends. Learn from the best in development, design, and computer science.
          </motion.p>

          {/* Search + filters */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col gap-4" style={{ fontFamily: 'sans-serif' }}>
            <div className="relative max-w-lg">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={15} />
              <input
                type="text"
                placeholder="Search by name or topic…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-4 pl-11 pr-5 border border-black/15 bg-white outline-none text-sm text-black placeholder-black/30 font-medium focus:border-black transition-colors duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border ${
                    activeFilter === f
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-black/15 text-black/45 hover:border-black hover:text-black'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-6 text-[10px] uppercase tracking-[0.4em] font-black text-black/30" style={{ fontFamily: 'sans-serif' }}>
            Showing {filtered.length} of {ALL_EDUCATORS.length} educators
          </motion.p>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto relative z-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8">
            {filtered.map((edu, i) => (
              <motion.div
                key={edu.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group bg-white border border-transparent hover:border-black transition-all duration-300 flex flex-col p-6 gap-5"
                style={{ fontFamily: 'sans-serif' }}
              >
                <div className="flex-grow">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">{edu.field}</p>
                  <h3 className="text-base font-black uppercase tracking-[0.1em] text-black group-hover:text-black leading-tight">
                    {edu.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  {edu.youtube && (
                    <a href={`https://youtube.com/@${edu.youtube}`} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center w-8 h-8 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                      <FaYoutube size={13} />
                    </a>
                  )}
                  {edu.instagram && (
                    <a href={`https://instagram.com/${edu.instagram}`} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center w-8 h-8 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                      <FaInstagram size={13} />
                    </a>
                  )}
                  {edu.github && (
                    <a href={`https://github.com/${edu.github}`} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center w-8 h-8 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                      <FaGithub size={13} />
                    </a>
                  )}
                  {edu.linkedin && (
                    <a href={`https://linkedin.com/${edu.linkedin}`} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center w-8 h-8 border border-black/15 text-black/40 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                      <FaLinkedin size={13} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-start gap-4" style={{ fontFamily: 'sans-serif' }}>
            <FiBookOpen size={32} className="text-black/20" />
            <p className="font-serif italic text-2xl text-black/40">No educators found.</p>
            <p className="text-[10px] uppercase tracking-widest font-black text-black/25">Try a different search or filter</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Educators;
